 //SELECT ELEMENTS 
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const resultsSection = document.getElementById("resultsSection");

const wordTitle = document.getElementById("wordTitle");
const phonetic = document.getElementById("phonetic");
const definitionsContainer = document.getElementById("definitionsContainer");

const themeToggle = document.getElementById("themeToggle");
const saveBtn = document.getElementById("saveBtn");


//1. START (USER ACTION) 
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const word = input.value.trim();
    if (!word) return;

    fetchWord(word);
});


//FETCH DATA 
function fetchWord(word) {
    // show loading
    loading.style.display = "block";
    resultsSection.style.display = "none";
    errorMessage.style.display = "none";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Not found");
            }
            return response.json();
        })
        .then(function(data) {
            loading.style.display = "none";
            displayData(data[0]);
        })
        .catch(function() {
            loading.style.display = "none";
            errorMessage.style.display = "block";
            errorMessage.textContent = "Word not found 😢";
        });
}


//3. DISPLAY DATA
function displayData(data) {
    resultsSection.style.display = "block";

    // word + phonetic
    wordTitle.textContent = data.word;
    phonetic.textContent = data.phonetic || "";

    // clear old results
    definitionsContainer.innerHTML = "";

    // loop meanings
    data.meanings.forEach(function(meaning) {
        const block = document.createElement("div");
        block.classList.add("meaning-block");

        block.innerHTML = `
            <h3 class="meaning-title">${meaning.partOfSpeech}</h3>
            ${meaning.definitions.map(function(def) {
                return `
                    <div class="definition-card">
                        <p>${def.definition}</p>
                        ${def.example ? `<p class="definition-example">"${def.example}"</p>` : ""}
                    </div>
                `;
            }).join("")}
        `;

        definitionsContainer.appendChild(block);
    });
}


// DARK MODE 
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "light";
    } else {
        themeToggle.textContent = "dark";
    }
});


//  SAVE TO FAVORITES 
saveBtn.addEventListener("click", function() {
    const word = wordTitle.textContent;
    if (!word) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Saved!");
    } else {
        alert("Already saved!");
    }
});
