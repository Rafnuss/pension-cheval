// Cloudflare Worker: checks the owners' password, then asks the Imou Open Platform
// for an HLS live URL of the camera. The Imou secret never reaches the browser.

const enc = new TextEncoder()
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

async function sign(appSecret, time, nonce) {
  const password = hex(await crypto.subtle.digest('SHA-256', enc.encode(appSecret)))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`time:${time},nonce:${nonce},appSecret:${appSecret}`))
  return btoa(String.fromCharCode(...new Uint8Array(mac)))
}

async function imou(env, method, params = {}) {
  const time = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomUUID()
  const res = await fetch(`https://openapi-${env.IMOU_REGION}.easy4ip.com/openapi/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: { ver: '1.0', appId: env.IMOU_APP_ID, sign: await sign(env.IMOU_APP_SECRET, time, nonce), time, nonce },
      id: crypto.randomUUID(),
      params,
    }),
  })
  const json = await res.json()
  return json.result || {}
}

// Module-level cache: lives as long as the isolate does, which is fine, we just refetch otherwise.
let token = { value: null, until: 0 }
async function accessToken(env) {
  if (token.value && Date.now() < token.until) return token.value
  const r = await imou(env, 'accessToken')
  if (r.code !== '0') throw new Error(`accessToken: ${r.code} ${r.msg}`)
  token = { value: r.data.accessToken, until: Date.now() + Math.min(r.data.expireTime, 86400) * 1000 - 60000 }
  return token.value
}

const pickHls = (streams = []) => {
  const https = streams.filter((s) => s.hls?.startsWith('https'))
  const list = https.length ? https : streams
  // Prefer the sub stream (streamId 1): usually H.264, which every browser decodes; the HD main stream may be H.265.
  return (list.find((s) => s.streamId === 1) || list[0])?.hls
}

async function liveUrl(env) {
  const t = await accessToken(env)
  const base = { token: t, deviceId: env.IMOU_DEVICE_ID, channelId: env.IMOU_CHANNEL }
  let r = await imou(env, 'getLiveStreamInfo', base)
  let url = r.code === '0' && pickHls(r.data?.streams)
  if (!url) {
    // No live address yet: create one (HD main stream), then read all addresses back.
    const b = await imou(env, 'bindDeviceLive', { ...base, streamId: 0 })
    if (b.code !== '0') throw new Error(`bindDeviceLive: ${b.code} ${b.msg}`)
    r = await imou(env, 'getLiveStreamInfo', base)
    url = pickHls(r.data?.streams) || pickHls(b.data?.streams)
  }
  if (!url) throw new Error('no live url')
  return url
}

const safeEqual = async (a, b) => {
  const [x, y] = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))))
  const [u, v] = [new Uint8Array(x), new Uint8Array(y)]
  let d = 0
  for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i]
  return d === 0
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = env.ALLOWED_ORIGINS.split(',').includes(origin)
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    }
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST' || !allowed) return reply({ error: 'forbidden' }, 403)

    let password = ''
    try { password = String((await request.json()).password || '') } catch { /* empty */ }
    if (!(await safeEqual(password.trim().toLowerCase(), env.CAM_PASSWORD.trim().toLowerCase()))) {
      await new Promise((r) => setTimeout(r, 800))
      return reply({ error: 'wrong_password' }, 401)
    }
    try {
      return reply({ hls: await liveUrl(env) })
    } catch (e) {
      return reply({ error: 'camera_unavailable', detail: String(e.message || e) }, 502)
    }
  },
}
