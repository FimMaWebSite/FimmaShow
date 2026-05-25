# Fimma Show 🎬

Interaktywna strona internetowa z grami teleturniejowymi inspirowanymi kanałem YouTube **Zero Presji Show**.

## 🎮 Dostępne Gry

- **Marylin Monroe** – Gra w tabu. Opisuj postacie bez używania 3 zakazanych słów!
- *(Koło Fortuny, Familiada, Awantura o Kasę – wkrótce!)*

## 🚀 Jak Uruchomić

### Wymagania
- Node.js (v18+)
- npm

### Instalacja i uruchomienie

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski (frontend + backend jednocześnie)
npm run dev
```

Otwórz przeglądarkę i wejdź na: [http://localhost:5173](http://localhost:5173)

### Tryb produkcyjny

```bash
# Zbuduj frontend
npm run build

# Uruchom serwer produkcyjny (serwuje frontend z katalogu dist/)
npm start
```

## 🛠️ Architektura

| Warstwa       | Technologia              | Port  |
|---------------|--------------------------|-------|
| Frontend      | React 19 + Vite + TypeScript | 5173  |
| Backend / API | Node.js + Express.js     | 3001  |
| Baza Danych   | Plik JSON (`server/db/words.json`) | –  |

## 📁 Struktura Projektu

```
FimmaShow/
├── index.html              # Główny plik HTML
├── vite.config.ts          # Konfiguracja Vite
├── tsconfig.json           # Konfiguracja TypeScript
├── package.json            # Zależności i skrypty
├── server/
│   ├── server.js           # Serwer Express (API REST)
│   └── db/
│       └── words.json      # Baza danych haseł (JSON)
└── src/
    ├── main.tsx            # Punkt wejściowy React
    ├── App.tsx             # Główny komponent (state machine)
    ├── index.css           # Globalny system stylów (Vanilla CSS)
    ├── components/
    │   ├── Dashboard.tsx   # Ekran wyboru gier
    │   ├── DatabaseEditor.tsx  # Panel zarządzania hasłami
    │   ├── GameSetup.tsx   # Konfiguracja drużyn i zasad
    │   ├── GameBoard.tsx   # Plansza rozgrywki
    │   ├── Scoreboard.tsx  # Tabela wyników między rundami
    │   └── WinnerScreen.tsx # Ekran zwycięzcy
    └── utils/
        └── audio.ts        # Syntezator audio (Web Audio API)
```

## 🎯 Zasady Gry – Marylin Monroe

1. Podzielcie się na **2–6 drużyn**.
2. Jedna osoba z drużyny **widzi kartę** z hasłem i opisuje postać reszcie drużyny.
3. **3 słowa zakazane** – opisujący nie może ich użyć.
4. Jeśli drużyna odgadnie → **+1 punkt**.
5. Jeśli opisujący użyje słowa zakazanego lub drużyna poda hasło → **-1 punkt**.
6. Wygrywa drużyna, która pierwsza osiągnie ustalony próg punktów!

## 🔧 API REST

| Metoda | Endpoint         | Opis                   |
|--------|------------------|------------------------|
| GET    | `/api/words`     | Pobierz wszystkie hasła |
| POST   | `/api/words`     | Dodaj nowe hasło       |
| PUT    | `/api/words/:id` | Zaktualizuj hasło      |
| DELETE | `/api/words/:id` | Usuń hasło             |

---

Zainspirowane kanałem **Zero Presji Show** na YouTube.
