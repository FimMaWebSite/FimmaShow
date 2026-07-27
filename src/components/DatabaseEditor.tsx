import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Search, Filter, Tv, Timer, Users, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../utils/audio';
import {
  DEFAULT_WORDS as MULTI_WORDS,
  DEFAULT_NINE_SECONDS as MULTI_NINE_SECONDS,
  DEFAULT_REVERSE_CHARADES as MULTI_REVERSE_CHARADES,
  DEFAULT_LIPS_WORDS as MULTI_LIPS_WORDS,
  DEFAULT_BOMB_WORDS as MULTI_BOMB_WORDS,
  DEFAULT_P_GAME as MULTI_P_GAME,
  DEFAULT_SPY_LOCATIONS as MULTI_SPY_LOCATIONS,
  DEFAULT_SPY_QUESTIONS as MULTI_SPY_QUESTIONS,
  DEFAULT_REVOLVER_WORDS as MULTI_REVOLVER_WORDS
} from '../data/defaultDataMulti';
import { Language } from '../data/translations';

const DEFAULT_WORDS = MULTI_WORDS['PL'];
const DEFAULT_WORDS_EN = MULTI_WORDS['EN'];
const DEFAULT_NINE_SECONDS = MULTI_NINE_SECONDS['PL'];
const DEFAULT_NINE_SECONDS_EN = MULTI_NINE_SECONDS['EN'];
const DEFAULT_REVERSE_CHARADES = MULTI_REVERSE_CHARADES['PL'];
const DEFAULT_REVERSE_CHARADES_EN = MULTI_REVERSE_CHARADES['EN'];
const DEFAULT_LIPS_WORDS = MULTI_LIPS_WORDS['PL'];
const DEFAULT_LIPS_WORDS_EN = MULTI_LIPS_WORDS['EN'];
const DEFAULT_BOMB_WORDS = MULTI_BOMB_WORDS['PL'];
const DEFAULT_BOMB_WORDS_EN = MULTI_BOMB_WORDS['EN'];
const DEFAULT_P_GAME = MULTI_P_GAME['PL'];
const DEFAULT_P_GAME_EN = MULTI_P_GAME['EN'];
const DEFAULT_SPY_LOCATIONS = MULTI_SPY_LOCATIONS['PL'];
const DEFAULT_SPY_LOCATIONS_EN = MULTI_SPY_LOCATIONS['EN'];
const DEFAULT_SPY_QUESTIONS = MULTI_SPY_QUESTIONS['PL'];
const DEFAULT_SPY_QUESTIONS_EN = MULTI_SPY_QUESTIONS['EN'];
const DEFAULT_REVOLVER_WORDS = MULTI_REVOLVER_WORDS['PL'];
const DEFAULT_REVOLVER_WORDS_EN = MULTI_REVOLVER_WORDS['EN'];

export interface WordData {
  id: string;
  word: string;
  forbidden?: string[];
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
  language: Language;
}

type TabMode = 'MARYLIN_MONROE' | 'NINE_SECONDS' | 'REVERSE_CHARADES' | 'LIPS' | 'BOMB' | 'P_GAME' | 'SPY' | 'SPY_QUESTIONS' | 'REVOLVER';

