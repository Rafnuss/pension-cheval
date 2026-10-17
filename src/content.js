// All site text lives here: edit this file to change the content.
// Images go in public/images/ (paths below are relative to that folder).
// The balades (routes) are in src/data/balades.js.

export const site = {
  name: 'SCEA Nussbaumer',
  subtitle: 'Pension de chevaux · Altkirch',
  footer: 'Une ferme familiale à Altkirch, dans le Sundgau',
}

export const nav = [
  { id: 'famille', label: 'Chez nous' },
  { id: 'pension', label: 'La pension' },
  { id: 'balades', label: 'Balades' },
  { id: 'galerie', label: 'Photos' },
  { id: 'camera', label: 'Caméra' },
  { id: 'contact', label: 'Contact' },
]

export const hero = {
  hello: 'Bienvenue à la ferme !',
  title: 'Ici, les chevaux vivent dehors, en troupeau, toute l’année.',
  text: 'Nous sommes une famille d’agriculteurs à Altkirch. On accueille quelques chevaux en pension au pré, et on passe les voir tous les jours.',
  cta: { label: 'Venir nous voir', to: 'contact' },
}

export const family = {
  title: 'Une petite pension, tenue en famille',
  paragraphs: [
    'La pension, c’est d’abord la ferme : des prés vallonnés, des haies, un abri, et beaucoup d’herbe. Les parents s’occupent des chevaux, les deux filles donnent un coup de main (surtout pour les carottes), et le chien ne rate jamais une visite au pré.',
    'On garde volontairement peu de chevaux, pour que chacun ait sa place et qu’on connaisse bien chaque caractère. Les propriétaires viennent quand ils veulent, et on prend le temps de discuter.',
  ],
  facts: [
    { value: '5–10', label: 'chevaux au pré' },
    { value: '365', label: 'jours dehors par an' },
    { value: '1×', label: 'visite par jour, minimum' },
    { value: '6', label: 'balades depuis la ferme' },
  ],
}

export const pension = {
  title: 'Comment ça se passe',
  items: [
    { icon: 'sun', title: 'Au pré, à l’année', text: 'Les chevaux vivent dehors en troupeau, dans des parcs vallonnés avec un abri.' },
    { icon: 'eye', title: 'On passe tous les jours', text: 'On vérifie l’eau, les clôtures et l’état de chaque cheval. Si quelque chose ne va pas, on vous appelle.' },
    { icon: 'path', title: 'Les balades partent d’ici', text: 'Pas besoin de van : les chemins commencent au bout du pré.' },
    { icon: 'home', title: 'Sellerie sur place', text: 'Un coin pour ranger selle, filet et brosses. Une carrière est en construction.' },
  ],
  price: '200 €',
  per: 'par mois',
  priceTitle: 'Pension au pré',
  includes: ['Pré et abri', 'Visite quotidienne', 'Accès aux chemins', 'Sellerie'],
  note: 'On peut adapter selon votre cheval (foin l’hiver, soins particuliers…). Parlons-en.',
}

export const balades = {
  title: 'Six balades au départ de la ferme',
  text: 'Passez la souris sur un parcours (ou touchez-le) pour voir la distance, le temps au pas et la difficulté pour le cheval.',
}

export const gallery = [
  { src: 'troupeau-prairie.jpg', alt: 'Chevaux au pâturage' },
  { src: 'cheval-chemin.jpg', alt: 'Cheval sur un chemin bordé d’arbres' },
  { src: 'paturage-chevaux.jpg', alt: 'Chevaux dans la prairie' },
  { src: 'abri-prairie.jpg', alt: 'Abri dans la prairie' },
  { src: 'prairie-balade.jpg', alt: 'Prairie et chemins de balade' },
  { src: 'troupeau-prairie-2.jpg', alt: 'Le troupeau dans le parc' },
]

export const camera = {
  title: 'La caméra du pré',
  text: 'Pour les propriétaires : jetez un œil à votre cheval quand vous voulez, depuis votre téléphone.',
  // MOCKUP: a password checked in the browser only keeps casual visitors out.
  // Anyone who reads the page source can find it. See README for real options.
  password: 'carotte',
  cams: [
    { id: 'pre', label: 'Le pré du haut' },
    { id: 'abri', label: 'L’abri' },
    { id: 'portail', label: 'Le portail' },
  ],
}

export const contact = {
  title: 'Passez nous voir !',
  text: 'Le mieux, c’est de venir voir les chevaux et le pré. Appelez-nous ou laissez un message, on vous rappelle.',
  phones: ['+33 6 18 71 06 61', '+33 6 79 61 84 13'],
  email: 'silvain.nussbaumer@gmail.com',
  location: 'Altkirch, Sundgau',
  // Free form backend for static sites: create a form at https://formspree.io
  // and paste its id here (e.g. 'xyzabcd'). If left empty, the form opens the
  // visitor's email app instead.
  formspreeId: '',
}
