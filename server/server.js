import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db', 'words.json');

app.use(cors());
app.use(express.json());

// Ensure database directory and file exist
const ensureDbExists = () => {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
};

const readDb = () => {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Błąd odczytu bazy danych:', error);
    return [];
  }
};

const writeDb = (data) => {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Błąd zapisu do bazy danych:', error);
    return false;
  }
};

// API: Get all words
app.get('/api/words', (req, res) => {
  const words = readDb();
  res.json(words);
});

// API: Add a new word
app.post('/api/words', (req, res) => {
  const { word, forbidden, category, difficulty } = req.body;
  if (!word || !forbidden || !Array.isArray(forbidden) || forbidden.length < 3) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagane hasło i przynajmniej 3 słowa zakazane.' });
  }

  const words = readDb();
  const newWord = {
    id: Date.now().toString(),
    word,
    forbidden: forbidden.map(w => w.trim()).filter(Boolean),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  words.push(newWord);
  if (writeDb(words)) {
    res.status(201).json(newWord);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// API: Update an existing word
app.put('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const { word, forbidden, category, difficulty } = req.body;

  if (!word || !forbidden || !Array.isArray(forbidden) || forbidden.length < 3) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagane hasło i przynajmniej 3 słowa zakazane.' });
  }

  const words = readDb();
  const wordIndex = words.findIndex(w => w.id === id);

  if (wordIndex === -1) {
    return res.status(404).json({ error: 'Nie znaleziono hasła o podanym ID.' });
  }

  const updatedWord = {
    ...words[wordIndex],
    word,
    forbidden: forbidden.map(w => w.trim()).filter(Boolean),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  words[wordIndex] = updatedWord;
  if (writeDb(words)) {
    res.json(updatedWord);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// API: Delete a word
app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const words = readDb();
  const filteredWords = words.filter(w => w.id !== id);

  if (words.length === filteredWords.length) {
    return res.status(404).json({ error: 'Nie znaleziono hasła o podanym ID.' });
  }

  if (writeDb(filteredWords)) {
    res.json({ message: 'Hasło usunięte pomyślnie.' });
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// Serve frontend build in production
const clientDistPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Serwer Fimma Show uruchomiony na porcie ${PORT}`);
});