const LOCAL_TRANSLATIONS = {
  PL: {
    title: 'Baza Pytań i Haseł',
    backToMenu: 'Powrót do menu',
    editWord: 'Edytuj Hasło',
    editQuestion: 'Edytuj Pytanie',
    editAction: 'Edytuj Czynność',
    editLips: 'Edytuj Hasło z Ust',
    editBomb: 'Edytuj Hasło Bomby',
    editPGame: 'Edytuj Hasło Gry na P',
    editRevolver: 'Edytuj Hasło Rewolwera',
    editLocation: 'Edytuj Lokalizację',
    editSpyQuestion: 'Edytuj Pytanie Szpiega',
    addWord: 'Dodaj Nowe Hasło',
    addQuestion: 'Dodaj Nowe Pytanie',
    addAction: 'Dodaj Czynność',
    addLips: 'Dodaj Hasło z Ust',
    addBomb: 'Dodaj Hasło Bomby',
    addPGame: 'Dodaj Hasło Gry na P',
    addRevolver: 'Dodaj Hasło Rewolwera',
    addLocation: 'Dodaj Lokalizację',
    addSpyQuestion: 'Dodaj Pytanie Szpiega',
    mainWord: 'Hasło główne',
    questionContent: 'Treść pytania',
    lipsWord: 'Hasło z Ust',
    bombWord: 'Hasło Bomby',
    pGameWord: 'Hasło Gry na P',
    revolverWord: 'Hasło Rewolwera',
    location: 'Lokalizacja',
    spyQuestion: 'Pytanie Szpiega',
    actionWord: 'Hasło (Czynność)',
    forbiddenWords: '3 Słowa Zakazane',
    forbiddenWordIdx: 'Słowo zakazane',
    category: 'Kategoria',
    difficulty: 'Trudność',
    saveChanges: 'Zapisz zmiany',
    addToDb: 'Dodaj do bazy',
    cancel: 'Anuluj',
    csvTools: 'Narzędzia CSV (Excel)',
    csvFormatInfo: 'Format pliku CSV (kolumny oddzielone średnikami, wiersz nagłówkowy jest opcjonalny i automatycznie pomijany):',
    addFromCsv: 'Dodaj z CSV',
    replaceFromCsv: 'Zastąp z CSV',
    exportToCsv: 'Eksport do CSV',
    restoreDefaults: 'Przywróć domyślne',
    searchPlaceholderWordForbidden: 'Szukaj hasła lub słowa zakazanego...',
    searchPlaceholderQuestion: 'Szukaj pytania...',
    searchPlaceholderLips: 'Szukaj hasła z ust...',
    searchPlaceholderBomb: 'Szukaj hasła bomby...',
    searchPlaceholderPGame: 'Szukaj hasła gry na P...',
    searchPlaceholderRevolver: 'Szukaj hasła rewolwera...',
    searchPlaceholderLocation: 'Szukaj lokalizacji...',
    searchPlaceholderSpyQuestion: 'Szukaj pytania szpiega...',
    searchPlaceholderAction: 'Szukaj czynności...',
    loadingDb: 'Wczytywanie bazy danych...',
    noItemsFound: 'Brak pozycji spełniających kryteria wyszukiwania.',
    headerWord: 'Hasło',
    headerQuestion: 'Pytanie',
    headerLips: 'Hasło z Ust',
    headerBomb: 'Hasło Bomby',
    headerPGame: 'Hasło Gry na P',
    headerRevolver: 'Hasło Rewolwera',
    headerLocation: 'Lokalizacja',
    headerSpyQuestion: 'Pytanie Szpiega',
    headerAction: 'Czynność',
    headerForbidden: 'Słowa zakazane',
    headerDetails: 'Szczegóły',
    headerActions: 'Akcje',
    btnTitleEdit: 'Edytuj',
    btnTitleDelete: 'Usuń',
    alertEnterWord: 'Wprowadź hasło główne.',
    alertEnterQuestion: 'Wprowadź treść pytania.',
    alertEnterAction: 'Wprowadź treść czynności.',
    alertEnterLips: 'Wprowadź hasło do odczytania z ust.',
    alertEnterLocation: 'Wprowadź nazwę lokalizacji.',
    alertEnterSpyQuestion: 'Wprowadź treść pytania dla Szpiega.',
    alertEnterThreeForbidden: 'Wprowadź dokładnie 3 słowa zakazane.',
    alertUpdatedSuccess: 'Pomyślnie zaktualizowano!',
    alertAddedSuccess: 'Pomyślnie dodano do bazy!',
    alertDeletedSuccess: 'Usunięto pomyślnie.',
    alertRestoredSuccess: 'Przywrócono domyślną bazę haseł.',
    confirmDeleteWord: 'Czy na pewno chcesz usunąć to hasło?',
    confirmDeleteQuestion: 'Czy na pewno chcesz usunąć to pytanie?',
    confirmDeleteAction: 'Czy na pewno chcesz usunąć tę czynność?',
    confirmDeleteLips: 'Czy na pewno chcesz usunąć to hasło z ust?',
    confirmDeleteLocation: 'Czy na pewno chcesz usunąć tę lokalizację?',
    confirmDeleteSpyQuestion: 'Czy na pewno chcesz usunąć to pytanie dla Szpiega?',
    confirmReplaceCsv: 'Czy na pewno chcesz USUNĄĆ obecne hasła z tej zakładki i wgrać TYLKO hasła z pliku CSV?',
    confirmRestoreDefaults: 'Czy na pewno chcesz przywrócić domyślne hasła dla tej zakładki? Wszystkie Twoje zmiany zostaną utracone.',
    alertCsvEmpty: 'Plik CSV jest pusty.',
    alertCsvNoValidRows: 'Nie wczytano żadnych poprawnych wierszy z pliku.',
    alertCsvImportSuccess: 'Pomyślnie zaimportowano {count} pozycji!',
    alertCsvParseError: 'Wystąpił błąd podczas analizy pliku CSV.',
    titleAddFromCsv: 'Doda nowe pozycje na koniec obecnej bazy haseł',
    titleReplaceFromCsv: 'CAŁKOWICIE wyczyści obecne hasła w tej zakładce i wgra tylko hasła z pliku CSV',
    titleRestoreDefaults: 'Przywróci fabryczną listę haseł i wyczyści uszkodzone znaki'
  },
  EN: {
    title: 'Word & Question Database',
    backToMenu: 'Back to Menu',
    editWord: 'Edit Word',
    editQuestion: 'Edit Question',
    editAction: 'Edit Action',
    editLips: 'Edit Lips Word',
    editBomb: 'Edit Bomb Word',
    editPGame: 'Edit P Game Word',
    editRevolver: 'Edit Revolver Word',
    editLocation: 'Edit Location',
    editSpyQuestion: 'Edit Spy Question',
    addWord: 'Add New Word',
    addQuestion: 'Add New Question',
    addAction: 'Add Action',
    addLips: 'Add Lips Word',
    addBomb: 'Add Bomb Word',
    addPGame: 'Add P Game Word',
    addRevolver: 'Add Revolver Word',
    addLocation: 'Add Location',
    addSpyQuestion: 'Add Spy Question',
    mainWord: 'Main word',
    questionContent: 'Question content',
    lipsWord: 'Lips word',
    bombWord: 'Bomb word',
    pGameWord: 'P Game word',
    revolverWord: 'Revolver word',
    location: 'Location',
    spyQuestion: 'Spy question',
    actionWord: 'Word (Action)',
    forbiddenWords: '3 Forbidden Words',
    forbiddenWordIdx: 'Forbidden word',
    category: 'Category',
    difficulty: 'Difficulty',
    saveChanges: 'Save changes',
    addToDb: 'Add to database',
    cancel: 'Cancel',
    csvTools: 'CSV Tools (Excel)',
    csvFormatInfo: 'CSV file format (columns separated by semicolons, header row is optional and automatically skipped):',
    addFromCsv: 'Add from CSV',
    replaceFromCsv: 'Replace from CSV',
    exportToCsv: 'Export to CSV',
    restoreDefaults: 'Restore defaults',
    searchPlaceholderWordForbidden: 'Search word or forbidden word...',
    searchPlaceholderQuestion: 'Search question...',
    searchPlaceholderLips: 'Search lips word...',
    searchPlaceholderBomb: 'Search bomb word...',
    searchPlaceholderPGame: 'Search P Game word...',
    searchPlaceholderRevolver: 'Search revolver word...',
    searchPlaceholderLocation: 'Search location...',
    searchPlaceholderSpyQuestion: 'Search spy question...',
    searchPlaceholderAction: 'Search action...',
    loadingDb: 'Loading database...',
    noItemsFound: 'No items match the search criteria.',
    headerWord: 'Word',
    headerQuestion: 'Question',
    headerLips: 'Lips Word',
    headerBomb: 'Bomb Word',
    headerPGame: 'P Game Word',
    headerRevolver: 'Revolver Word',
    headerLocation: 'Location',
    headerSpyQuestion: 'Spy Question',
    headerAction: 'Action',
    headerForbidden: 'Forbidden words',
    headerDetails: 'Details',
    headerActions: 'Actions',
    btnTitleEdit: 'Edit',
    btnTitleDelete: 'Delete',
    alertEnterWord: 'Please enter the main word.',
    alertEnterQuestion: 'Please enter the question content.',
    alertEnterAction: 'Please enter the action content.',
    alertEnterLips: 'Please enter the lips-reading word.',
    alertEnterLocation: 'Please enter the location name.',
    alertEnterSpyQuestion: 'Please enter the question for the Spy.',
    alertEnterThreeForbidden: 'Please enter exactly 3 forbidden words.',
    alertUpdatedSuccess: 'Successfully updated!',
    alertAddedSuccess: 'Successfully added to database!',
    alertDeletedSuccess: 'Successfully deleted.',
    alertRestoredSuccess: 'Default word database restored.',
    confirmDeleteWord: 'Are you sure you want to delete this word?',
    confirmDeleteQuestion: 'Are you sure you want to delete this question?',
    confirmDeleteAction: 'Are you sure you want to delete this action?',
    confirmDeleteLips: 'Are you sure you want to delete this lips word?',
    confirmDeleteLocation: 'Are you sure you want to delete this location?',
    confirmDeleteSpyQuestion: 'Are you sure you want to delete this question for the Spy?',
    confirmReplaceCsv: 'Are you sure you want to DELETE current words from this tab and upload ONLY words from the CSV file?',
    confirmRestoreDefaults: 'Are you sure you want to restore default words for this tab? All your custom changes will be lost.',
    alertCsvEmpty: 'CSV file is empty.',
    alertCsvNoValidRows: 'No valid rows parsed from the CSV file.',
    alertCsvImportSuccess: 'Successfully imported {count} items!',
    alertCsvParseError: 'An error occurred while parsing the CSV file.',
    titleAddFromCsv: 'Adds new items to the end of the current database',
    titleReplaceFromCsv: 'Completely CLEARS current items in this tab and uploads only items from the CSV file',
    titleRestoreDefaults: 'Restores the factory default list of words and clears corrupted characters'
  }
};

