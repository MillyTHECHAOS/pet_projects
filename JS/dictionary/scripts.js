// взято из урока https://www.youtube.com/watch?v=Byg-SlqKGpQ

let state = {
    word: "",
    meanings: [],
    phonetics: [],
  };
  
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById("word-input");
const form = document.querySelector(".form");
const containerWord = document.querySelector(".results-word");
const soundButton = document.querySelector(".results-sound");
const resultsWrapper = document.querySelector(".results");
const resultsList = document.querySelector(".results-list");
const errorContainer = document.querySelector(".error");
 
// обработка ошибки
const showError = (error) => {
 // стили
  errorContainer.style.display = "block";
  resultsWrapper.style.display = "none";
  
  // текст ошибки
  errorContainer.innerText = error.message;
};
 
const renderDefinition = (itemDefinition) => {
  // если в API словаре есть пример с выбранным словом, то пример будет выведен
  const example = itemDefinition.example
    ? `<div class="results-item__example">
        <p>Example: <span>${itemDefinition.example}</span></p>
      </div>`
    : "";
  // возврат блока с определением слова и добавление примера, если пример есть
  return `<div class="results-item__definition">
            <p>${itemDefinition.definition}</p>
            ${example}
          </div>`;
};

const getDefinitions = (definitions) => {
  return definitions.map(renderDefinition).join("");
};

// обработка данных, переведённых в формат json и полученных после fetch запроса
const renderItem = (item) => {
  return `<div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>
            <div class="results-item__definitions">
              ${getDefinitions(item.definitions)}
            </div>
          </div>`;
};
  
const showResults = () => {
  resultsWrapper.style.display = "block";
  resultsList.innerHTML = "";
  // отрисовка полученных данных
  state.meanings.forEach((item) => (resultsList.innerHTML += renderItem(item)));
 };
// вывод на страницу в div с классом results-word искомого слова
 const insertWord = () => {
  containerWord.innerText = state.word;
 };
  
 const handleSubmit = async (e) => {
   // предотвращение перезагрузки страницы
  e.preventDefault();

  errorContainer.style.display = "none";
 
  if (!state.word.trim()) return;

  try {
    // запрос данных о слове из API словаря
    const response = await fetch(`${url}${state.word}`);
    // перевод данных в читаемый формат json
    const data = await response.json();
    
    // проверка параметра Ok и length
    if (response.ok && data.length) {
      const item = data[0];

      state = {
        ...state,
        meanings: item.meanings,
        phonetics: item.phonetics,
      };

      insertWord();
      showResults();
    } else {
      // обработка ошибки введённого слова
      showError(data);
    }
    // обработка ошибки запроса
  } catch (err) {
     console.log(err);
   }
 };
 
 const handleKeyup = (e) => {
   // передача данных о введённом значении
   const value = e.target.value;
 
   state.word = value;
 };
 // вывод звковой дорожки, если она есть
 const handleSound = () => {
   if (state.phonetics.length) {
     const sound = state.phonetics[0];

     if (sound.audio) {
       new Audio(sound.audio).play();
     }
  }
};
  
// EVENTS
input.addEventListener("keyup", handleKeyup);
form.addEventListener("submit", handleSubmit);
soundButton.addEventListener("click", handleSound); 