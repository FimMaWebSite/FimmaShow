import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Search, Filter, Tv, Timer, Users } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../utils/audio';
import { DEFAULT_WORDS, DEFAULT_NINE_SECONDS, DEFAULT_REVERSE_CHARADES, DEFAULT_LIPS_WORDS } from '../data/defaultData';

export interface WordData {
  id: string;
  word: string;
  forbidden: string[];
  category: string;
  difficulty: string;
}

export interface QuestionData {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface DatabaseEditorProps {
  onBack: () => void;
}

export const DatabaseEditor: React.FC<DatabaseEditorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'MARYLIN_MONROE' | 'NINE_SECONDS' | 'REVERSE_CHARADES' | 'LIPS'>('MARYLIN_MONROE');
  const [items, setItems] = useState<any[]>([]);
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

  // Load from localStorage only (no backend on GitHub Pages)
  const fetchItems = () => {
    let localKey = 'fimma_words';
    let defaultBackup: any[] = DEFAULT_WORDS;

    if (activeTab === 'NINE_SECONDS') {
      localKey = 'fimma_nine_seconds';
      defaultBackup = DEFAULT_NINE_SECONDS;
    } else if (activeTab === 'REVERSE_CHARADES') {
      localKey = 'fimma_reverse_charades';
      defaultBackup = DEFAULT_REVERSE_CHARADES;
    } else if (activeTab === 'LIPS') {
      localKey = 'fimma_lips_words';
      defaultBackup = DEFAULT_LIPS_WORDS;
    }

    const localData = localStorage.getItem(localKey);
    if (localData) {
      try {
        setItems(JSON.parse(localData));
      } catch {
        setItems(defaultBackup);
        localStorage.setItem(localKey, JSON.stringify(defaultBackup));
      }
    } else {
      setItems(defaultBackup);
      localStorage.setItem(localKey, JSON.stringify(defaultBackup));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    resetForm();
    setSearch('');
    setCategoryFilter('Wszystkie');
  }, [activeTab]);

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
    setCategoryInput(activeTab === 'MARYLIN_MONROE' ? 'Popkultura' : 'Ogólne');
    setDifficultyInput('Średni');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!wordInput.trim()) {
      let validationMsg = 'Wprowadź hasło główne.';
      if (activeTab === 'NINE_SECONDS') validationMsg = 'Wprowadź treść pytania.';
      else if (activeTab === 'REVERSE_CHARADES') validationMsg = 'Wprowadź treść czynności.';
      else if (activeTab === 'LIPS') validationMsg = 'Wprowadź hasło do odczytania z ust.';
      setErrorMsg(validationMsg);
      playWrong();
      return;
    }

    let payload: any = { category: categoryInput, difficulty: difficultyInput };

    if (activeTab === 'MARYLIN_MONROE') {
      const filteredForbidden = forbiddenInputs.map(w => w.trim()).filter(Boolean);
      if (filteredForbidden.length < 3) {
        setErrorMsg('Wprowadź dokładnie 3 słowa zakazane.');
        playWrong();
        return;
      }
      payload.word = wordInput.trim();
      payload.forbidden = filteredForbidden;
    } else if (activeTab === 'LIPS') {
      payload.word = wordInput.trim();
    } else {
      payload.question = wordInput.trim();
    }

    let localKey = 'fimma_words';
    let defaultBackup: any[] = DEFAULT_WORDS;
    if (activeTab === 'NINE_SECONDS') { localKey = 'fimma_nine_seconds'; defaultBackup = DEFAULT_NINE_SECONDS; }
    else if (activeTab === 'REVERSE_CHARADES') { localKey = 'fimma_reverse_charades'; defaultBackup = DEFAULT_REVERSE_CHARADES; }
    else if (activeTab === 'LIPS') { localKey = 'fimma_lips_words'; defaultBackup = DEFAULT_LIPS_WORDS; }

    const localData = localStorage.getItem(localKey);
    let list = localData ? JSON.parse(localData) : [...defaultBackup];

    if (isEditing) {
      list = list.map((item: any) => item.id === isEditing
        ? { ...item, ...payload }
        : item
      );
    } else {
      list.push({ id: Date.now().toString(), ...payload });
    }

    localStorage.setItem(localKey, JSON.stringify(list));
    playCorrect();
    setSuccessMsg(isEditing ? 'Pomyślnie zaktualizowano!' : 'Pomyślnie dodano do bazy!');
    resetForm();
    fetchItems();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEdit = (item: any) => {
    playClick();
    setIsEditing(item.id);
    if (activeTab === 'MARYLIN_MONROE' || activeTab === 'LIPS') {
      setWordInput(item.word || item.question || '');
      if (activeTab === 'MARYLIN_MONROE') {
        const forbidden = Array.isArray(item.forbidden) ? item.forbidden : [];
        setForbiddenInputs([
          forbidden[0] || '',
          forbidden[1] || '',
          forbidden[2] || ''
        ]);
      }
    } else {
      setWordInput(item.question || item.word || '');
    }
    setCategoryInput(item.category || 'Ogólne');
    setDifficultyInput(item.difficulty || 'Średni');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    let confirmMsg = 'Czy na pewno chcesz usunąć to hasło?';
    if (activeTab === 'NINE_SECONDS') confirmMsg = 'Czy na pewno chcesz usunąć to pytanie?';
    else if (activeTab === 'REVERSE_CHARADES') confirmMsg = 'Czy na pewno chcesz usunąć tę czynność?';
    else if (activeTab === 'LIPS') confirmMsg = 'Czy na pewno chcesz usunąć to hasło z ust?';

    if (!window.confirm(confirmMsg)) return;
    playClick();

    let localKey = 'fimma_words';
    let defaultBackup: any[] = DEFAULT_WORDS;
    if (activeTab === 'NINE_SECONDS') { localKey = 'fimma_nine_seconds'; defaultBackup = DEFAULT_NINE_SECONDS; }
    else if (activeTab === 'REVERSE_CHARADES') { localKey = 'fimma_reverse_charades'; defaultBackup = DEFAULT_REVERSE_CHARADES; }
    else if (activeTab === 'LIPS') { localKey = 'fimma_lips_words'; defaultBackup = DEFAULT_LIPS_WORDS; }

    const localData = localStorage.getItem(localKey);
    let list = localData ? JSON.parse(localData) : [...defaultBackup];
    list = list.filter((item: any) => item.id !== id);
    localStorage.setItem(localKey, JSON.stringify(list));

    playCorrect();
    setSuccessMsg('Usunięto pomyślnie.');
    fetchItems();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Get unique categories for filtering
  const categories = ['Wszystkie', ...Array.from(new Set(items.map(w => w.category || 'Ogólne')))];

  // Filtered items list
  const filteredItems = items.filter(item => {
    if (!item) return false;
    let matchesSearch = false;
    const searchLower = search.toLowerCase();
    
    if (activeTab === 'MARYLIN_MONROE') {
      const word = item.word || item.question || '';
      const forbidden = Array.isArray(item.forbidden) ? item.forbidden : [];
      matchesSearch = word.toLowerCase().includes(searchLower) || 
                      forbidden.some((fw: string) => fw && fw.toLowerCase().includes(searchLower));
    } else if (activeTab === 'LIPS') {
      const word = item.word || item.question || '';
      matchesSearch = word.toLowerCase().includes(searchLower);
    } else {
      const text = item.question || item.word || '';
      matchesSearch = text.toLowerCase().includes(searchLower);
    }
    const itemCategory = item.category || 'Ogólne';
    const matchesCategory = categoryFilter === 'Wszystkie' || itemCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full fade-in" style={{ padding: '24px 0' }}>
      {/* Header */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={handleBackClick}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
        >
          <ArrowLeft size={16} />
          Powrót do menu
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
          Baza Pytań i Haseł
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex-row gap-xs" style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { playClick(); setActiveTab('MARYLIN_MONROE'); }}
          className={`btn ${activeTab === 'MARYLIN_MONROE' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Tv size={15} />
          Marylin Monroe (Tabu)
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('NINE_SECONDS'); }}
          className={`btn ${activeTab === 'NINE_SECONDS' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Timer size={15} />
          9,5 Sekundy (Pytania)
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('REVERSE_CHARADES'); }}
          className={`btn ${activeTab === 'REVERSE_CHARADES' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Users size={15} />
          Odwrócone Kalambury (Czynności)
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('LIPS'); }}
          className={`btn ${activeTab === 'LIPS' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Users size={15} />
          Usta Usta (Hasła)
        </button>
      </div>

      <div className="db-layout">
        {/* Left Side: Form Editor */}
        <div>
          <div className="glass" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEditing ? <Edit2 size={16} style={{ color: 'hsl(var(--primary))' }} /> : <Plus size={16} style={{ color: 'hsl(var(--primary))' }} />}
              {isEditing 
                ? (activeTab === 'MARYLIN_MONROE' ? 'Edytuj Hasło' : activeTab === 'NINE_SECONDS' ? 'Edytuj Pytanie' : activeTab === 'REVERSE_CHARADES' ? 'Edytuj Czynność' : 'Edytuj Hasło z Ust') 
                : (activeTab === 'MARYLIN_MONROE' ? 'Dodaj Nowe Hasło' : activeTab === 'NINE_SECONDS' ? 'Dodaj Nowe Pytanie' : activeTab === 'REVERSE_CHARADES' ? 'Dodaj Czynność' : 'Dodaj Hasło z Ust')}
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
                <label className="form-label">
                  {activeTab === 'MARYLIN_MONROE' ? 'Hasło główne' : activeTab === 'NINE_SECONDS' ? 'Treść pytania' : activeTab === 'LIPS' ? 'Hasło z Ust' : 'Hasło (Czynność)'}
                </label>
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder={activeTab === 'MARYLIN_MONROE' ? 'np. Robert Lewandowski' : activeTab === 'NINE_SECONDS' ? 'np. Wymień 3 państwa graniczące z Polską' : activeTab === 'LIPS' ? 'np. Różowy słoń' : 'np. Jazda na hulajnodze'}
                  className="input-field"
                />
              </div>

              {activeTab === 'MARYLIN_MONROE' && (
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
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Kategoria</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="select-field"
                  >
                    {activeTab === 'MARYLIN_MONROE' && (
                      <>
                        <option value="Popkultura">Popkultura</option>
                        <option value="Ludzie">Ludzie</option>
                        <option value="Postacie Fikcyjne">Postacie Fikcyjne</option>
                        <option value="Historia">Historia</option>
                        <option value="Polska">Polska</option>
                        <option value="Geografia">Geografia</option>
                        <option value="Inne">Inne</option>
                      </>
                    )}
                    {activeTab === 'NINE_SECONDS' && (
                      <>
                        <option value="Ogólne">Ogólne</option>
                        <option value="Geografia">Geografia</option>
                        <option value="Motoryzacja">Motoryzacja</option>
                        <option value="Jedzenie">Jedzenie</option>
                        <option value="Polska">Polska</option>
                        <option value="Sport">Sport</option>
                        <option value="Popkultura">Popkultura</option>
                        <option value="Nauka">Nauka</option>
                        <option value="Przyroda">Przyroda</option>
                        <option value="Historia">Historia</option>
                      </>
                    )}
                    {activeTab === 'REVERSE_CHARADES' && (
                      <>
                        <option value="Ogólne">Ogólne</option>
                        <option value="Czynności Codzienne">Czynności Codzienne</option>
                        <option value="Sport i Ruch">Sport i Ruch</option>
                        <option value="Prace Domowe">Prace Domowe</option>
                        <option value="Hobby">Hobby</option>
                        <option value="Kuchnia">Kuchnia</option>
                        <option value="Muzyka">Muzyka</option>
                        <option value="Rozrywka">Rozrywka</option>
                      </>
                    )}
                    {activeTab === 'LIPS' && (
                      <>
                        <option value="Jedzenie">Jedzenie</option>
                        <option value="Zwierzęta">Zwierzęta</option>
                        <option value="Natura">Natura</option>
                        <option value="Dom">Dom</option>
                        <option value="Przedmioty">Przedmioty</option>
                        <option value="Pojazdy">Pojazdy</option>
                        <option value="Zdrowie">Zdrowie</option>
                        <option value="Inne">Inne</option>
                      </>
                    )}
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
                  {isEditing ? 'Zapisz zmiany' : 'Dodaj do bazy'}
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

        {/* Right Side: Table */}
        <div className="flex-col w-full">
          {/* Controls: Search and Filter */}
          <div className="glass db-filter-bar" style={{ padding: '16px', marginBottom: '24px', flexDirection: 'row', alignItems: 'center' }}>
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab === 'MARYLIN_MONROE' ? "Szukaj hasła lub słowa zakazanego..." : activeTab === 'NINE_SECONDS' ? "Szukaj pytania..." : activeTab === 'LIPS' ? "Szukaj hasła z ust..." : "Szukaj czynności..."}
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
                Wczytywanie bazy danych...
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                Brak pozycji spełniających kryteria wyszukiwania.
              </div>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>{activeTab === 'MARYLIN_MONROE' ? 'Hasło' : activeTab === 'NINE_SECONDS' ? 'Pytanie' : activeTab === 'LIPS' ? 'Hasło z Ust' : 'Czynność'}</th>
                    {activeTab === 'MARYLIN_MONROE' && <th>Słowa zakazane</th>}
                    <th style={{ width: '180px' }}>Szczegóły</th>
                    <th style={{ textAlign: 'right', width: '100px' }}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'white', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {item.question || item.word || ''}
                      </td>
                      {activeTab === 'MARYLIN_MONROE' && (
                        <td>
                          <div className="flex-row gap-xs" style={{ flexWrap: 'wrap' }}>
                            {item.forbidden.map((fw: string, idx: number) => (
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
                      )}
                      <td>
                        <div className="flex-row gap-xs">
                          <span className="badge-tag">{item.category}</span>
                          <span
                            className={`badge-tag ${
                              item.difficulty === 'Łatwy'
                                ? 'badge-difficulty-easy'
                                : item.difficulty === 'Średni'
                                ? 'badge-difficulty-medium'
                                : 'badge-difficulty-hard'
                            }`}
                          >
                            {item.difficulty}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex-row gap-xs justify-center" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn-icon"
                            title="Edytuj"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
