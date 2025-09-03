const historyMainContainer = document.querySelector(".history-main-container");
const historySearchButton = document.querySelector("#history-search-button");
const historySearchInput = document.querySelector("#word-input-box");

const menuButton = document.getElementById('menu-button');
const menu = document.getElementById('menu-item-list');
const menuHideButton = document.getElementById('menu-hide-button');

// Add click event listener to the button
menuButton.addEventListener('click', function() {
  menu.classList.add('active'); // Toggle the "active" class on the menu
});
menuHideButton.addEventListener('click', function() {
  menu.classList.remove('active');
});

function historyCollection() {
    const wordDetails = JSON.parse(localStorage.getItem("wordDetails"));
    console.log(wordDetails);

    // Function to render words in historyMainContainer
    function renderWords(words) {
        // Clear the container first
        historyMainContainer.innerHTML = "";

        words.forEach((wordDetail, index) => {
            // Create container for each word
            const wordContainer = document.createElement("div");
            wordContainer.classList.add("word-container");

            // Word paragraph
            const wordPara = document.createElement("p");
            wordPara.classList.add("wordPara");
            wordPara.innerText = wordDetail.word;
            wordContainer.appendChild(wordPara);

            // Remove button
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            removeBtn.classList.add("remove-button");
            removeBtn.addEventListener("click", () => {
                // Remove word from array and update localStorage
                wordDetails.splice(index, 1);
                localStorage.setItem("wordDetails", JSON.stringify(wordDetails));
                renderWords(wordDetails); // Re-render the updated list
            });
            wordContainer.appendChild(removeBtn);

            // Phonetic and audio
            const phoneticAndAudio= document.createElement("div");
            phoneticAndAudio.classList.add("phonetic-and-audio");
            wordDetail.phonetics.forEach((phonetic) => {
                const EachphoneticAndAudio = document.createElement("div");
                EachphoneticAndAudio.classList.add("Each-phonetic-and-audio");

                const phoneticText = document.createElement("p");
                phoneticText.innerText = phonetic.text || "Phonetic not available";
                phoneticText.classList.add("phonetic-text");
                EachphoneticAndAudio.appendChild(phoneticText);

                if (phonetic.audio) {
                    const audioElement = document.createElement("audio");
                    audioElement.src = phonetic.audio;
                    audioElement.style.display = "none";
                    EachphoneticAndAudio.appendChild(audioElement);

                    const audioRegion = phonetic.audio.includes("us") ? "US" :
                                        phonetic.audio.includes("uk") ? "UK" :
                                        phonetic.audio.includes("au") ? "AU" : "Other";

                    const audioPlayButton = document.createElement("button");
                    audioPlayButton.innerHTML = `<i class="fa-solid fa-volume-high"></i>${"  "}${audioRegion}`;
                    audioPlayButton.classList.add("audio-play-button");
                    EachphoneticAndAudio.appendChild(audioPlayButton);
                    audioPlayButton.addEventListener("click", () => {
                        audioElement.play();
                    });
                }
                phoneticAndAudio.appendChild(EachphoneticAndAudio);
                wordContainer.appendChild(phoneticAndAudio);
            });

            // Meaning box
            const meaningBox = document.createElement("div");
            meaningBox.classList.add("meaning-box");

            wordDetail.meanings.forEach((meaning) => {
                const ul = document.createElement("ul");
                meaningBox.appendChild(ul);

                const partOfSpeechText = document.createElement("li");
                partOfSpeechText.innerText = `Part of Speech: ${meaning.partOfSpeech}`;
                ul.appendChild(partOfSpeechText);

                const definitionText = document.createElement("li");
                definitionText.innerText = `Definition: ${meaning.definition}`;
                ul.appendChild(definitionText);

                if (meaning.example) {
                    const exampleText = document.createElement("li");
                    exampleText.classList.add("example-para");
                    exampleText.innerText = `Example: ${meaning.example}`;
                    ul.appendChild(exampleText);
                }
            });

            wordContainer.appendChild(meaningBox);
            historyMainContainer.prepend(wordContainer);
        });
    }

    // Initial render of words
    renderWords(wordDetails);

    // Search functionality
    historySearchButton.addEventListener("click", () => {
        const input = historySearchInput.value.trim().toLowerCase(); // Get input value and make it lowercase
        // if(input === ""){
        //     alert("Enter word before search");
        // }
        const filteredWords = wordDetails.filter(item => item.word.toLowerCase().includes(input)); // Filter words by the input

        console.log(filteredWords); // Show the filtered words in the console
        renderWords(filteredWords); // Render the filtered list of words
        historySearchInput.value = "";
       });
}

historyCollection(); // Run the function to initialize the history collection


