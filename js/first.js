const wordPara = document.querySelector("#word-para");
const phoneticsAndAudio = document.querySelector("#phonetics-and-audio");
const meaningBox = document.querySelector(".meaning-box");
const meaningSearchButton = document.querySelector("#meaning-search-button");

const menuButton = document.getElementById('menu-button');
const menu = document.getElementById('menu-item-list');
const menuHideButton = document.getElementById('menu-hide-button');

// Add click event listener to the button
menuButton.addEventListener('click', function() {
  menu.classList.add('active');
});
menuHideButton.addEventListener('click', function() {
  menu.classList.remove('active');
});


// // Function to get a random word
// function getRandomWord() {
//   const randomIndex = Math.floor(Math.random() * wordList.length);
//   return wordList[randomIndex];
// }

meaningSearchButton.addEventListener("click",()=>{
    const inputBox = document.querySelector("#word-input-box") 
    const inputedWord = inputBox.value.trim(); 
    
    const apiLink = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputedWord}`;

    async function dictionary(){
    try{
    const response = await fetch(apiLink);

    // Check if the fetch was successful
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);

    const word = data[0].word;
    wordPara.innerText = word;
    
    //phonetics and audio 
    phoneticsAndAudio.innerHTML = "";
    const phoneticData = [];
    if(data[0].phonetics && data[0].phonetics.length>0){
        data[0].phonetics.forEach((phonetic, index)=>{
            //creating box(div) for each phonetic item
            const phoneticItem = document.createElement("div");
            phoneticItem.classList.add("phonetic-Item");

            //creating paragraph for phonetic text
            const phoneticText = document.createElement("p");
            phoneticText.innerText = phonetic.text || "Phonetic not available";
            phoneticText.classList.add("phonetic-text");
            phoneticItem.appendChild(phoneticText);

            //creating audio player if audio url available 
             if (phonetic.audio) {
                const audioElement = document.createElement("audio");
                audioElement.src = phonetic.audio; // Set the audio source
                audioElement.style.display = "none"; // Hide the audio element from the user
                phoneticItem.appendChild(audioElement);

                //creating audio play button
                // Determine the region using ternary operator
                const audioRegion = phonetic.audio.includes("us") ? "US" :
                                    phonetic.audio.includes("uk") ? "UK" :
                                    phonetic.audio.includes("au") ? "AU" : "Other";

                const audioPlayButton = document.createElement("button");
                audioPlayButton.innerHTML = ` <i class="fa-solid fa-volume-high"></i>${"  "}${audioRegion}`;
                audioPlayButton.classList.add("audio-play-button");
                phoneticItem.appendChild(audioPlayButton);
                audioPlayButton.addEventListener("click", ()=>{
                    audioElement.play();
                });

                 // Store phonetic info in an array for localStorage
                phoneticData.push({
                    text: phonetic.text,
                    audio: phonetic.audio,
                    region: audioRegion
                });

            }
            phoneticsAndAudio.appendChild(phoneticItem);
        });
    } else {
        // If no phonetics found, display a message
            const noPhoneticsMessage = document.createElement('p');
            noPhoneticsMessage.innerText = "phonetics not found";
            phoneticsAndAudio.appendChild(noPhoneticsMessage);
    }
    // display meanings 
    const meanings = data[0].meanings;
    const meaningData = [];
    meaningBox.innerHTML = "";
    meanings.forEach((meaning) => {
        const partOfSpeech = meaning.partOfSpeech;
        const definition = meaning?.definitions[0]?.definition;
        const example = meaning?.definitions[0]?.example;

        //creating ul for each meaning
        const ul = document.createElement("ul");
        meaningBox.appendChild(ul);
        ul.classList.add("meaning-list");

        const partOfSpeechText = document.createElement("li");
        partOfSpeechText.innerText = `Part of Speech: ${partOfSpeech}`;
        ul.appendChild(partOfSpeechText);

        const definitionText = document.createElement("li");
        definitionText.innerText = `Definition: ${definition}`;
        ul.appendChild(definitionText);

        if (example) {
            const exampleText = document.createElement("li");
            exampleText.classList.add("example-para");
            exampleText.innerText = `Example: ${example}`;
            ul.appendChild(exampleText);
        }

        // Store meaning info in an array for localStorage
        meaningData.push({
            partOfSpeech,
            definition,
            example
        });
    });
  //creating object to store word, phoneticsData , meaningData in localStorage 
    const wordDetail = {
        word,
        phonetics: phoneticData,
        meanings: meaningData
    };

    // Retrieve existing data
        let existingData = localStorage.getItem("wordDetails");
        existingData = existingData ? JSON.parse(existingData) : [];

        // Add new word detail
        if (!existingData.find(item => item.word.toLowerCase() === word.toLowerCase())) {
            existingData.push(wordDetail);
        }

        // Save updated list
        localStorage.setItem("wordDetails", JSON.stringify(existingData));

        inputBox.value = "";

    } catch (error){
        console.log(error)
        if (inputedWord == ""){
            alert("enter word to find meaning");
        } else {
        alert("An error occurred. Please try another word.")
        }
    }
}

dictionary();

});


