// The group's honeycomb (setup/HexTeam.vue) and the single tiles (setup/HexTile.vue).
//
// One entry per person. `slot` is the tile's place on the board as [column, row]
// (flat-top hexagons, odd columns sit half a row lower). `from` is the first year
// the person is on the board, `left` the year they are shown as alumni from
// (dimmed, still in place). `photo` is a file in public/team/ (square, 360 px);
// without it the tile shows the initial. `pos` is the photo's object-position inside the
// tile (the default is '50% 22%': the tile shows the square's full width and 87 % of its
// height) and `zoom` enlarges the photo about that point, for a face that sits low, high or small.
//
// Sources: last year's report deck (2024 and 2025 boards) and the group's team
// board of 14 October 2026 (group_briefing/data/team.ts). The `left` years of
// Dainius, Karolina and Venera are read off that board, not confirmed:
// [PATIKSLINTI, neprivaloma: kas iš jų tebėra grupėje]. Mikas defended his MSc thesis in 2026
// (the owner, 26 Nov 2026).

export interface Member {
  id: string
  name: string
  role: string
  photo?: string
  pos?: string
  zoom?: number
  slot: [number, number]
  from: number
  left?: number
  lead?: boolean
  note?: string
}

export const members: Member[] = [
  { id: 'mindaugas', name: 'Mindaugas', role: 'Grupės vadovas', photo: 'mindaugas.jpg', pos: '50% 100%', slot: [3, 1], from: 2024, lead: true },
  { id: 'ramunas', name: 'Ramūnas', role: 'Vadovo pavaduotojas, LDFK', photo: 'ramunas.jpg', slot: [3, 0], from: 2024 },
  { id: 'olegas', name: 'Olegas', role: 'Tyrėjas', photo: 'olegas.jpg', pos: '50% 70%', slot: [2, 1], from: 2024 },
  { id: 'augustas', name: 'Augustas', role: 'Tyrėjas', photo: 'augustas.jpg', slot: [4, 1], from: 2024 },
  { id: 'ruta', name: 'Rūta', role: 'Doktorantė', photo: 'ruta.jpg', pos: '93% 24%', zoom: 1.3, slot: [4, 2], from: 2024 },
  { id: 'dainius', name: 'Dainius', role: 'Programinė įranga', photo: 'dainius.jpg', pos: '50% 100%', zoom: 1.1, slot: [2, 2], from: 2024, left: 2026 },
  { id: 'sophia', name: 'Sophia', role: 'Magistrantė', photo: 'sophia.jpg', pos: '49% 100%', zoom: 1.15, slot: [3, 2], from: 2024, left: 2026, note: 'Groningenas' },
  { id: 'karolina', name: 'Karolina', role: 'Magistrantė', photo: 'karolina.jpg', slot: [2, 0], from: 2024, left: 2026 },
  { id: 'venera', name: 'Venera', role: 'Studentė', photo: 'venera.jpg', slot: [4, 0], from: 2024, left: 2026 },
  { id: 'meda', name: 'Meda', role: 'Bakalaurė', photo: 'meda.jpg', pos: '50% 100%', slot: [1, 1], from: 2024 },
  { id: 'eliza', name: 'Eliza', role: 'Bakalaurė', photo: 'eliza.jpg', slot: [5, 1], from: 2024 },
  { id: 'neilas', name: 'Neilas', role: 'Bakalauras', photo: 'neilas.jpg', pos: '50% 100%', slot: [1, 0], from: 2024 },

  { id: 'adam', name: 'Adam', role: 'Tyrėjas', photo: 'adam.jpg', pos: '100% 85%', zoom: 1.08, slot: [5, 0], from: 2025 },
  { id: 'sarunas', name: 'Šarūnas', role: 'Doktorantas', photo: 'sarunas.jpg', pos: '50% 100%', slot: [1, 2], from: 2025 },
  { id: 'mikas', name: 'Mikas', role: 'Magistrantas', photo: 'mikas.jpg', pos: '50% 100%', slot: [2, 3], from: 2025, left: 2026 },
  { id: 'dominykas', name: 'Dominykas', role: 'Magistrantas', photo: 'dominykas.jpg', pos: '0% 69%', zoom: 1.2, slot: [4, 3], from: 2025 },
  { id: 'margarita', name: 'Margarita', role: 'Magistrantė', photo: 'margarita.jpg', slot: [5, 2], from: 2025 },

  { id: 'anni', name: 'Anni', role: 'Podoktorantė', photo: 'anni.jpg', pos: '0% 85%', zoom: 1.1, slot: [6, 1], from: 2026 },
  { id: 'guste', name: 'Gustė', role: 'Doktorantė', photo: 'guste.jpg', pos: '50% 100%', zoom: 1.1, slot: [6, 2], from: 2027 },
]

// Open places shown in the 2027 step: outlined tiles with a plus. Both sit in column 6, so the
// board is as wide with them as without (columns 1 to 6) and every honeycomb slide lines up.
export const openSlots: [number, number][] = [[6, 0], [6, 3]]
export const openFrom = 2027

export const byId = Object.fromEntries(members.map(m => [m.id, m])) as Record<string, Member>

/** People on the board in `year`, alumni left out. */
export function activeIn(year: number): Member[] {
  return members.filter(m => m.from <= year && !(m.left && m.left <= year))
}
