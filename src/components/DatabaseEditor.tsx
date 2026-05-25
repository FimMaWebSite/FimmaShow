import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../utils/audio';

export interface WordData {
  id: string;
  word: string;
  forbidden: string[];
  category: string;
  difficulty: string;
}

interface DatabaseEditorProps {
  onBack: () => void;
}

export const DatabaseEditor: React.FC<DatabaseEditorProps> = ({ onBack }) => {
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Wszystkie');
  
  // Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [forbiddenInputs, setForbiddenInputs] = useState<string[]>(['', '', '']);
  const [categoryInput, setCategoryInput] = useState('Popkultura');
  const [difficultyInput, setDifficultyInput] = useState('Średni');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch words from backend
  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/words');
      if (res.ok) {
        const data = await res.json();
        setWords(data);
      } else {
        console.error('Błąd pobierania haseł');
      }
    } catch (err) {
      console.error('Błąd połączenia z serwerem:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleBackClick = () => {
    playClick();
    onBack();
  };

  const handleForbiddenChange = (index: number, val: string) => {
    const updated = [...forbiddenInputs];
    updated[index] = val;
    setForbiddenInputs(updated);
  };

  const resetForm = () => {
    setIsEditing(null);
    setWordInput('');
    setForbiddenInputs(['', '', '']);
    setCategoryInput('Popkultura');
    setDifficultyInput('Średni');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!wordInput.trim()) {
      setErrorMsg('Wprowadź hasło główne.');
      playWrong();
      return;
    }

    const filteredForbidden = forbiddenInputs.map(w => w.trim()).filter(Boolean);
    if (filteredForbidden.length < 3) {
      setErrorMsg('Wprowadź dokładnie 3 słowa zakazane.');
      playWrong();
      return;
    }

    const payload = {
      word: wordInput.trim(),
      forbidden: filteredForbidden,
      category: categoryInput,
      difficulty: difficultyInput
    };

    try {
      let res;
      if (isEditing) {
        // PUT Request
        res = await fetch(`/api/words/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // POST Request
        res = await fetch('/api/words', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        playCorrect();
        setSuccessMsg(isEditing ? 'Pomyślnie zaktualizowano hasło!' : 'Pomyślnie dodano nowe hasło!');
        resetForm();
        fetchWords();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Wystąpił błąd zapisu.');
        playWrong();
      }
    } catch (err) {
      setErrorMsg('Błąd połączenia z serwerem.');
      playWrong();
      console.error(err);
    }
  };

  const handleEdit = (word: WordData) => {
    playClick();
    setIsEditing(word.id);
    setWordInput(word.word);
    setForbiddenInputs([
      word.forbidden[0] || '',
      word.forbidden[1] || '',
      word.forbidden[2] || ''
    ]);
    setCategoryInput(word.category);
    setDifficultyInput(word.difficulty);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to hasło?')) return;
    playClick();
    try {
      const res = await fetch(`/api/words/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccessMsg('Hasło zostało usunięte.');
        fetchWords();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        playWrong();
        console.error('Błąd usuwania');
      }
    } catch (err) {
      playWrong();
      console.error(err);
    }
  };

  // Get unique categories for filtering
  const categories = ['Wszystkie', ...Array.from(new Set(words.map(w => w.category)))];

  // Filtered words list
  const filteredWords = words.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase()) || 
                          w.forbidden.some(fw => fw.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'Wszystkie' || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full fade-in" style={{ padding: '24px 0' }}>
      {/* Header */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={handleBackClick}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
        >
          <ArrowLeft size={16} />
          Powrót do menu
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
          Baza Haseł
        </h2>
      </div>

      <div className="db-layout">
        {/* Left Side: Form Editor */}
        <div>
          <div className="glass" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEditing ? <Edit2 size={16} style={{ color: 'hsl(var(--primary))' }} /> : <Plus size={16} style={{ color: 'hsl(var(--primary))' }} />}
              {isEditing ? 'Edytuj Hasło' : 'Dodaj Nowe Hasło'}
            </h3>

            {errorMsg && (
              <div className="alert alert-danger">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Hasło główne</label>
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder="np. Robert Lewandowski"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">3 Słowa Zakazane</label>
                <div className="flex-col gap-xs">
                  {forbiddenInputs.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={val}
                      onChange={(e) => handleForbiddenChange(idx, e.target.value)}
                      placeholder={`Słowo zakazane ${idx + 1}`}
                      className="input-field"
                    />
                  ))}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Kategoria</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="select-field"
                  >
                    <option value="Popkultura">Popkultura</option>
                    <option value="Ludzie">Ludzie</option>
                    <option value="Postacie Fikcyjne">Postacie Fikcyjne</option>
                    <option value="Historia">Historia</option>
                    <option value="Polska">Polska</option>
                    <option value="Geografia">Geografia</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Trudność</label>
                  <select
                    value={difficultyInput}
                    onChange={(e) => setDifficultyInput(e.target.value)}
                    className="select-field"
                  >
                    <option value="Łatwy">Łatwy</option>
                    <option value="Średni">Średni</option>
                    <option value="Trudny">Trudny</option>
                  </select>
                </div>
              </div>

              <div className="flex-row gap-sm" style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '12px 16px', fontSize: '13px' }}
                >
                  {isEditing ? 'Zapisz zmiany' : 'Dodaj Hasło'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                    style={{ padding: '12px 16px', fontSize: '13px' }}
                  >
                    Anuluj
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Words Table */}
        <div className="flex-col w-full">
          {/* Controls: Search and Filter */}
          <div className="glass db-filter-bar" style={{ padding: '16px', marginBottom: '24px', flexDirection: 'row', alignItems: 'center' }}>
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj hasła lub słowa zakazanego..."
                className="input-field search-input"
              />
            </div>
            <div className="flex-row gap-xs items-center" style={{ minWidth: '160px' }}>
              <Filter style={{ color: 'hsl(var(--text-muted))' }} size={16} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select-field"
                style={{ padding: '8px 32px 8px 12px', fontSize: '13px', borderRadius: '10px' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass table-wrapper" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                Wczytywanie bazy haseł...
              </div>
            ) : filteredWords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                Brak haseł spełniających kryteria wyszukiwania.
              </div>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Hasło</th>
                    <th>Słowa zakazane</th>
                    <th style={{ width: '180px' }}>Szczegóły</th>
                    <th style={{ textAlign: 'right', width: '100px' }}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((word) => (
                    <tr key={word.id}>
                      <td style={{ fontWeight: 700, color: 'white' }}>{word.word}</td>
                      <td>
                        <div className="flex-row gap-xs" style={{ flexWrap: 'wrap' }}>
                          {word.forbidden.map((fw, idx) => (
                            <span
                              key={idx}
                              className="badge-tag"
                              style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.15)', color: '#ff5c75', fontSize: '11px', fontWeight: 700 }}
                            >
                              {fw}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex-row gap-xs">
                          <span className="badge-tag">{word.category}</span>
                          <span
                            className={`badge-tag ${
                              word.difficulty === 'Łatwy'
                                ? 'badge-difficulty-easy'
                                : word.difficulty === 'Średni'
                                ? 'badge-difficulty-medium'
                                : 'badge-difficulty-hard'
                            }`}
                          >
                            {word.difficulty}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex-row gap-xs justify-center" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(word)}
                            className="btn-icon"
                            title="Edytuj"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(word.id)}
                            className="btn-icon btn-icon-danger"
                            title="Usuń"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
