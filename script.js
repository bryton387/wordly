const API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const resultsSection = document.getElementById("resultsSection");
const wordTitle = document.getElementById("wordTitle");
const phonetic = document.getElementById("phonetic");
const audioControls = document.getElementById("audioControls");
const partOfSpeech = document.getElementById("partOfSpeech");
const definitionsContainer = document.getElementById("definitionsContainer");
const synonymsContainer = document.getElementById("synonymsContainer");
const antonymsContainer = document.getElementById("antonymsContainer");
const source = document.getElementById("source");
const saveBtn = document.getElementById("saveBtn");

let currentWord = null;

function setLoadingState(isLoading) {
  loading.classList.toggle("is-visible", isLoading);
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Searching..." : "Search";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("is-visible");
  resultsSection.classList.remove("is-visible");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("is-visible");
}

function getSavedWords() {
  try {
    const savedWords = localStorage.getItem("wordly-favorites");
    return savedWords ? JSON.parse(savedWords) : [];
  } catch (error) {
    return [];
  }
}

function updateSaveButton(word) {
  const savedWords = getSavedWords();
  const normalizedWord = word ? word.toLowerCase() : "";
  const isSaved = savedWords.includes(normalizedWord);

  saveBtn.textContent = isSaved ? "Saved to Favorites" : "Save to Favorites";
  saveBtn.disabled = !word;
}

function saveCurrentWord() {
  if (!currentWord) {
    return;
  }

  const savedWords = getSavedWords();
  const normalizedWord = currentWord.toLowerCase();

  if (!savedWords.includes(normalizedWord)) {
    savedWords.push(normalizedWord);
    localStorage.setItem("wordly-favorites", JSON.stringify(savedWords));
  }

  updateSaveButton(currentWord);
}

function createTagSection(title, items) {
  if (!items.length) {
    return "";
  }

  const tags = items
    .map((item) => `<span class="tag">${item}</span>`)
    .join("");

  return `
    <div class="tag-section">
      <h3>${title}</h3>
      <div class="tag-list">${tags}</div>
    </div>
  `;
}

function renderDefinitions(meanings) {
  definitionsContainer.innerHTML = meanings
    .map((meaning) => {
      const definitions = meaning.definitions
        .map((definition) => {
          const example = definition.example
            ? `<p class="definition-example">"${definition.example}"</p>`
            : "";

          return `
            <div class="definition-card">
              <p>${definition.definition}</p>
              ${example}
            </div>
          `;
        })
        .join("");

      return `
        <section class="meaning-block">
          <h3 class="meaning-title">${meaning.partOfSpeech}</h3>
          ${definitions}
        </section>
      `;
    })
    .join("");
}

function renderAudio(phonetics) {
  const audioEntry = phonetics.find((entry) => entry.audio);

  if (!audioEntry) {
    audioControls.innerHTML = "";
    return;
  }

  audioControls.innerHTML = `
    <audio controls src="${audioEntry.audio}">
      Your browser does not support audio playback.
    </audio>
  `;
}

function renderSource(sourceUrls) {
  if (!sourceUrls.length) {
    source.innerHTML = "";
    return;
  }

  source.innerHTML = `Source: <a href="${sourceUrls[0]}" target="_blank" rel="noopener noreferrer">${sourceUrls[0]}</a>`;
}

function renderWord(entry) {
  const allDefinitions = entry.meanings ?? [];
  const synonyms = [...new Set(allDefinitions.flatMap((meaning) => meaning.synonyms || []))];
  const antonyms = [...new Set(allDefinitions.flatMap((meaning) => meaning.antonyms || []))];
  const phoneticText =
    entry.phonetic || entry.phonetics?.find((item) => item.text)?.text || "";

  currentWord = entry.word;
  wordTitle.textContent = entry.word;
  phonetic.textContent = phoneticText;
  partOfSpeech.textContent = allDefinitions[0]?.partOfSpeech
    ? `Part of speech: ${allDefinitions[0].partOfSpeech}`
    : "";

  renderDefinitions(allDefinitions);
  renderAudio(entry.phonetics || []);
  synonymsContainer.innerHTML = createTagSection("Synonyms", synonyms);
  antonymsContainer.innerHTML = createTagSection("Antonyms", antonyms);
  renderSource(entry.sourceUrls || []);
  updateSaveButton(entry.word);

  resultsSection.classList.add("is-visible");
}

async function searchWord(word) {
  setLoadingState(true);
  clearError();

  try {
    const response = await fetch(`${API_BASE_URL}${encodeURIComponent(word)}`);
    const data = await response.json();

    if (!response.ok || !Array.isArray(data) || !data.length) {
      throw new Error(data?.message || "No definition found.");
    }

    renderWord(data[0]);
  } catch (error) {
    currentWord = null;
    updateSaveButton("");
    showError(error.message || "Something went wrong while searching.");
  } finally {
    setLoadingState(false);
  }
}

function applyStoredTheme() {
  const storedTheme = localStorage.getItem("wordly-theme");
  const isDarkMode = storedTheme === "dark";

  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggle.textContent = isDarkMode ? "light" : "dark";
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const word = searchInput.value.trim();

  if (!word) {
    showError("Enter a word to search.");
    return;
  }

  searchWord(word);
});

themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("wordly-theme", isDarkMode ? "dark" : "light");
  themeToggle.textContent = isDarkMode ? "light" : "dark";
});

saveBtn.addEventListener("click", saveCurrentWord);

applyStoredTheme();
setLoadingState(false);
updateSaveButton("");
