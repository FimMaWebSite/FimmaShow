import { Language } from './translations';

export const DEFAULT_WORDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "czarodziej",
        "blizna",
        "Hogwart"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Telefon",
      "forbidden": [
        "dzwonić",
        "komórka",
        "pisać"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "jeść",
        "włoska",
        "ser"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "wizard",
        "scar",
        "Hogwarts"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Phone",
      "forbidden": [
        "call",
        "mobile",
        "text"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "eat",
        "italian",
        "cheese"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "Zauberer",
        "Narbe",
        "Hogwarts"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Telefon",
      "forbidden": [
        "anrufen",
        "Handy",
        "schreiben"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "essen",
        "italienisch",
        "Käse"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "mago",
        "cicatriz",
        "Hogwarts"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Teléfono",
      "forbidden": [
        "llamar",
        "móvil",
        "escribir"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "comer",
        "italiana",
        "queso"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "magicien",
        "cicatrice",
        "Hogwarts"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Téléphone",
      "forbidden": [
        "appeler",
        "portable",
        "écrire"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "manger",
        "italienne",
        "fromage"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "tb1",
      "word": "Harry Potter",
      "forbidden": [
        "mago",
        "cicatrice",
        "Hogwarts"
      ],
      "category": "Postacie",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb2",
      "word": "Telefono",
      "forbidden": [
        "chiamare",
        "cellulare",
        "scrivere"
      ],
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "tb3",
      "word": "Pizza",
      "forbidden": [
        "mangiare",
        "italiana",
        "formaggio"
      ],
      "category": "Jedzenie",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_NINE_SECONDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "ns1",
      "question": "Wymień postacie z Marvela",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Wymień marki smartfonów",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Wymień polskich sportowców",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Wymień postacie z Harry'ego Pottera",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Wymień stolice europejskie",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "ns1",
      "question": "Name Marvel characters",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Name smartphone brands",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Name famous athletes",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Name Harry Potter characters",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Name European capitals",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "ns1",
      "question": "Nenne Marvel-Charaktere",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Nenne Smartphone-Marken",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Nenne berühmte Sportler",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Nenne Harry-Potter-Charaktere",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Nenne europäische Hauptstädte",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "ns1",
      "question": "Nombra personajes de Marvel",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Nombra marcas de smartphones",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Nombra atletas famosos",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Nombra personajes de Harry Potter",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Nombra capitales europeas",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "ns1",
      "question": "Nommez des personnages de Marvel",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Nommez des marques de smartphones",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Nommez des athlètes célèbres",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Nommez des personnages de Harry Potter",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Nommez des capitales européennes",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "ns1",
      "question": "Nomina personaggi Marvel",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns2",
      "question": "Nomina marche di smartphone",
      "category": "Technologia",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns3",
      "question": "Nomina atleti famosi",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns4",
      "question": "Nomina personaggi di Harry Potter",
      "category": "Popkultura",
      "difficulty": "Łatwy"
    },
    {
      "id": "ns5",
      "question": "Nomina capitali europee",
      "category": "Geografia",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_REVERSE_CHARADES: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "rc1",
      "question": "Lekarz",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Kot",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Narciarz",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Piłkarz",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Kucharz",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Bokser",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Fotograf",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirat",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Kelner",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Małpa",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "rc1",
      "question": "Doctor",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Cat",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Skier",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Footballer",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Chef",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Boxer",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Photographer",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirate",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Waiter",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Monkey",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "rc1",
      "question": "Arzt",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Katze",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Skifahrer",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Fußballer",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Koch",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Boxer",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Fotograf",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirat",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Kellner",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Affe",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "rc1",
      "question": "Médico",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Gato",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Esquiador",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Futbolista",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Cocinero",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Boxeador",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Fotógrafo",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirata",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Camarero",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Mono",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "rc1",
      "question": "Médecin",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Chat",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Skieur",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Footballeur",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Chef",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Boxeur",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Photographe",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirate",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Serveur",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Singe",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "rc1",
      "question": "Dottore",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc2",
      "question": "Gatto",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc3",
      "question": "Sciatore",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc4",
      "question": "Calciatore",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc5",
      "question": "Cuoco",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc6",
      "question": "Pugile",
      "category": "Sport",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc7",
      "question": "Fotografo",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc8",
      "question": "Pirata",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc9",
      "question": "Cameriere",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rc10",
      "question": "Scimmia",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_BOMB_WORDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "bomb1",
      "word": "Rozmowa o pracę",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Napad na bank",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Panna młoda",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Budzik",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "Prezydent",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Piknik",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermarket",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "Szkoła",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Wakacje",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Kino",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Dentysta",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Deszcz",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Kawa",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Telefon",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Pies",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Kot",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Złoto",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Klucz",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Komputer",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Książka",
      "category": "Przedmioty"
    }
  ],
  "EN": [
    {
      "id": "bomb1",
      "word": "Job interview",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Bank robbery",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Bride",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Alarm clock",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "President",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Picnic",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermarket",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "School",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Vacation",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Cinema",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Dentist",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Rain",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Coffee",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Phone",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Dog",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Cat",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Gold",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Key",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Computer",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Book",
      "category": "Przedmioty"
    }
  ],
  "DE": [
    {
      "id": "bomb1",
      "word": "Vorstellungsgespräch",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Bankraub",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Braut",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Wecker",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "Präsident",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Picknick",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermarkt",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "Schule",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Vacation",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Kino",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Zahnarzt",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Regen",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Kaffee",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Phone",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Hund",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Katze",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Gold",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Schlüssel",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Computer",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Buch",
      "category": "Przedmioty"
    }
  ],
  "ES": [
    {
      "id": "bomb1",
      "word": "Entrevista de trabajo",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Robo al banco",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Novia",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Despertador",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "Presidente",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Picnic",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermercado",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "Escuela",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Vacaciones",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Cine",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Dentista",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Lluvia",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Café",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Teléfono",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Perro",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Gato",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Oro",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Llave",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Ordenador",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Libro",
      "category": "Przedmioty"
    }
  ],
  "FR": [
    {
      "id": "bomb1",
      "word": "Entretien d'embauche",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Braquage de banque",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Mariée",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Réveil",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "Président",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Pique-nique",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermarché",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "École",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Vacances",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Cinéma",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Dentiste",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Pluie",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Café",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Téléphone",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Chien",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Chat",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Or",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Clé",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Ordinateur",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Livre",
      "category": "Przedmioty"
    }
  ],
  "IT": [
    {
      "id": "bomb1",
      "word": "Colloquio di lavoro",
      "category": "Czynności"
    },
    {
      "id": "bomb2",
      "word": "Rapina in banca",
      "category": "Czynności"
    },
    {
      "id": "bomb3",
      "word": "Sposa",
      "category": "Ludzie"
    },
    {
      "id": "bomb4",
      "word": "Sveglia",
      "category": "Przedmioty"
    },
    {
      "id": "bomb5",
      "word": "Presidente",
      "category": "Ludzie"
    },
    {
      "id": "bomb6",
      "word": "Picnic",
      "category": "Rozrywka"
    },
    {
      "id": "bomb7",
      "word": "Supermercato",
      "category": "Miejsca"
    },
    {
      "id": "bomb8",
      "word": "Scuola",
      "category": "Miejsca"
    },
    {
      "id": "bomb9",
      "word": "Vacanze",
      "category": "Rozrywka"
    },
    {
      "id": "bomb10",
      "word": "Cinema",
      "category": "Miejsca"
    },
    {
      "id": "bomb11",
      "word": "Dentista",
      "category": "Ludzie"
    },
    {
      "id": "bomb12",
      "word": "Pioggia",
      "category": "Natura"
    },
    {
      "id": "bomb13",
      "word": "Caffè",
      "category": "Jedzenie"
    },
    {
      "id": "bomb14",
      "word": "Telefono",
      "category": "Przedmioty"
    },
    {
      "id": "bomb15",
      "word": "Cane",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb16",
      "word": "Gatto",
      "category": "Zwierzęta"
    },
    {
      "id": "bomb17",
      "word": "Oro",
      "category": "Przedmioty"
    },
    {
      "id": "bomb18",
      "word": "Chiave",
      "category": "Przedmioty"
    },
    {
      "id": "bomb19",
      "word": "Computer",
      "category": "Przedmioty"
    },
    {
      "id": "bomb20",
      "word": "Libro",
      "category": "Przedmioty"
    }
  ]
};

export const DEFAULT_P_GAME: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "pg1",
      "word": "Książka",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Ptak",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Lekarz",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Plaża",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Zegarek",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "pg1",
      "word": "Book",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Bird",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Doctor",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Beach",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Watch",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "pg1",
      "word": "Buch",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Vogel",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Arzt",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Strand",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Uhr",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "pg1",
      "word": "Libro",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Pájaro",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Médico",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Playa",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Reloj",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "pg1",
      "word": "Livre",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Oiseau",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Médecin",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Plage",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Montre",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "pg1",
      "word": "Libro",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg2",
      "word": "Uccello",
      "category": "Natura",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg3",
      "word": "Dottore",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg4",
      "word": "Spiaggia",
      "category": "Miejsca",
      "difficulty": "Łatwy"
    },
    {
      "id": "pg5",
      "word": "Orologio",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_SPY_LOCATIONS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "sl1",
      "word": "Szkoła podstawowa"
    },
    {
      "id": "sl2",
      "word": "Salon fryzjerski"
    },
    {
      "id": "sl3",
      "word": "ZOO"
    },
    {
      "id": "sl4",
      "word": "Bezludna wyspa"
    },
    {
      "id": "sl5",
      "word": "Urząd skarbowy"
    },
    {
      "id": "sl6",
      "word": "Plaża"
    },
    {
      "id": "sl7",
      "word": "Szpital"
    },
    {
      "id": "sl8",
      "word": "Kino"
    },
    {
      "id": "sl9",
      "word": "Restauracja"
    },
    {
      "id": "sl10",
      "word": "Hotel"
    },
    {
      "id": "sl11",
      "word": "Lotnisko"
    },
    {
      "id": "sl12",
      "word": "Statek kosmiczny"
    }
  ],
  "EN": [
    {
      "id": "sl1",
      "word": "Primary school"
    },
    {
      "id": "sl2",
      "word": "Hair salon"
    },
    {
      "id": "sl3",
      "word": "Zoo"
    },
    {
      "id": "sl4",
      "word": "Desert island"
    },
    {
      "id": "sl5",
      "word": "Tax office"
    },
    {
      "id": "sl6",
      "word": "Beach"
    },
    {
      "id": "sl7",
      "word": "Hospital"
    },
    {
      "id": "sl8",
      "word": "Cinema"
    },
    {
      "id": "sl9",
      "word": "Restaurant"
    },
    {
      "id": "sl10",
      "word": "Hotel"
    },
    {
      "id": "sl11",
      "word": "Airport"
    },
    {
      "id": "sl12",
      "word": "Spaceship"
    }
  ],
  "DE": [
    {
      "id": "sl1",
      "word": "Grundschule"
    },
    {
      "id": "sl2",
      "word": "Friseursalon"
    },
    {
      "id": "sl3",
      "word": "Zoo"
    },
    {
      "id": "sl4",
      "word": "Einsame Insel"
    },
    {
      "id": "sl5",
      "word": "Finanzamt"
    },
    {
      "id": "sl6",
      "word": "Strand"
    },
    {
      "id": "sl7",
      "word": "Krankenhaus"
    },
    {
      "id": "sl8",
      "word": "Kino"
    },
    {
      "id": "sl9",
      "word": "Restaurant"
    },
    {
      "id": "sl10",
      "word": "Hotel"
    },
    {
      "id": "sl11",
      "word": "Flughafen"
    },
    {
      "id": "sl12",
      "word": "Raumschiff"
    }
  ],
  "ES": [
    {
      "id": "sl1",
      "word": "Escuela primaria"
    },
    {
      "id": "sl2",
      "word": "Peluquería"
    },
    {
      "id": "sl3",
      "word": "Zoológico"
    },
    {
      "id": "sl4",
      "word": "Isla desierta"
    },
    {
      "id": "sl5",
      "word": "Oficina de impuestos"
    },
    {
      "id": "sl6",
      "word": "Playa"
    },
    {
      "id": "sl7",
      "word": "Hospital"
    },
    {
      "id": "sl8",
      "word": "Cine"
    },
    {
      "id": "sl9",
      "word": "Restaurante"
    },
    {
      "id": "sl10",
      "word": "Hotel"
    },
    {
      "id": "sl11",
      "word": "Aeropuerto"
    },
    {
      "id": "sl12",
      "word": "Nave espacial"
    }
  ],
  "FR": [
    {
      "id": "sl1",
      "word": "École primaire"
    },
    {
      "id": "sl2",
      "word": "Salon de coiffure"
    },
    {
      "id": "sl3",
      "word": "Zoo"
    },
    {
      "id": "sl4",
      "word": "Île déserte"
    },
    {
      "id": "sl5",
      "word": "Centre des impôts"
    },
    {
      "id": "sl6",
      "word": "Plage"
    },
    {
      "id": "sl7",
      "word": "Hôpital"
    },
    {
      "id": "sl8",
      "word": "Cinéma"
    },
    {
      "id": "sl9",
      "word": "Restaurant"
    },
    {
      "id": "sl10",
      "word": "Hôtel"
    },
    {
      "id": "sl11",
      "word": "Aéroport"
    },
    {
      "id": "sl12",
      "word": "Vaisseau spatial"
    }
  ],
  "IT": [
    {
      "id": "sl1",
      "word": "Scuola primaria"
    },
    {
      "id": "sl2",
      "word": "Salone di bellezza"
    },
    {
      "id": "sl3",
      "word": "Zoo"
    },
    {
      "id": "sl4",
      "word": "Isola deserta"
    },
    {
      "id": "sl5",
      "word": "Ufficio delle imposte"
    },
    {
      "id": "sl6",
      "word": "Spiaggia"
    },
    {
      "id": "sl7",
      "word": "Ospedale"
    },
    {
      "id": "sl8",
      "word": "Cinema"
    },
    {
      "id": "sl9",
      "word": "Ristorante"
    },
    {
      "id": "sl10",
      "word": "Hotel"
    },
    {
      "id": "sl11",
      "word": "Aeroporto"
    },
    {
      "id": "sl12",
      "word": "Astronave"
    }
  ]
};

