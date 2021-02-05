'use strict';

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: false,
    sound: false,
    voiceInput: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });

    const area = document.querySelector('textarea');
    area.blur();
  },

  enKeyLayoutTwoDepth: [
    ["`", '~'], ["1", '!'], ["2", '@'], ["3", '#'], ["4", '$'], ["5", '%'], ["6", '^'], ["7", '&'], ["8", '*'], ["9", '('], ["0", ')'], ["-", "_"], ["=", '+'], "Backspace",
    "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ["[", '{'], ["]", '}'], ["\\", '|'],
    "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", [";", ':'], ["'", '"'], "Enter",
    "Shift", "z", "x", "c", "v", "b", "n", "m", [",", '<'], [".", '>'], ["/", '?'],
    "done", "en/ru", "Space", "voice_input", "sound", "ArrowLeft", "ArrowRight"
  ],

  ruKeyLayoutTwoDepth: [
    "ё", ["1", '!'], ["2", '"'], ["3", '№'], ["4", ';'], ["5", '%'], ["6", ':'], ["7", '?'], ["8", '*'], ["9", '('], ["0", ')'], ["-", "_"], ["=", '+'], "Backspace",
    "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", ["\\", '/'],
    "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
    "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", [".", ','],
    "done", "en/ru", "Space", "voice_input", "sound", "ArrowLeft", "ArrowLeft"
  ],

  keyLayout() {
    let keyLayout = [];

      this.enKeyLayoutTwoDepth.forEach(e => {
        if (Array.isArray(e)) {
          keyLayout.push(e[0]);
        } else {
          keyLayout.push(e);
        }
      });  
    // }
    return keyLayout;
  },

  ruKeyLayout() {
    let ruKeyLayout = [];

      this.ruKeyLayoutTwoDepth.forEach(e => {
        if (Array.isArray(e)) {
          ruKeyLayout.push(e[0]);
        } else {
          ruKeyLayout.push(e);
        }
      });  
    return ruKeyLayout;
  },

  keyLayoutShift() {
    let keyLayoutShift = [];

      this.enKeyLayoutTwoDepth.forEach(e => {
        if (Array.isArray(e)) {
          keyLayoutShift.push(e[1]);
        } else {
          keyLayoutShift.push(e);
        }
      });  
    // }
    return keyLayoutShift;
  },

  ruKeyLayoutShift() {
    let ruKeyLayoutShift = [];

      this.ruKeyLayoutTwoDepth.forEach(e => {
        if (Array.isArray(e)) {
          ruKeyLayoutShift.push(e[1]);
        } else {
          ruKeyLayoutShift.push(e);
        }
      });  
    return ruKeyLayoutShift;
  },