export const DatabaseEditor: React.FC<DatabaseEditorProps> = ({ onBack, language }) => {
  const t = (key: keyof typeof LOCAL_TRANSLATIONS.PL) => {
    const editorLang = (language === 'EN' ? 'EN' : 'PL') as 'PL' | 'EN';
    return LOCAL_TRANSLATIONS[editorLang]?.[key] || LOCAL_TRANSLATIONS.PL[key] || '';
  };

  const getCategoryOptions = (tab: TabMode): string[] => {
    if (language === 'EN') {
      switch (tab) {
        case 'MARYLIN_MONROE':
          return [
            'Fictional Characters',
            'Famous People',
            'Brands',
            'Food & Drinks',
            'Sports & Hobbies',
            'Places & Geography',
            'Gry & Technologia'
          ];
        case 'NINE_SECONDS':
          return [
            'Pop Culture & Media',
            'Daily Life & Surroundings',
            'Games & Technology',
            'Sports & Hobbies',
            'Places & Geography'
          ];
        case 'REVERSE_CHARADES':
          return ['Actions'];
        case 'BOMB':
          return ['General Knowledge'];
        case 'P_GAME':
          return ['Nouns'];
        case 'LIPS':
          return ['Phrases'];
        case 'REVOLVER':
          return ['Nouns'];
        default:
          return ['General'];
      }
    } else {
      switch (tab) {
        case 'MARYLIN_MONROE':
          return [
            'Postacie Fikcyjne',
            'Ludzie',
            'Polska',
            'Popkultura',
            'Historia',
            'Geografia',
            'Inne'
          ];
        case 'NINE_SECONDS':
          return [
            'Popkultura & Media',
            'Życie codzienne & Otoczenie',
            'Gry & Technologia',
            'Polska & Świat'
          ];
        case 'REVERSE_CHARADES':
          return [
            'Czynności & Zawody',
            'Zwierzęta & Natura',
            'Sport & Hobby',
            'Postacie & Popkultura'
          ];
        case 'BOMB':
          return [
            'Przedmioty & Codzienność',
            'Miejsca & Sytuacje',
            'Ludzie & Relacje',
            'Popkultura & Zwariowane'
          ];
        case 'P_GAME':
          return [
            'Przedmioty codzienne',
            'Zwierzęta i Natura',
            'Ludzie i Zawody',
            'Miejsca i Pojęcia'
          ];
        case 'LIPS':
          return [
            'Absurdalne & Głupie',
            'Łamacze Językowe',
            'Codzienne & Imprezowe',
            'Trudne fonetycznie',
            'Zdrowie',
            'Inne'
          ];
        case 'REVOLVER':
          return [
            'Rzeczy & Obiekty',
            'Zwierzęta & Natura',
            'Miejsca & Zawody',
            'Pojęcia & Popkultura'
          ];
        default:
          return ['Ogólne'];
      }
    }
  };

  const [activeTab, setActiveTab] = useState<TabMode>('MARYLIN_MONROE');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(language === 'EN' ? 'All' : 'Wszystkie');
  
  // Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [forbiddenInputs, setForbiddenInputs] = useState<string[]>(['', '', '']);
  const [categoryInput, setCategoryInput] = useState(() => {
    const opts = getCategoryOptions('MARYLIN_MONROE');
    return opts[0] || (language === 'EN' ? 'Pop Culture' : 'Popkultura');
  });
  const [difficultyInput, setDifficultyInput] = useState(language === 'EN' ? 'Medium' : 'Średni');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchItems = () => {
    let localKey = `fimma_words_${language}`;
    let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;

    if (activeTab === 'NINE_SECONDS') {
      localKey = `fimma_nine_seconds_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS;
    } else if (activeTab === 'REVERSE_CHARADES') {
      localKey = `fimma_reverse_charades_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES;
    } else if (activeTab === 'LIPS') {
      localKey = `fimma_lips_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS;
    } else if (activeTab === 'BOMB') {
      localKey = `fimma_bomb_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS;
    } else if (activeTab === 'P_GAME') {
      localKey = `fimma_p_game_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME;
    } else if (activeTab === 'SPY') {
      localKey = `fimma_spy_locations_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS;
    } else if (activeTab === 'SPY_QUESTIONS') {
      localKey = `fimma_spy_questions_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS;
    } else if (activeTab === 'REVOLVER') {
      localKey = `fimma_revolver_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS;
    }

    const localData = localStorage.getItem(localKey);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems(defaultBackup);
          localStorage.setItem(localKey, JSON.stringify(defaultBackup));
        }
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
    setCategoryFilter(language === 'EN' ? 'All' : 'Wszystkie');
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
    const categoriesOptions = getCategoryOptions(activeTab);
    setCategoryInput(
      activeTab === 'SPY' ? (language === 'EN' ? 'Locations' : 'Lokalizacje') :
      activeTab === 'SPY_QUESTIONS' ? (language === 'EN' ? 'Questions' : 'Pytania') :
      categoriesOptions[0] || (language === 'EN' ? 'General' : 'Ogólne')
    );
    setDifficultyInput(language === 'EN' ? 'Medium' : 'Średni');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!wordInput.trim()) {
      let validationMsg = t('alertEnterWord');
      if (activeTab === 'NINE_SECONDS') validationMsg = t('alertEnterQuestion');
      else if (activeTab === 'REVERSE_CHARADES') validationMsg = t('alertEnterAction');
      else if (activeTab === 'LIPS') validationMsg = t('alertEnterLips');
      else if (activeTab === 'SPY') validationMsg = t('alertEnterLocation');
      else if (activeTab === 'SPY_QUESTIONS') validationMsg = t('alertEnterSpyQuestion');
      setErrorMsg(validationMsg);
      playWrong();
      return;
    }

    let payload: any = { category: categoryInput, difficulty: difficultyInput };

    if (activeTab === 'MARYLIN_MONROE') {
      const filteredForbidden = forbiddenInputs.map(w => w.trim()).filter(Boolean);
      if (filteredForbidden.length < 3) {
        setErrorMsg(t('alertEnterThreeForbidden'));
        playWrong();
        return;
      }
      payload.word = wordInput.trim();
      payload.forbidden = filteredForbidden;
    } else if (activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'REVOLVER') {
      payload.word = wordInput.trim();
    } else if (activeTab === 'SPY') {
      payload.word = wordInput.trim();
      payload.category = language === 'EN' ? 'Locations' : 'Lokalizacje';
      payload.difficulty = language === 'EN' ? 'Medium' : 'Średni';
    } else if (activeTab === 'SPY_QUESTIONS') {
      payload.question = wordInput.trim();
      payload.category = language === 'EN' ? 'Questions' : 'Pytania';
      payload.difficulty = language === 'EN' ? 'Medium' : 'Średni';
    } else {
      payload.question = wordInput.trim();
    }

    let localKey = `fimma_words_${language}`;
    let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;
    if (activeTab === 'NINE_SECONDS') { localKey = `fimma_nine_seconds_${language}`; defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS; }
    else if (activeTab === 'REVERSE_CHARADES') { localKey = `fimma_reverse_charades_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES; }
    else if (activeTab === 'LIPS') { localKey = `fimma_lips_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS; }
    else if (activeTab === 'BOMB') { localKey = `fimma_bomb_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS; }
    else if (activeTab === 'P_GAME') { localKey = `fimma_p_game_${language}`; defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME; }
    else if (activeTab === 'SPY') { localKey = `fimma_spy_locations_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS; }
    else if (activeTab === 'SPY_QUESTIONS') { localKey = `fimma_spy_questions_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS; }
    else if (activeTab === 'REVOLVER') { localKey = `fimma_revolver_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS; }

    const localData = localStorage.getItem(localKey);
    let list: any[] = [];
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        list = Array.isArray(parsed) ? parsed : [...defaultBackup];
      } catch {
        list = [...defaultBackup];
      }
    } else {
      list = [...defaultBackup];
    }

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
    setSuccessMsg(isEditing ? t('alertUpdatedSuccess') : t('alertAddedSuccess'));
    resetForm();
    fetchItems();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEdit = (item: any) => {
    playClick();
    setIsEditing(item.id);
    if (activeTab === 'MARYLIN_MONROE' || activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'SPY' || activeTab === 'REVOLVER') {
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
    const categoriesOptions = getCategoryOptions(activeTab);
    setCategoryInput(
      item.category || (
        activeTab === 'SPY' ? (language === 'EN' ? 'Locations' : 'Lokalizacje') :
        activeTab === 'SPY_QUESTIONS' ? (language === 'EN' ? 'Questions' : 'Pytania') :
        categoriesOptions[0] || (language === 'EN' ? 'General' : 'Ogólne')
      )
    );
    setDifficultyInput(item.difficulty || (language === 'EN' ? 'Medium' : 'Średni'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    let confirmMsg = t('confirmDeleteWord');
    if (activeTab === 'NINE_SECONDS') confirmMsg = t('confirmDeleteQuestion');
    else if (activeTab === 'REVERSE_CHARADES') confirmMsg = t('confirmDeleteAction');
    else if (activeTab === 'LIPS') confirmMsg = t('confirmDeleteLips');
    else if (activeTab === 'SPY') confirmMsg = t('confirmDeleteLocation');
    else if (activeTab === 'SPY_QUESTIONS') confirmMsg = t('confirmDeleteSpyQuestion');

    if (!window.confirm(confirmMsg)) return;
    playClick();

    let localKey = `fimma_words_${language}`;
    let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;
    if (activeTab === 'NINE_SECONDS') { localKey = `fimma_nine_seconds_${language}`; defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS; }
    else if (activeTab === 'REVERSE_CHARADES') { localKey = `fimma_reverse_charades_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES; }
    else if (activeTab === 'LIPS') { localKey = `fimma_lips_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS; }
    else if (activeTab === 'BOMB') { localKey = `fimma_bomb_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS; }
    else if (activeTab === 'P_GAME') { localKey = `fimma_p_game_${language}`; defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME; }
    else if (activeTab === 'SPY') { localKey = `fimma_spy_locations_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS; }
    else if (activeTab === 'SPY_QUESTIONS') { localKey = `fimma_spy_questions_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS; }
    else if (activeTab === 'REVOLVER') { localKey = `fimma_revolver_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS; }

    const localData = localStorage.getItem(localKey);
    let list: any[] = [];
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        list = Array.isArray(parsed) ? parsed : [...defaultBackup];
      } catch {
        list = [...defaultBackup];
      }
    } else {
      list = [...defaultBackup];
    }
    list = list.filter((item: any) => item.id !== id);
    localStorage.setItem(localKey, JSON.stringify(list));

    playCorrect();
    setSuccessMsg(t('alertDeletedSuccess'));
    fetchItems();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>, replaceExisting: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      let text = '';
      try {
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
        text = utf8Decoder.decode(arrayBuffer);
      } catch (err) {
        try {
          const cp1250Decoder = new TextDecoder('windows-1250');
          text = cp1250Decoder.decode(arrayBuffer);
        } catch (e2) {
          text = new TextDecoder('utf-8').decode(arrayBuffer);
        }
      }

      try {
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) {
          setErrorMsg(t('alertCsvEmpty'));
          playWrong();
          return;
        }

        const newItems: any[] = [];
        let separator = ';';
        const firstLine = lines[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        if (commaCount > semicolonCount) {
          separator = ',';
        }

        for (let i = 0; i < lines.length; i++) {
          const row = lines[i];
          const fields = row.split(separator).map(f => {
            let cleaned = f.trim();
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
              cleaned = cleaned.substring(1, cleaned.length - 1);
            }
            return cleaned;
          });

          if (i === 0 && (
            fields[0].toLowerCase().includes('hasło') || 
            fields[0].toLowerCase().includes('pytanie') || 
            fields[0].toLowerCase().includes('czynność') ||
            fields[0].toLowerCase().includes('word') ||
            fields[0].toLowerCase().includes('question') ||
            fields[0].toLowerCase().includes('lokalizacja')
          )) {
            continue;
          }

          if (fields.length === 0 || !fields[0]) continue;

          let itemPayload: any = {};
          
          if (activeTab === 'MARYLIN_MONROE') {
            if (fields.length < 4) continue;
            itemPayload = {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              word: fields[0],
              forbidden: [fields[1] || '', fields[2] || '', fields[3] || ''],
              category: fields[4] || (language === 'EN' ? 'Fictional Characters' : 'Postacie Fikcyjne'),
              difficulty: fields[5] || (language === 'EN' ? 'Medium' : 'Średni')
            };
          } else if (activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'REVOLVER') {
            const defaultCat = 
              activeTab === 'BOMB' ? (language === 'EN' ? 'General Knowledge' : 'Przedmioty & Codzienność') :
              activeTab === 'P_GAME' ? (language === 'EN' ? 'Nouns' : 'Przedmioty codzienne') :
              activeTab === 'LIPS' ? (language === 'EN' ? 'Phrases' : 'Absurdalne & Głupie') :
              activeTab === 'REVOLVER' ? (language === 'EN' ? 'Nouns' : 'Rzeczy & Obiekty') : (language === 'EN' ? 'General' : 'Ogólne');
            itemPayload = {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              word: fields[0],
              category: fields[1] || defaultCat,
              difficulty: fields[2] || (language === 'EN' ? 'Medium' : 'Średni')
            };
          } else if (activeTab === 'SPY') {
            itemPayload = {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              word: fields[0],
              category: language === 'EN' ? 'Locations' : 'Lokalizacje',
              difficulty: language === 'EN' ? 'Medium' : 'Średni'
            };
          } else if (activeTab === 'SPY_QUESTIONS') {
            itemPayload = {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              question: fields[0],
              category: language === 'EN' ? 'Questions' : 'Pytania',
              difficulty: language === 'EN' ? 'Medium' : 'Średni'
            };
          } else {
            const defaultCat = 
              activeTab === 'NINE_SECONDS' ? (language === 'EN' ? 'Pop Culture & Media' : 'Popkultura & Media') :
              activeTab === 'REVERSE_CHARADES' ? (language === 'EN' ? 'Actions' : 'Czynności & Zawody') : (language === 'EN' ? 'General' : 'Ogólne');
            itemPayload = {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              question: fields[0],
              category: fields[1] || defaultCat,
              difficulty: fields[2] || (language === 'EN' ? 'Medium' : 'Średni')
            };
          }
          
          newItems.push(itemPayload);
        }

        if (newItems.length === 0) {
          setErrorMsg(t('alertCsvNoValidRows'));
          playWrong();
          return;
        }

        let localKey = `fimma_words_${language}`;
        let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;
        if (activeTab === 'NINE_SECONDS') { localKey = `fimma_nine_seconds_${language}`; defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS; }
        else if (activeTab === 'REVERSE_CHARADES') { localKey = `fimma_reverse_charades_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES; }
        else if (activeTab === 'LIPS') { localKey = `fimma_lips_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS; }
        else if (activeTab === 'BOMB') { localKey = `fimma_bomb_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS; }
        else if (activeTab === 'P_GAME') { localKey = `fimma_p_game_${language}`; defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME; }
        else if (activeTab === 'SPY') { localKey = `fimma_spy_locations_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS; }
        else if (activeTab === 'SPY_QUESTIONS') { localKey = `fimma_spy_questions_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS; }
        else if (activeTab === 'REVOLVER') { localKey = `fimma_revolver_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS; }

        let finalItems: any[] = [];
        if (replaceExisting) {
          finalItems = newItems;
        } else {
          const localData = localStorage.getItem(localKey);
          let existing: any[] = [];
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              existing = Array.isArray(parsed) ? parsed : [...defaultBackup];
            } catch {
              existing = [...defaultBackup];
            }
          } else {
            existing = [...defaultBackup];
          }
          finalItems = [...existing, ...newItems];
        }

        localStorage.setItem(localKey, JSON.stringify(finalItems));
        playCorrect();
        setSuccessMsg(t('alertCsvImportSuccess').replace('{count}', newItems.length.toString()));
        fetchItems();
        setTimeout(() => setSuccessMsg(''), 5000);
      } catch (err) {
        console.error(err);
        setErrorMsg(t('alertCsvParseError'));
        playWrong();
      }
      
      e.target.value = '';
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCsvExport = () => {
    let localKey = `fimma_words_${language}`;
    let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;
    let filename = language === 'EN' ? 'marylin_monroe_taboo.csv' : 'marylin_monroe_tabu.csv';

    if (activeTab === 'NINE_SECONDS') {
      localKey = `fimma_nine_seconds_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS;
      filename = language === 'EN' ? '9_5_seconds_questions.csv' : '9_5_sekundy_pytania.csv';
    } else if (activeTab === 'REVERSE_CHARADES') {
      localKey = `fimma_reverse_charades_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES;
      filename = language === 'EN' ? 'reverse_charades_actions.csv' : 'odwrocone_kalambury_czynnosci.csv';
    } else if (activeTab === 'LIPS') {
      localKey = `fimma_lips_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS;
      filename = language === 'EN' ? 'lips_words.csv' : 'usta_usta_hasla.csv';
    } else if (activeTab === 'BOMB') {
      localKey = `fimma_bomb_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS;
      filename = language === 'EN' ? 'bomb_words.csv' : 'bomba_hasla.csv';
    } else if (activeTab === 'P_GAME') {
      localKey = `fimma_p_game_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME;
      filename = language === 'EN' ? 'p_game_words.csv' : 'gra_na_p_hasla.csv';
    } else if (activeTab === 'SPY') {
      localKey = `fimma_spy_locations_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS;
      filename = language === 'EN' ? 'spy_locations.csv' : 'szpieg_lokalizacje.csv';
    } else if (activeTab === 'SPY_QUESTIONS') {
      localKey = `fimma_spy_questions_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS;
      filename = language === 'EN' ? 'spy_questions.csv' : 'szpieg_pytania.csv';
    } else if (activeTab === 'REVOLVER') {
      localKey = `fimma_revolver_words_${language}`;
      defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS;
      filename = language === 'EN' ? 'revolver_words.csv' : 'rewolwer_hasla.csv';
    }

    const localData = localStorage.getItem(localKey);
    let list: any[] = [];
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        list = Array.isArray(parsed) ? parsed : [...defaultBackup];
      } catch {
        list = [...defaultBackup];
      }
    } else {
      list = [...defaultBackup];
    }

    let csvContent = '\uFEFF';
    
    if (language === 'EN') {
      if (activeTab === 'MARYLIN_MONROE') {
        csvContent += 'Word;Forbidden Word 1;Forbidden Word 2;Forbidden Word 3;Category;Difficulty\n';
        list.forEach(item => {
          const forbidden = Array.isArray(item.forbidden) ? item.forbidden : ['', '', ''];
          csvContent += `"${item.word || ''}";"${forbidden[0] || ''}";"${forbidden[1] || ''}";"${forbidden[2] || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      } else if (activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'REVOLVER') {
        csvContent += 'Word;Category;Difficulty\n';
        list.forEach(item => {
          csvContent += `"${item.word || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      } else if (activeTab === 'SPY') {
        csvContent += 'Location;Category;Difficulty\n';
        list.forEach(item => {
          csvContent += `"${item.word || ''}";"Locations";"Medium"\n`;
        });
      } else if (activeTab === 'SPY_QUESTIONS') {
        csvContent += 'Question;Category;Difficulty\n';
        list.forEach(item => {
          csvContent += `"${item.question || item.word || ''}";"Questions";"Medium"\n`;
        });
      } else {
        csvContent += 'Question/Action;Category;Difficulty\n';
        list.forEach(item => {
          csvContent += `"${item.question || item.word || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      }
    } else {
      if (activeTab === 'MARYLIN_MONROE') {
        csvContent += 'Hasło;Słowo zakazane 1;Słowo zakazane 2;Słowo zakazane 3;Kategoria;Trudność\n';
        list.forEach(item => {
          const forbidden = Array.isArray(item.forbidden) ? item.forbidden : ['', '', ''];
          csvContent += `"${item.word || ''}";"${forbidden[0] || ''}";"${forbidden[1] || ''}";"${forbidden[2] || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      } else if (activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'REVOLVER') {
        csvContent += 'Hasło;Kategoria;Trudność\n';
        list.forEach(item => {
          csvContent += `"${item.word || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      } else if (activeTab === 'SPY') {
        csvContent += 'Lokalizacja;Kategoria;Trudność\n';
        list.forEach(item => {
          csvContent += `"${item.word || ''}";"Lokalizacje";"Średni"\n`;
        });
      } else if (activeTab === 'SPY_QUESTIONS') {
        csvContent += 'Pytanie;Kategoria;Trudność\n';
        list.forEach(item => {
          csvContent += `"${item.question || item.word || ''}";"Pytania";"Średni"\n`;
        });
      } else {
        csvContent += 'Pytanie/Czynność;Kategoria;Trudność\n';
        list.forEach(item => {
          csvContent += `"${item.question || item.word || ''}";"${item.category || ''}";"${item.difficulty || ''}"\n`;
        });
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreDefaults = () => {
    if (!window.confirm(t('confirmRestoreDefaults'))) return;
    
    let localKey = `fimma_words_${language}`;
    let defaultBackup: any[] = language === 'EN' ? DEFAULT_WORDS_EN : DEFAULT_WORDS;
    if (activeTab === 'NINE_SECONDS') { localKey = `fimma_nine_seconds_${language}`; defaultBackup = language === 'EN' ? DEFAULT_NINE_SECONDS_EN : DEFAULT_NINE_SECONDS; }
    else if (activeTab === 'REVERSE_CHARADES') { localKey = `fimma_reverse_charades_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVERSE_CHARADES_EN : DEFAULT_REVERSE_CHARADES; }
    else if (activeTab === 'LIPS') { localKey = `fimma_lips_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_LIPS_WORDS_EN : DEFAULT_LIPS_WORDS; }
    else if (activeTab === 'BOMB') { localKey = `fimma_bomb_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_BOMB_WORDS_EN : DEFAULT_BOMB_WORDS; }
    else if (activeTab === 'P_GAME') { localKey = `fimma_p_game_${language}`; defaultBackup = language === 'EN' ? DEFAULT_P_GAME_EN : DEFAULT_P_GAME; }
    else if (activeTab === 'SPY') { localKey = `fimma_spy_locations_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_LOCATIONS_EN : DEFAULT_SPY_LOCATIONS; }
    else if (activeTab === 'SPY_QUESTIONS') { localKey = `fimma_spy_questions_${language}`; defaultBackup = language === 'EN' ? DEFAULT_SPY_QUESTIONS_EN : DEFAULT_SPY_QUESTIONS; }
    else if (activeTab === 'REVOLVER') { localKey = `fimma_revolver_words_${language}`; defaultBackup = language === 'EN' ? DEFAULT_REVOLVER_WORDS_EN : DEFAULT_REVOLVER_WORDS; }

    localStorage.setItem(localKey, JSON.stringify(defaultBackup));
    playCorrect();
    setSuccessMsg(t('alertRestoredSuccess'));
    fetchItems();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const categories = [
    language === 'EN' ? 'All' : 'Wszystkie',
    ...Array.from(new Set(items.map(w => w.category || (language === 'EN' ? 'General' : 'Ogólne'))))
  ];

  const filteredItems = items.filter(item => {
    if (!item) return false;
    let matchesSearch = false;
    const searchLower = search.toLowerCase();
    
    if (activeTab === 'MARYLIN_MONROE') {
      const word = item.word || item.question || '';
      const forbidden = Array.isArray(item.forbidden) ? item.forbidden : [];
      matchesSearch = word.toLowerCase().includes(searchLower) || 
                      forbidden.some((fw: string) => fw && fw.toLowerCase().includes(searchLower));
    } else if (activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'SPY' || activeTab === 'REVOLVER') {
      const word = item.word || item.question || '';
      matchesSearch = word.toLowerCase().includes(searchLower);
    } else if (activeTab === 'SPY_QUESTIONS') {
      const text = item.question || item.word || '';
      matchesSearch = text.toLowerCase().includes(searchLower);
    } else {
      const text = item.question || item.word || '';
      matchesSearch = text.toLowerCase().includes(searchLower);
    }
    const defaultCat = activeTab === 'SPY' ? (language === 'EN' ? 'Locations' : 'Lokalizacje') : 
                       activeTab === 'SPY_QUESTIONS' ? (language === 'EN' ? 'Questions' : 'Pytania') : 
                       (language === 'EN' ? 'General' : 'Ogólne');
    const itemCategory = item.category || defaultCat;
    const matchesCategory = categoryFilter === (language === 'EN' ? 'All' : 'Wszystkie') || itemCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full fade-in" style={{ padding: '24px 0' }}>
      <div className="flex-row justify-between items-center" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={handleBackClick}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
        >
          <ArrowLeft size={16} />
          {t('backToMenu')}
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
          {t('title')}
        </h2>
      </div>

      <div className="flex-row gap-xs" style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { playClick(); setActiveTab('MARYLIN_MONROE'); }}
          className={`btn ${activeTab === 'MARYLIN_MONROE' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Tv size={15} />
          {language === 'EN' ? 'Marilyn Monroe (Taboo)' : 'Marylin Monroe (Tabu)'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('NINE_SECONDS'); }}
          className={`btn ${activeTab === 'NINE_SECONDS' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Timer size={15} />
          {language === 'EN' ? '9.5 Seconds (Questions)' : '9,5 Sekundy (Pytania)'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('REVERSE_CHARADES'); }}
          className={`btn ${activeTab === 'REVERSE_CHARADES' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Users size={15} />
          {language === 'EN' ? 'Reverse Charades' : 'Odwrócone Kalambury'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('LIPS'); }}
          className={`btn ${activeTab === 'LIPS' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <Users size={15} />
          {language === 'EN' ? 'Lips' : 'Usta Usta'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('BOMB'); }}
          className={`btn ${activeTab === 'BOMB' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <span>💣</span> {language === 'EN' ? 'Bomb (Words)' : 'Bomb (Hasła)'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('P_GAME'); }}
          className={`btn ${activeTab === 'P_GAME' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <span>P</span> {language === 'EN' ? 'P Game' : 'Gra na P'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('REVOLVER'); }}
          className={`btn ${activeTab === 'REVOLVER' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <span>🔫</span> {language === 'EN' ? 'Revolver' : 'Rewolwer'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('SPY'); }}
          className={`btn ${activeTab === 'SPY' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <span>🕵️</span> {language === 'EN' ? 'Spy (Locations)' : 'Szpieg (Lokalizacje)'}
        </button>
        <button
          onClick={() => { playClick(); setActiveTab('SPY_QUESTIONS'); }}
          className={`btn ${activeTab === 'SPY_QUESTIONS' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 16px', fontSize: '13px' }}
        >
          <span>❓</span> {language === 'EN' ? 'Spy (Questions)' : 'Szpieg (Pytania)'}
        </button>
      </div>

      <div className="db-layout">
        <div className="db-sidebar">
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEditing ? <Edit2 size={16} style={{ color: 'hsl(var(--primary))' }} /> : <Plus size={16} style={{ color: 'hsl(var(--primary))' }} />}
              {isEditing 
                ? (activeTab === 'MARYLIN_MONROE' ? t('editWord') : activeTab === 'NINE_SECONDS' ? t('editQuestion') : activeTab === 'REVERSE_CHARADES' ? t('editAction') : activeTab === 'LIPS' ? t('editLips') : activeTab === 'BOMB' ? t('editBomb') : activeTab === 'P_GAME' ? t('editPGame') : activeTab === 'REVOLVER' ? t('editRevolver') : activeTab === 'SPY' ? t('editLocation') : t('editSpyQuestion')) 
                : (activeTab === 'MARYLIN_MONROE' ? t('addWord') : activeTab === 'NINE_SECONDS' ? t('addQuestion') : activeTab === 'REVERSE_CHARADES' ? t('addAction') : activeTab === 'LIPS' ? t('addLips') : activeTab === 'BOMB' ? t('addBomb') : activeTab === 'P_GAME' ? t('addPGame') : activeTab === 'REVOLVER' ? t('addRevolver') : activeTab === 'SPY' ? t('addLocation') : t('addSpyQuestion'))}
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
                  {activeTab === 'MARYLIN_MONROE' ? t('mainWord') : activeTab === 'NINE_SECONDS' ? t('questionContent') : activeTab === 'LIPS' ? t('lipsWord') : activeTab === 'BOMB' ? t('bombWord') : activeTab === 'P_GAME' ? t('pGameWord') : activeTab === 'REVOLVER' ? t('revolverWord') : activeTab === 'SPY' ? t('location') : activeTab === 'SPY_QUESTIONS' ? t('spyQuestion') : t('actionWord')}
                </label>
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  placeholder={
                    activeTab === 'MARYLIN_MONROE' ? (language === 'EN' ? 'e.g. Harry Potter' : 'np. Robert Lewandowski') : 
                    activeTab === 'NINE_SECONDS' ? (language === 'EN' ? 'e.g. Name 3 countries bordering Poland' : 'np. Wymień 3 państwa graniczące z Polską') : 
                    activeTab === 'LIPS' ? (language === 'EN' ? 'e.g. Pink elephant' : 'np. Różowy słoń') : 
                    activeTab === 'BOMB' ? (language === 'EN' ? 'e.g. Television' : 'np. Telewizor') :
                    activeTab === 'P_GAME' ? (language === 'EN' ? 'e.g. Book' : 'np. Książka') :
                    activeTab === 'REVOLVER' ? (language === 'EN' ? 'e.g. Banana' : 'np. Banan') :
                    activeTab === 'SPY' ? (language === 'EN' ? 'e.g. Hospital' : 'np. Szpital') :
                    activeTab === 'SPY_QUESTIONS' ? (language === 'EN' ? 'e.g. What do people usually do there?' : 'np. Co ludzie najczęściej tam robią?') :
                    (language === 'EN' ? 'e.g. Riding a scooter' : 'np. Jazda na hulajnodze')
                  }
                  className="input-field"
                />
              </div>

              {activeTab === 'MARYLIN_MONROE' && (
                <div className="form-group">
                  <label className="form-label">{t('forbiddenWords')}</label>
                  <div className="flex-col gap-xs">
                    {forbiddenInputs.map((val, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={val}
                        onChange={(e) => handleForbiddenChange(idx, e.target.value)}
                        placeholder={`${t('forbiddenWordIdx')} ${idx + 1}`}
                        className="input-field"
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab !== 'SPY' && activeTab !== 'SPY_QUESTIONS' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">{t('category')}</label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="select-field"
                    >
                      {getCategoryOptions(activeTab).map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('difficulty')}</label>
                    <select
                      value={difficultyInput}
                      onChange={(e) => setDifficultyInput(e.target.value)}
                      className="select-field"
                    >
                      {language === 'EN' ? (
                        <>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </>
                      ) : (
                        <>
                          <option value="Łatwy">Łatwy</option>
                          <option value="Średni">Średni</option>
                          <option value="Trudny">Trudny</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex-row gap-sm" style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '12px 16px', fontSize: '13px' }}
                >
                  {isEditing ? t('saveChanges') : t('addToDb')}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                    style={{ padding: '12px 16px', fontSize: '13px' }}
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="glass" style={{ padding: '20px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={16} style={{ color: 'hsl(var(--primary))' }} />
              {t('csvTools')}
            </h3>
            
            <p style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginBottom: '16px', lineHeight: 1.4 }}>
              {t('csvFormatInfo')}<br/>
              {activeTab === 'MARYLIN_MONROE' && <code style={{ display: 'block', padding: '4px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'hsl(var(--primary))', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>{language === 'EN' ? 'Word;Forbidden1;Forbidden2;Forbidden3;Category;Difficulty' : 'Hasło;Zakazane1;Zakazane2;Zakazane3;Kategoria;Trudność'}</code>}
              {(activeTab === 'NINE_SECONDS' || activeTab === 'REVERSE_CHARADES' || activeTab === 'LIPS' || activeTab === 'BOMB' || activeTab === 'P_GAME' || activeTab === 'REVOLVER') && <code style={{ display: 'block', padding: '4px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'hsl(var(--primary))', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>{language === 'EN' ? 'Word/Question;Category;Difficulty' : 'Hasło/Pytanie;Kategoria;Trudność'}</code>}
              {activeTab === 'SPY' && <code style={{ display: 'block', padding: '4px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'hsl(var(--primary))', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>{language === 'EN' ? 'Location' : 'Lokalizacja'}</code>}
              {activeTab === 'SPY_QUESTIONS' && <code style={{ display: 'block', padding: '4px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'hsl(var(--primary))', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>{language === 'EN' ? 'Question' : 'Pytanie'}</code>}
            </p>

            <div className="flex-col gap-xs">
              <div style={{ display: 'flex', gap: '8px' }}>
                <label className="btn btn-secondary" style={{ flexGrow: 1, padding: '10px', fontSize: '12px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px' }} title={t('titleAddFromCsv')}>
                  <Upload size={14} />
                  {t('addFromCsv')}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleCsvImport(e, false)}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <label className="btn btn-secondary" style={{ flexGrow: 1, padding: '10px', fontSize: '12px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ff5c75' }} title={t('titleReplaceFromCsv')}>
                  <Upload size={14} />
                  {t('replaceFromCsv')}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if(window.confirm(t('confirmReplaceCsv'))) {
                        handleCsvImport(e, true);
                      } else {
                        e.target.value = '';
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleCsvExport}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px' }}
                >
                  <Download size={14} />
                  {t('exportToCsv')}
                </button>
                
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ff5c75' }}
                  title={t('titleRestoreDefaults')}
                >
                  {t('restoreDefaults')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-col w-full">
          <div className="glass db-filter-bar" style={{ padding: '16px', marginBottom: '24px', flexDirection: 'row', alignItems: 'center' }}>
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'MARYLIN_MONROE' ? t('searchPlaceholderWordForbidden') : 
                  activeTab === 'NINE_SECONDS' ? t('searchPlaceholderQuestion') : 
                  activeTab === 'LIPS' ? t('searchPlaceholderLips') : 
                  activeTab === 'BOMB' ? t('searchPlaceholderBomb') :
                  activeTab === 'P_GAME' ? t('searchPlaceholderPGame') :
                  activeTab === 'REVOLVER' ? t('searchPlaceholderRevolver') :
                  activeTab === 'SPY' ? t('searchPlaceholderLocation') :
                  activeTab === 'SPY_QUESTIONS' ? t('searchPlaceholderSpyQuestion') :
                  t('searchPlaceholderAction')
                }
                className="input-field search-input"
              />
            </div>
            {activeTab !== 'SPY' && activeTab !== 'SPY_QUESTIONS' && (
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
            )}
          </div>

          <div className="glass table-wrapper" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                {t('loadingDb')}
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                {t('noItemsFound')}
              </div>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>
                      {activeTab === 'MARYLIN_MONROE' ? t('headerWord') : 
                       activeTab === 'NINE_SECONDS' ? t('headerQuestion') : 
                       activeTab === 'LIPS' ? t('headerLips') : 
                       activeTab === 'BOMB' ? t('headerBomb') :
                       activeTab === 'P_GAME' ? t('headerPGame') :
                       activeTab === 'REVOLVER' ? t('headerRevolver') :
                       activeTab === 'SPY' ? t('headerLocation') :
                       activeTab === 'SPY_QUESTIONS' ? t('headerSpyQuestion') :
                       t('headerAction')}
                    </th>
                    {activeTab === 'MARYLIN_MONROE' && <th>{t('headerForbidden')}</th>}
                    {activeTab !== 'SPY' && activeTab !== 'SPY_QUESTIONS' && <th style={{ width: '180px' }}>{t('headerDetails')}</th>}
                    <th style={{ textAlign: 'right', width: '100px' }}>{t('headerActions')}</th>
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
                            {Array.isArray(item.forbidden) ? item.forbidden.map((fw: string, idx: number) => (
                              <span
                                key={idx}
                                className="badge-tag"
                                style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.15)', color: '#ff5c75', fontSize: '11px', fontWeight: 700 }}
                              >
                                {fw}
                              </span>
                            )) : null}
                          </div>
                        </td>
                      )}
                      {activeTab !== 'SPY' && activeTab !== 'SPY_QUESTIONS' && (
                        <td>
                          <div className="flex-row gap-xs">
                            <span className="badge-tag">{item.category}</span>
                            <span
                              className={`badge-tag ${
                                item.difficulty === 'Łatwy' || item.difficulty === 'Easy'
                                  ? 'badge-difficulty-easy'
                                  : item.difficulty === 'Średni' || item.difficulty === 'Medium'
                                  ? 'badge-difficulty-medium'
                                  : 'badge-difficulty-hard'
                              }`}
                            >
                              {item.difficulty}
                            </span>
                          </div>
                        </td>
                      )}
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex-row gap-xs justify-center" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn-icon"
                            title={t('btnTitleEdit')}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn-icon btn-icon-danger"
                            title={t('btnTitleDelete')}
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