export const DEFAULT_SPY_QUESTIONS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "sq1",
      "question": "Jakie zapachy tam najczęściej czujemy?"
    },
    {
      "id": "sq2",
      "question": "Czy znajduje się tam coś, co można zjeść?"
    },
    {
      "id": "sq3",
      "question": "Czy ludzie przychodzą tam rano czy w nocy?"
    },
    {
      "id": "sq4",
      "question": "Czy w tym miejscu zwierzęta są mile widziane?"
    },
    {
      "id": "sq5",
      "question": "Czy w tym miejscu jest zazwyczaj głośno?"
    }
  ],
  "EN": [
    {
      "id": "sq1",
      "question": "What smells do we usually smell there?"
    },
    {
      "id": "sq2",
      "question": "Is there something to eat there?"
    },
    {
      "id": "sq3",
      "question": "Do people go there in the morning or at night?"
    },
    {
      "id": "sq4",
      "question": "Are animals welcome in this place?"
    },
    {
      "id": "sq5",
      "question": "Is it usually loud in this place?"
    }
  ],
  "DE": [
    {
      "id": "sq1",
      "question": "Welche Gerüche riechen wir dort normalerweise?"
    },
    {
      "id": "sq2",
      "question": "Gibt es dort etwas zu essen?"
    },
    {
      "id": "sq3",
      "question": "Gehen die Leute morgens oder nachts dorthin?"
    },
    {
      "id": "sq4",
      "question": "Sind Tiere an diesem Ort willkommen?"
    },
    {
      "id": "sq5",
      "question": "Ist es an diesem Ort normalerweise laut?"
    }
  ],
  "ES": [
    {
      "id": "sq1",
      "question": "¿Qué olores solemos oler allí?"
    },
    {
      "id": "sq2",
      "question": "¿Hay algo para comer allí?"
    },
    {
      "id": "sq3",
      "question": "¿La gente va allí por la mañana o por la noche?"
    },
    {
      "id": "sq4",
      "question": "¿Son bienvenidos los animales en este lugar?"
    },
    {
      "id": "sq5",
      "question": "¿Suele haber ruido en este lugar?"
    }
  ],
  "FR": [
    {
      "id": "sq1",
      "question": "Quelles odeurs sent-on habituellement là-bas ?"
    },
    {
      "id": "sq2",
      "question": "Y a-t-il quelque chose à manger là-bas ?"
    },
    {
      "id": "sq3",
      "question": "Les gens y vont-ils le matin ou le soir/la nuit ?"
    },
    {
      "id": "sq4",
      "question": "Les animaux sont-ils les bienvenus dans cet endroit ?"
    },
    {
      "id": "sq5",
      "question": "Est-ce généralement bruyant dans cet endroit ?"
    }
  ],
  "IT": [
    {
      "id": "sq1",
      "question": "Quali odori si sentono di solito lì?"
    },
    {
      "id": "sq2",
      "question": "C'è qualcosa da mangiare lì?"
    },
    {
      "id": "sq3",
      "question": "La gente ci va di mattina o di notte?"
    },
    {
      "id": "sq4",
      "question": "Gli animali sono i benvenuti in questo posto?"
    },
    {
      "id": "sq5",
      "question": "Di solito c'è rumore in questo posto?"
    }
  ]
};