_createKeys() {
    const keysRow = document.createDocumentFragment(),
          area = document.querySelector('textarea');

    let keyLayout = this.keyLayout();

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = isLineBreakRequired(key);

      function isLineBreakRequired(key) {
        if (keyLayout.indexOf(key) === 13 ||
        keyLayout.indexOf(key) === 27 ||
        keyLayout.indexOf(key) === 40 ||
        keyLayout.indexOf(key) === 51) {
          return true;
        } return false;
      }

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      let keyCode = `Key${key.toUpperCase()}`;
      if (key === 'Shift') {
        keyCode = 'ShiftLeft';
      } else if (key.match(/\d/g)) {
        keyCode = `Digit${key}`;
      }
      
      switch (key) {
        case '`':
          keyCode = "Backquote";
          break;
        case '-':
          keyCode = "Minus";
          break;
        case '=':
          keyCode = "Equal";
          break;
        case '[':
          keyCode = "BracketLeft";
          break;
        case ']':
          keyCode = "BracketRight";
          break;
        case '\\':
          keyCode = "Backslash";
          break;
        case ';':
          keyCode = "Semicolon";
          break;
        case "'":
          keyCode = "Quote";
          break;
        case ',':
          keyCode = "Comma";
          break;
        case '.':
          keyCode = "Period";
          break;
        case '/':
          keyCode = "Slash";
          break;
      }

      document.addEventListener('keydown', event => {
        if (event.code === keyCode || event.code === key) {
          area.focus();
          if (event.code === 'CapsLock') {
            keyElement.classList.toggle("keyboard__key--keydown");
            this._toggleCapsLock();
          } else if (event.code === 'ShiftLeft') {
            keyElement.classList.toggle("keyboard__key--keydown");
            this._toggleShift();
          } else {
            keyElement.classList.add("keyboard__key--keydown");
          }
        }
      });

      document.addEventListener('keyup', event => {
        if ( (event.code === keyCode || event.code === key) && 
        (event.code !== 'CapsLock' && event.code !== "ShiftLeft") ) {
          keyElement.classList.remove("keyboard__key--keydown");
        }
      });

      switch (key) {
        case "Backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            area.focus();
            let start = area.selectionStart,
                end = area.selectionEnd;
            this.properties.value = this.properties.value.substring(0, start - 1) + 
            this.properties.value.substring(end, this.properties.value.length);
            area.focus();

            this._triggerEvent("oninput");
            area.setSelectionRange(start - 1, end - 1);
            this._keysSound('./assets/sounds/backspace.mp3');
          });

          break;

        case "CapsLock":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--keydown", this.properties.capsLock);
            this._keysSound('./assets/sounds/caps.mp3');
          });

          break;

        case "Shift":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

          keyElement.addEventListener("click", () => {
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--keydown", this.properties.shift);
            this._keysSound('./assets/sounds/shift.mp3');
          });

          break;
    
        case "Enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            area.focus();
            let start = area.selectionStart,
                end = area.selectionEnd;
            this.properties.value = this.properties.value.substring(0, start) + "\n" + 
            this.properties.value.substring(end, this.properties.value.length);
            area.focus();

            this._triggerEvent("oninput");
            area.setSelectionRange(start + 1, end + 1);
            this._keysSound('./assets/sounds/enter.mp3');
          });

          break;

        case "Space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            area.focus();
            let start = area.selectionStart,
                end = area.selectionEnd;
            this.properties.value = this.properties.value.substring(0, start) + " " + 
            this.properties.value.substring(end, this.properties.value.length);
            area.focus();

            this._triggerEvent("oninput");
            area.setSelectionRange(start + 1, end + 1);
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        case "Tab":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_tab");

          keyElement.addEventListener("click", () => {
            area.focus();
            let start = area.selectionStart,
                end = area.selectionEnd;
            this.properties.value = this.properties.value.substring(0, start) + "  " + 
            this.properties.value.substring(end, this.properties.value.length);
            area.focus();

            this._triggerEvent("oninput");
            area.setSelectionRange(start + 2, end + 2);
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        case "ArrowLeft":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

          keyElement.addEventListener("click", () => {
            this.cursorLeft(area);
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        case "ArrowRight":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

          keyElement.addEventListener("click", () => {
            this.cursorRight(area);
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        case "voice_input":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_voice");

          keyElement.addEventListener("click", () => {
            this.properties.voiceInput = !this.properties.voiceInput;
            if (this.properties.voiceInput) {
              this.speech.start();
            } else {
              this.speech.stop();
            }
            keyElement.classList.toggle("keyboard__key--keydown");
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        case "sound":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("music_note");

          keyElement.addEventListener("click", () => {
            this._toggleSound();
            keyElement.classList.toggle("keyboard__key--keydown", this.properties.sound);
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;
  
        case "en/ru":
        keyElement.classList.add("keyboard__key--wide");
        keyElement.innerHTML = 'en/ru';

        keyElement.addEventListener("click", () => {
            this._toggleLang();
            keyElement.textContent = this.properties.language ? 'ru' : 'en';
            this._keysSound('./assets/sounds/othersKeys.mp3');
        });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            area.blur();
            this._triggerEvent("onclose");
            this._keysSound('./assets/sounds/othersKeys.mp3');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          area.focus();

          let start = area.selectionStart,
              end = area.selectionEnd;

          keyElement.addEventListener("click", () => {

            let ind = keyLayout.indexOf(key),
                ruKey = this.ruKeyLayout()[ind],
                ruKeyShift = this.ruKeyLayoutShift()[ind],
                keyShift = this.keyLayoutShift()[ind];

              if (this.properties.language) {

                start = area.selectionStart;
                end = area.selectionEnd;    

                if (this.properties.capsLock === true && this.properties.shift === false) {
                  this.properties.value = this.properties.value.substring(0, start) + ruKey.toUpperCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else if (this.properties.capsLock === false && this.properties.shift === true) {
                  this.properties.value = this.properties.value.substring(0, start) + ruKeyShift.toUpperCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else if (this.properties.capsLock === true && this.properties.shift === true) {
                  this.properties.value = this.properties.value.substring(0, start) + ruKeyShift.toLowerCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else {
                  this.properties.value = this.properties.value.substring(0, start) + ruKey + 
                  this.properties.value.substring(end, this.properties.value.length);
                }
                this._triggerEvent("oninput");
                this._keysSound('./assets/sounds/ruKey.mp3');

              } else {
                start = area.selectionStart;
                end = area.selectionEnd;    

                if (this.properties.capsLock === true && this.properties.shift === false) {
                  this.properties.value = this.properties.value.substring(0, start) + key.toUpperCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else if (this.properties.capsLock === false && this.properties.shift === true) {
                  this.properties.value = this.properties.value.substring(0, start) + keyShift.toUpperCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else if (this.properties.capsLock === true && this.properties.shift === true) {
                  this.properties.value = this.properties.value.substring(0, start) + keyShift.toLowerCase() + 
                  this.properties.value.substring(end, this.properties.value.length);
                } else {
                  this.properties.value = this.properties.value.substring(0, start) + key + 
                  this.properties.value.substring(end, this.properties.value.length);
                }
                this._triggerEvent("oninput");
                area.focus();
                this._keysSound('./assets/sounds/enKey.mp3');
              }
              area.setSelectionRange(start + 1, end + 1);
              area.focus();
          });

          break;
      }
      keysRow.appendChild(keyElement);

      if (insertLineBreak) {
        keysRow.appendChild(document.createElement("br"));
      }
    });

    return keysRow;
  },

  cursorLeft(area) {
    area.focus();

    let start = area.selectionStart,
        end = area.selectionEnd;

    area.setSelectionRange(start - 1, end - 1);
    area.focus();
  },

  cursorRight(area) {
    area.focus();

    let start = area.selectionStart,
        end = area.selectionEnd;

    area.setSelectionRange(start + 1, end + 1);
    area.focus();
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.textContent !== 'en/ru' && 
      key.textContent !== 'en' && key.textContent !== 'ru') {
        if ( (this.properties.capsLock === true && this.properties.shift === false) || 
        (this.properties.capsLock === false && this.properties.shift === true) ) {
          key.textContent = key.textContent.toUpperCase();
        } else {
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
  },

  _toggleShift() {
    let ruKeyLayoutShift = this.ruKeyLayoutShift(),
        keyLayoutShift = this.keyLayoutShift(),
        keyLayout = this.keyLayout(),
        ruKeyLayout = this.ruKeyLayout();

    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.textContent !== 'en/ru' && 
      key.textContent !== 'en' && key.textContent !== 'ru') {
        if (this.properties.language) {

          if (this.properties.capsLock === true && this.properties.shift === false) {
            key.textContent = ruKeyLayout[ruKeyLayoutShift.indexOf(key.textContent.toLowerCase())].toUpperCase();
          } else if (this.properties.capsLock === false && this.properties.shift === true) {
            key.textContent = ruKeyLayoutShift[ruKeyLayout.indexOf(key.textContent.toLowerCase())].toUpperCase();
          } else if (this.properties.capsLock === true && this.properties.shift === true) {
            key.textContent = ruKeyLayoutShift[ruKeyLayout.indexOf(key.textContent.toLowerCase())];
          } else {
            key.textContent = ruKeyLayout[ruKeyLayoutShift.indexOf(key.textContent.toLowerCase())];
          }
        } else {
          if (this.properties.capsLock === true && this.properties.shift === false) {
            key.textContent = keyLayout[keyLayoutShift.indexOf(key.textContent.toLowerCase())].toUpperCase();
          } else if (this.properties.capsLock === false && this.properties.shift === true) {
            key.textContent = keyLayoutShift[keyLayout.indexOf(key.textContent.toLowerCase())].toUpperCase();
          } else if (this.properties.capsLock === true && this.properties.shift === true) {
            key.textContent = keyLayoutShift[keyLayout.indexOf(key.textContent.toLowerCase())];
          } else {
            key.textContent = keyLayout[keyLayoutShift.indexOf(key.textContent.toLowerCase())];
          }
        }
      }
    }
  },

  _toggleLang() {
    let ruKeyLayout = this.ruKeyLayout(),
        keyLayout = this.keyLayout(),
        ruKeyLayoutShift = this.ruKeyLayoutShift(),
        keyLayoutShift = this.keyLayoutShift();

    this.properties.language = !this.properties.language;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.textContent !== 'en/ru' && 
      key.textContent !== 'en' && key.textContent !== 'ru') {
        if (this.properties.capsLock === true && this.properties.shift === false) {
          if (this.properties.language) {
              key.textContent = ruKeyLayout[keyLayout.indexOf(key.textContent.toLowerCase())].toUpperCase();
          } else {
              key.textContent = keyLayout[ruKeyLayout.indexOf(key.textContent.toLowerCase())].toUpperCase();
          }
        } else if (this.properties.capsLock === false && this.properties.shift === true) {
            if (this.properties.language) {
                key.textContent = ruKeyLayoutShift[keyLayoutShift.indexOf(key.textContent.toLowerCase())].toUpperCase();
            } else {
                key.textContent = keyLayoutShift[ruKeyLayoutShift.indexOf(key.textContent.toLowerCase())].toUpperCase();
            }
        } else if (this.properties.capsLock === true && this.properties.shift === true) {
            if (this.properties.language) {
              key.textContent = ruKeyLayoutShift[keyLayoutShift.indexOf(key.textContent.toLowerCase())];
            } else {
                key.textContent = keyLayoutShift[ruKeyLayoutShift.indexOf(key.textContent.toLowerCase())];
            }
        } else {
          if (this.properties.language) {
            key.textContent = ruKeyLayout[keyLayout.indexOf(key.textContent.toLowerCase())];
          } else {
            key.textContent = keyLayout[ruKeyLayout.indexOf(key.textContent.toLowerCase())];
          }
        }
      }
    }
  },

    speech: {
      recognition: null,
          
      start: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        Keyboard.speech.recognition = new SpeechRecognition();
        
        Keyboard.speech.recognition.continuous = true;
        Keyboard.speech.recognition.interimResults = true;
        if (Keyboard.properties.language) {
          Keyboard.speech.recognition.lang = "ru-RU";
        } else {
          Keyboard.speech.recognition.lang = "en-US";
        }

        const area = document.querySelector('textarea');
        let txt = document.createElement('p');
        area.appendChild(txt);
        
        Keyboard.speech.recognition.onerror = function (evt) {
          console.log(evt);
        };
        Keyboard.speech.recognition.onresult = function(e) {
          const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
    
            const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
            area.textContent = poopScript;
    
            if (e.results[0].isFinal) {
              txt = document.createElement('p');
              area.appendChild(txt);
            }
        };
        
        Keyboard.speech.recognition.start();
      },
    
      stop : function () {
        if (Keyboard.speech.recognition != null) {
          Keyboard.speech.continuous = false;
          Keyboard.speech.recognition.stop();
          Keyboard.speech.recognition = null;
        }
      }
    },
  

  _toggleSound() {
    this.properties.sound = !this.properties.sound;
  },

  _keysSound(url) {
    const audioElement = document.createElement("audio");
          audioElement.src = url;

    if (this.properties.sound) {
      audioElement.play();
    }
  },

  _ruSound() {
    const audioElement = document.createElement("audio");
          audioElement.src = "./assets/sounds/ruKey.mp3";

    if (this.properties.sound) {
      audioElement.play();
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init("ru");
});