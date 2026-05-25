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
const DB_PATH_9S = path.join(__dirname, 'db', 'nine_seconds.json');
const DB_PATH_RC = path.join(__dirname, 'db', 'reverse_charades.json');

app.use(cors());
app.use(express.json());

// Ensure database directory and file exist
const ensureDbExists = (filePath) => {
  const dbDir = path.dirname(filePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
};

const readDb = (filePath = DB_PATH) => {
  ensureDbExists(filePath);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Błąd odczytu bazy danych (${filePath}):`, error);
    return [];
  }
};

const writeDb = (data, filePath = DB_PATH) => {
  ensureDbExists(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Błąd zapisu do bazy danych (${filePath}):`, error);
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

// ==========================================
// API: 9,5 SEKUNDY ENDPOINTS
// ==========================================

// Get all questions
app.get('/api/nine-seconds', (req, res) => {
  const questions = readDb(DB_PATH_9S);
  res.json(questions);
});

// Add a new question
app.post('/api/nine-seconds', (req, res) => {
  const { question, category, difficulty } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagane jest pytanie.' });
  }

  const questions = readDb(DB_PATH_9S);
  const newQuestion = {
    id: Date.now().toString(),
    question: question.trim(),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  questions.push(newQuestion);
  if (writeDb(questions, DB_PATH_9S)) {
    res.status(201).json(newQuestion);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// Update an existing question
app.put('/api/nine-seconds/:id', (req, res) => {
  const { id } = req.params;
  const { question, category, difficulty } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagane jest pytanie.' });
  }

  const questions = readDb(DB_PATH_9S);
  const questionIndex = questions.findIndex(q => q.id === id);

  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Nie znaleziono pytania o podanym ID.' });
  }

  const updatedQuestion = {
    ...questions[questionIndex],
    question: question.trim(),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  questions[questionIndex] = updatedQuestion;
  if (writeDb(questions, DB_PATH_9S)) {
    res.json(updatedQuestion);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// Delete a question
app.delete('/api/nine-seconds/:id', (req, res) => {
  const { id } = req.params;
  const questions = readDb(DB_PATH_9S);
  const filteredQuestions = questions.filter(q => q.id !== id);

  if (questions.length === filteredQuestions.length) {
    return res.status(404).json({ error: 'Nie znaleziono pytania o podanym ID.' });
  }

  if (writeDb(filteredQuestions, DB_PATH_9S)) {
    res.json({ message: 'Pytanie usunięte pomyślnie.' });
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// ==========================================
// API: ODWRÓCONE KALAMBURY ENDPOINTS
// ==========================================

// Get all activities
app.get('/api/reverse-charades', (req, res) => {
  const activities = readDb(DB_PATH_RC);
  res.json(activities);
});

// Add a new activity
app.post('/api/reverse-charades', (req, res) => {
  const { question, category, difficulty } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagana jest treść czynności.' });
  }

  const activities = readDb(DB_PATH_RC);
  const newActivity = {
    id: Date.now().toString(),
    question: question.trim(),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  activities.push(newActivity);
  if (writeDb(activities, DB_PATH_RC)) {
    res.status(201).json(newActivity);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// Update an existing activity
app.put('/api/reverse-charades/:id', (req, res) => {
  const { id } = req.params;
  const { question, category, difficulty } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Niepoprawne dane. Wymagana jest treść czynności.' });
  }

  const activities = readDb(DB_PATH_RC);
  const activityIndex = activities.findIndex(a => a.id === id);

  if (activityIndex === -1) {
    return res.status(404).json({ error: 'Nie znaleziono czynności o podanym ID.' });
  }

  const updatedActivity = {
    ...activities[activityIndex],
    question: question.trim(),
    category: category || 'Ogólne',
    difficulty: difficulty || 'Średni'
  };

  activities[activityIndex] = updatedActivity;
  if (writeDb(activities, DB_PATH_RC)) {
    res.json(updatedActivity);
  } else {
    res.status(500).json({ error: 'Błąd zapisu bazy danych.' });
  }
});

// Delete an activity
app.delete('/api/reverse-charades/:id', (req, res) => {
  const { id } = req.params;
  const activities = readDb(DB_PATH_RC);
  const filteredActivities = activities.filter(a => a.id !== id);

  if (activities.length === filteredActivities.length) {
    return res.status(404).json({ error: 'Nie znaleziono czynności o podanym ID.' });
  }

  if (writeDb(filteredActivities, DB_PATH_RC)) {
    res.json({ message: 'Czynność usunięta pomyślnie.' });
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