export const DEFAULT_LIPS_WORDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "lp1",
      "word": "Rudy rydz rąbie rzepę",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "Susza suszy suche szosy",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "Krowa pędzi traktorem",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "Złoty puchar króla",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "lp1",
      "word": "Red Fox eats red radishes",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "Dry drought dries dry roads",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "Cow drives a tractor",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "King's golden cup",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "lp1",
      "word": "Roter Fuchs frisst Radieschen",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "Trockene Dürre trocknet Straßen",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "Kuh fährt einen Traktor",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "Goldener Pokal des Königs",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "lp1",
      "word": "El zorro rojo come rábanos",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "La sequía seca los caminos secos",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "La vaca conduce un tractor",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "Copa de oro del rey",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "lp1",
      "word": "Le renard roux mange des radis",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "La sécheresse sèche les routes sèches",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "La vache conduit un tracteur",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "Coupe d'or du roi",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "lp1",
      "word": "La volpe rossa mangia rapanelli",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp2",
      "word": "La siccità asciuga le strade asciutte",
      "category": "Łamańce",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp3",
      "word": "La mucca guida un trattore",
      "category": "Śmieszne",
      "difficulty": "Łatwy"
    },
    {
      "id": "lp4",
      "word": "Coppa d'oro del re",
      "category": "Zwroty",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_REVOLVER_WORDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "rv1",
      "word": "Parasol",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Kot",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Lekarz",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Zakupy",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Telefon",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "EN": [
    {
      "id": "rv1",
      "word": "Umbrella",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Cat",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Doctor",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Shopping",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Phone",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "DE": [
    {
      "id": "rv1",
      "word": "Regenschirm",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Katze",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Arzt",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Einkaufen",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Telefon",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "ES": [
    {
      "id": "rv1",
      "word": "Paraguas",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Gato",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Médico",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Compras",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Teléfono",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "FR": [
    {
      "id": "rv1",
      "word": "Parapluie",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Chat",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Médecin",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Achats",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Téléphone",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ],
  "IT": [
    {
      "id": "rv1",
      "word": "Ombrello",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv2",
      "word": "Gatto",
      "category": "Zwierzęta",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv3",
      "word": "Dottore",
      "category": "Ludzie",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv4",
      "word": "Acquisti",
      "category": "Czynności",
      "difficulty": "Łatwy"
    },
    {
      "id": "rv5",
      "word": "Telefono",
      "category": "Przedmioty",
      "difficulty": "Łatwy"
    }
  ]
};

export const DEFAULT_WAVELENGTH_WORDS: { [key in Language]: any[] } = {
  "PL": [
    {
      "id": "wvl1",
      "opposites": [
        "Zimny",
        "Gorący"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Zły",
        "Dobry"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Tani",
        "Drogi"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Brzydki",
        "Ładny"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Nudny",
        "Ekscytujący"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Bezsensowny",
        "Mądry"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Lekki",
        "Ciężki"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Cichy",
        "Głośny"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Stary",
        "Nowy"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Mokry",
        "Suchy"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Smutny",
        "Wesoły"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Niski",
        "Wysoki"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Ciemny",
        "Jasny"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Miękki",
        "Twardy"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Wolny",
        "Szybki"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Brudny",
        "Czysty"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Okrągły",
        "Kanciasty"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Niedojrzały",
        "Dojrzały"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Tchórzliwy",
        "Odważny"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Niedoceniany",
        "Przeceniany"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Niesmaczny",
        "Pyszny"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Słaby",
        "Silny"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Bezpieczny",
        "Niebezpieczny"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Wąski",
        "Szeroki"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Zdrowy",
        "Chory"
      ]
    }
  ],
  "EN": [
    {
      "id": "wvl1",
      "opposites": [
        "Cold",
        "Hot"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Evil",
        "Good"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Cheap",
        "Expensive"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Ugly",
        "Beautiful"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Boring",
        "Exciting"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Pointless",
        "Smart"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Light",
        "Heavy"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Quiet",
        "Loud"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Old",
        "New"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Wet",
        "Dry"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Sad",
        "Happy"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Short",
        "Tall"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Dark",
        "Bright"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Soft",
        "Hard"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Slow",
        "Fast"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Dirty",
        "Clean"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Round",
        "Sharp"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Immature",
        "Mature"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Cowardly",
        "Brave"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Underrated",
        "Overrated"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Tasteless",
        "Delicious"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Weak",
        "Strong"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Safe",
        "Dangerous"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Narrow",
        "Wide"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Healthy",
        "Sick"
      ]
    }
  ],
  "DE": [
    {
      "id": "wvl1",
      "opposites": [
        "Kalt",
        "Heiß"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Böse",
        "Gut"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Billig",
        "Teuer"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Hässlich",
        "Schön"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Langweilig",
        "Aufregend"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Sinnlos",
        "Schlau"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Leicht",
        "Schwer"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Leise",
        "Laut"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Alt",
        "Neu"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Nass",
        "Trocken"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Traurig",
        "Glücklich"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Klein",
        "Groß"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Dunkel",
        "Hell"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Weich",
        "Hart"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Langsam",
        "Schnell"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Schmutzig",
        "Sauber"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Rund",
        "Eckig"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Unreif",
        "Reif"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Feige",
        "Tapfer"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Unterschätzt",
        "Überbewertet"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Geschmacklos",
        "Köstlich"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Schwach",
        "Stark"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Sicher",
        "Gefährlich"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Eng",
        "Breit"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Gesund",
        "Krank"
      ]
    }
  ],
  "ES": [
    {
      "id": "wvl1",
      "opposites": [
        "Frío",
        "Caliente"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Malvado",
        "Bueno"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Barato",
        "Caro"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Feo",
        "Hermoso"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Aburrido",
        "Emocionante"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Inútil",
        "Inteligente"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Ligero",
        "Pesado"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Silencioso",
        "Ruidoso"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Viejo",
        "Nuevo"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Mojado",
        "Seco"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Triste",
        "Feliz"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Bajo",
        "Alto"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Oscuro",
        "Brillante"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Suave",
        "Duro"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Lento",
        "Rápido"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Sucio",
        "Limpio"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Redondo",
        "Afilado"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Inmaduro",
        "Maduro"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Cobarde",
        "Valiente"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Subestimado",
        "Sobrestimado"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Insípido",
        "Delicioso"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Débil",
        "Fuerte"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Seguro",
        "Peligroso"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Estrecho",
        "Ancho"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Sano",
        "Enfermo"
      ]
    }
  ],
  "FR": [
    {
      "id": "wvl1",
      "opposites": [
        "Froid",
        "Chaud"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Méchant",
        "Gentil"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Pas cher",
        "Cher"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Laid",
        "Beau"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Ennuyeux",
        "Excitant"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Inutile",
        "Intelligent"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Léger",
        "Lourd"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Calme",
        "Bruyant"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Vieux",
        "Nouveau"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Mouillé",
        "Sec"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Triste",
        "Joyeux"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Petit",
        "Grand"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Sombre",
        "Lumineux"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Doux",
        "Dur"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Lent",
        "Rapide"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Sale",
        "Propre"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Rond",
        "Pointu"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Immature",
        "Mûr"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Lâche",
        "Courageux"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Sous-estimé",
        "Surfait"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Insipide",
        "Délicieux"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Faible",
        "Fort"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Sûr",
        "Dangereux"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Étroit",
        "Large"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Sain",
        "Malade"
      ]
    }
  ],
  "IT": [
    {
      "id": "wvl1",
      "opposites": [
        "Freddo",
        "Caldo"
      ]
    },
    {
      "id": "wvl2",
      "opposites": [
        "Cattivo",
        "Buono"
      ]
    },
    {
      "id": "wvl3",
      "opposites": [
        "Economico",
        "Costoso"
      ]
    },
    {
      "id": "wvl4",
      "opposites": [
        "Brutto",
        "Bello"
      ]
    },
    {
      "id": "wvl5",
      "opposites": [
        "Noioso",
        "Emozionante"
      ]
    },
    {
      "id": "wvl6",
      "opposites": [
        "Inutile",
        "Intelligente"
      ]
    },
    {
      "id": "wvl7",
      "opposites": [
        "Leggero",
        "Pesante"
      ]
    },
    {
      "id": "wvl8",
      "opposites": [
        "Silenzioso",
        "Rumoroso"
      ]
    },
    {
      "id": "wvl9",
      "opposites": [
        "Vecchio",
        "Nuovo"
      ]
    },
    {
      "id": "wvl10",
      "opposites": [
        "Bagnato",
        "Asciutto"
      ]
    },
    {
      "id": "wvl11",
      "opposites": [
        "Triste",
        "Felice"
      ]
    },
    {
      "id": "wvl12",
      "opposites": [
        "Basso",
        "Alto"
      ]
    },
    {
      "id": "wvl13",
      "opposites": [
        "Buio",
        "Luminoso"
      ]
    },
    {
      "id": "wvl14",
      "opposites": [
        "Morbido",
        "Duro"
      ]
    },
    {
      "id": "wvl15",
      "opposites": [
        "Lento",
        "Veloce"
      ]
    },
    {
      "id": "wvl16",
      "opposites": [
        "Sporco",
        "Pulito"
      ]
    },
    {
      "id": "wvl17",
      "opposites": [
        "Rotondo",
        "Tagliente"
      ]
    },
    {
      "id": "wvl18",
      "opposites": [
        "Immaturo",
        "Maturo"
      ]
    },
    {
      "id": "wvl19",
      "opposites": [
        "Codardo",
        "Coraggioso"
      ]
    },
    {
      "id": "wvl20",
      "opposites": [
        "Sottovalutato",
        "Sopravvalutato"
      ]
    },
    {
      "id": "wvl21",
      "opposites": [
        "Insipido",
        "Delizioso"
      ]
    },
    {
      "id": "wvl22",
      "opposites": [
        "Debole",
        "Forte"
      ]
    },
    {
      "id": "wvl23",
      "opposites": [
        "Sicuro",
        "Pericoloso"
      ]
    },
    {
      "id": "wvl24",
      "opposites": [
        "Stretto",
        "Largo"
      ]
    },
    {
      "id": "wvl25",
      "opposites": [
        "Sano",
        "Malato"
      ]
    }
  ]
};
