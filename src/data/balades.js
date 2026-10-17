// The 6 balades. Waypoints are rough loops around the pension (examples).
// On the Mapbox map they are snapped to real paths with the Mapbox Directions API.
// Replace them with real GPX tracks later (see README).
// difficulty: 1 = facile, 2 = moyen, 3 = sportif. climb = dénivelé positif (m), approximate.

export const home = { lat: 47.6211232201384, lon: 7.244801178858209 }

export const balades = [
  {
    "id": "petit-tour",
    "name": "Le petit tour",
    "color": "#e0a33a",
    "difficulty": 1,
    "climb": 40,
    "ground": "Chemins herbeux et agricoles",
    "note": "Idéal pour une sortie en main ou un jeune cheval.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.24409,
        47.62465
      ],
      [
        7.24823,
        47.6268
      ],
      [
        7.25284,
        47.626
      ],
      [
        7.25633,
        47.62344
      ],
      [
        7.25393,
        47.6202
      ],
      [
        7.24911,
        47.61953
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  },
  {
    "id": "vergers",
    "name": "La boucle des vergers",
    "color": "#c0583f",
    "difficulty": 1,
    "climb": 70,
    "ground": "Chemins de terre, un peu de goudron",
    "note": "Tranquille, à faire toute l’année.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.25298,
        47.62187
      ],
      [
        7.25796,
        47.61752
      ],
      [
        7.25612,
        47.61266
      ],
      [
        7.25016,
        47.60898
      ],
      [
        7.24265,
        47.61151
      ],
      [
        7.24111,
        47.61658
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  },
  {
    "id": "foret",
    "name": "Le chemin de la forêt",
    "color": "#3f7a4a",
    "difficulty": 2,
    "climb": 120,
    "ground": "Chemins forestiers, ombragés",
    "note": "Agréable l’été, boueux après la pluie.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.25188,
        47.61496
      ],
      [
        7.24753,
        47.60784
      ],
      [
        7.2375,
        47.60595
      ],
      [
        7.22672,
        47.60824
      ],
      [
        7.22601,
        47.61615
      ],
      [
        7.23405,
        47.62096
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  },
  {
    "id": "ill",
    "name": "Vers la vallée de l’Ill",
    "color": "#3b7ea1",
    "difficulty": 2,
    "climb": 110,
    "ground": "Chemins agricoles, passage près de l’eau",
    "note": "Quelques belles lignes droites pour trotter.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.23305,
        47.61499
      ],
      [
        7.21947,
        47.61876
      ],
      [
        7.21586,
        47.62745
      ],
      [
        7.22023,
        47.63679
      ],
      [
        7.23532,
        47.63741
      ],
      [
        7.24449,
        47.63044
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  },
  {
    "id": "crete",
    "name": "La crête du Sundgau",
    "color": "#8a5aa8",
    "difficulty": 3,
    "climb": 220,
    "ground": "Montées en forêt, chemins caillouteux par endroits",
    "note": "Pour les chevaux en forme. Prévoir des fers ou des hipposandales.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.23013,
        47.63011
      ],
      [
        7.23434,
        47.64299
      ],
      [
        7.25043,
        47.64821
      ],
      [
        7.26964,
        47.6465
      ],
      [
        7.27433,
        47.63329
      ],
      [
        7.26287,
        47.62356
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  },
  {
    "id": "grande",
    "name": "La grande journée",
    "color": "#6b5a3a",
    "difficulty": 3,
    "climb": 280,
    "ground": "Variée : forêt, champs, villages",
    "note": "Une demi-journée, avec une pause pique-nique.",
    "waypoints": [
      [
        7.2448,
        47.62112
      ],
      [
        7.24376,
        47.60333
      ],
      [
        7.22063,
        47.59517
      ],
      [
        7.19894,
        47.60179
      ],
      [
        7.18506,
        47.61648
      ],
      [
        7.20106,
        47.63103
      ],
      [
        7.22562,
        47.63148
      ],
      [
        7.2448,
        47.62112
      ]
    ]
  }
]
