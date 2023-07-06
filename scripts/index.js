"use strict";

const game = {
  playerName: '',
  isRunning: false,
  wasRunning: false,
  targetWords: [],
  targetText: [],
  userText: [],
  totalWords: null,
  numberCorrectWords: 0,
  numberIncorrectWords: 0,
  completedWordsCount:0,
  percentageCompletion: 0,
  timeoutId: null,
  runFirstAnimation: false,
  runFinalAnimation: false,
  chosenHero: '',
  heroFire: $('#fire-standing'),
  heroWater: $('#water-standing'),
  heroLeaf: $('#leaf-standing'),
  fireHurt: $('#fire-shaking'),
  waterHurt: $('#water-shaking'),
  leafHurt: $('#leaf-shaking'),
  monster: $('#monster-standing'),
  hpHero: $('.hero-hp'),
  hpMonster: $('.monster-hp'),
  loopDuration: 1,
  selectedOption: null,
  currentMode: 'easy', 
  currentRound: '1', 
  currentScreen: 'splash-scr',
  numberOfParagraph: 2,
  totalTime: 180,
  timeRemaining: 180,
  minutes: $('#mins'),
  seconds: $('#secs'),
  switchScreen: function(newScreen) {
    $('.screen').hide();
    $(`#${newScreen}`).fadeIn(350);
    this.currentScreen = newScreen;
    this.isRunning = false;
    this.wasRunning = false;
    
    // if (newScreen === 'game-scr') {
    //     $('.btn-quit-0').show();
    //     $('.btn-help').show();
    // } else if (newScreen === 'end-game-scr'){
    //     $('.btn-quit-0').hide();
    //     $('.btn-help').hide();
    // } else {
    //     $('.btn-quit-0').hide();
    //     $('.btn-help').show();
    // };
  },
  fetchTheBacon: () => {
    let paragraph = '';
    // Set the conditions to generate the PARAGRAPH & TIMER based on the mode and round
    if (game.currentMode === 'easy' && game.currentRound === '1') {
      paragraph = game.text50[Math.floor(Math.random() * game.numberOfParagraph)];
    } else if ((game.currentMode === 'easy' && game.currentRound === '2') || (game.currentMode === 'normal' && game.currentRound === '1')){
      paragraph = game.text70[Math.floor(Math.random() * game.numberOfParagraph)];
      game.totalTime = 165;
      game.timeRemaining = 165;
    } else if ((game.currentMode === 'easy' && game.currentRound === '3') || (game.currentMode === 'normal' && game.currentRound === '2') || (game.currentMode === 'hard' && game.currentRound === '1')) {
      paragraph = game.text100[Math.floor(Math.random() * game.numberOfParagraph)];
      game.totalTime = 150;
      game.timeRemaining = 150;
    } else if ((game.currentMode === 'normal' && game.currentRound === '3') || (game.currentMode === 'hard' && game.currentRound === '2')){
      paragraph = game.text120[Math.floor(Math.random() * game.numberOfParagraph)];
      game.totalTime = 135;
      game.timeRemaining = 135;
    } else if (game.currentMode === 'hard' && game.currentRound === '3') {
      paragraph = game.text150[Math.floor(Math.random() * game.numberOfParagraph)];
      game.totalTime = 120;
      game.timeRemaining = 120;
    }
    if (paragraph && paragraph.length > 0) {
      $("#target").html("");
      
        game.targetWords = paragraph.split(/\s+/).filter(word => word.trim() !== "");
        // Count total words and add to totalWords property
        game.totalWords = game.targetWords.length;
        $("#target").append("<p>");
        // now loop through each character 
        for (let j = 0; j < paragraph.length; j++) {
          if (paragraph[j] !== " " || (j > 0 && paragraph[j - 1] !== " ")) {
            $("#target").append(`<span>${paragraph[j]}</span>`);
            game.targetText.push(paragraph[j]);
          }
        }

      $("#target").append("</p>");
      // these 2 lines of codes are for highlighting the first letter when the paragraph was generated
      $("#target span:eq(0)").addClass("cursorPosition");
      $("#target span:eq(0)").addClass("cursorPosition-bkg");
    };
    
    },
  displayMode: function () {
    let modeDisplay = $('.mode-display');
    if (this.currentMode === 'easy') {
      modeDisplay.text(game.currentMode);
    } else if (this.currentMode === 'normal') {
      modeDisplay.text(game.currentMode);
    } else {
      modeDisplay.text(game.currentMode);
    }
  },

  displayPlayerName: function () {
    $('.player-name-display').text(game.playerName);
  },

  displayRound: function () {
    let roundDisplay = $('.round-display');
    if (game.currentRound === '1') {
      roundDisplay.html(
        '<img class="star" src="images/star.png" alt="star">'
      );
    } else if (game.currentRound === '2') {
      roundDisplay.html(
        '<img class="star" src="images/star.png" alt="star"><img class="star" src="images/star.png" alt="star">'
      );
    } else {
      roundDisplay.html(
        '<img class="star" src="images/star.png" alt="star"><img class="star" src="images/star.png" alt="star"><img class="star" src="images/star.png" alt="star">'
      );
    };
  },

  handleKeyup: function (event) {
    console.log("key up", event, event.key);
    // these lines of codes help to add cursor position with styles and remove these styles when the letters were typed.
    const cursorPosition = game.userText.length +1;
    const pastCursorPosition = game.userText.length;

    if (/^[a-z ,.-]$/i.test(event.key)) {
    $("#target > span").eq(cursorPosition).addClass("cursorPosition");
    $("#target > span").eq(cursorPosition).addClass("cursorPosition-bkg");
    $("#target > span").eq(pastCursorPosition).removeClass("cursorPosition");
    $("#target > span").eq(pastCursorPosition).removeClass("cursorPosition-bkg");
    } else {
      return;
    };

    // Checking key valid or invalid then call functions
    const regex = /^[a-z ,.-]$/i;
    if (regex.test(event.key)) {
      // console.log("valid key");
      game.checkLetterMatch(event.key);
      game.checkWordCompletion(event.key);
    } else {
      // console.log("invalid key");
    };

    
  },
  checkLetterMatch: (letter) => {
    console.log(letter);

    const currentIndex = game.userText.length;
    if (letter === game.targetText[currentIndex]) {
      $("#target > span").eq(currentIndex).removeClass("incorrect");
      $("#target > span").eq(currentIndex).addClass("correct");
    } else {
      $("#target > span").eq(currentIndex).removeClass("correct");
      $("#target > span").eq(currentIndex).addClass("incorrect");
    }

    game.userText.push(letter);
  },
  // Count number of correct words
  checkWordCompletion: function () {
    let completedWordsCount = 0;
    let numberCorrectWords = 0;
    let currentWord = "";
    let currentIndex = 0;
  
    for (let i = 0; i < game.userText.length; i++) {
      const userLetter = game.userText[i];
      const targetLetter = game.targetText[i];
  
      if (targetLetter === " ") {
        if (currentWord.trim() !== "") {
          completedWordsCount++;
  
          if (currentWord === game.targetWords[currentIndex]) {
            numberCorrectWords++;
          }
  
          currentWord = "";
          currentIndex++;
        }
      } else {
        currentWord += userLetter;
      }
    }
  
    game.numberCorrectWords = numberCorrectWords;
    game.numberIncorrectWords = completedWordsCount - game.numberCorrectWords;
    game.completedWordsCount = completedWordsCount;
    game.percentageCompletion = Math.floor(game.completedWordsCount/game.totalWords * 100);
    if (game.percentageCompletion >= 25 && game.runFinalAnimation === false) {
      game.heroFinalAttackAnimation();
      //update monster HP bar after the attack
      game.timeoutId = setTimeout (function () {
        game.hpMonster.css('width','0%')}, 1200);
    } else if (game.percentageCompletion >=10 && game.runFirstAnimation === false) {
      game.heroFirstAttackAnimation();
      //update monster HP bar after the attack
      game.timeoutId = setTimeout (function () {
        game.hpMonster.css('width','60%')}, 1200);
    } else if (!game.runFirstAnimation && !game.runSecondAnimation) {
      $('#fireball').removeClass("hero-attack-1").hide();
      $('#watergun').removeClass("hero-attack-1").hide();
      $('#razorleaf').removeClass("hero-attack-1").hide();
    };
  },

  showHeroAtFirst: function () {
    $('.hero-standing').hide();
    if (game.chosenHero === 'fire') {
      game.heroFire.show();
      $('.hero-name-display').text('Fire');
    } else if (game.chosenHero === 'water') {
      game.heroWater.show();
      $('.hero-name-display').text('Water');
    } else {
      game.heroLeaf.show();
      $('.hero-name-display').text('Leaf');
    };
  },
  
  heroFirstAttackAnimation: function () {
    if (game.chosenHero === 'fire') {
      // Hide hero standing and show spelling animation
      game.heroFire.hide();
      $('#fire-spelling').addClass("spelling").show();
      $('#fire-ball-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#fire-spelling').removeClass("spelling").hide()},1000);
      game.timeoutId = setTimeout (function () {
        game.heroFire.fadeIn()}, 1000);
      // Fireball animation
      $('#fireball').addClass("hero-attack-1").show().one("animationend", function () {
        $('#fireball').removeClass("hero-attack-1").hide();
        game.runFirstAnimation = true;
      });
      game.runFirstAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, 900);
     
       
    } else if (game.chosenHero === 'water') {
      // Hide hero standing and show spelling animation
      game.heroWater.hide();
      $('#water-spelling').addClass("spelling").show();
      game.timeoutId = setTimeout(function () {
        $('#water-gun-audio')[0].play()}, 500);
      game.timeoutId = setTimeout (function () {
         $('#water-spelling').removeClass("spelling").hide()}, 1000);
      game.timeoutId = setTimeout (function () {
      game.heroWater.fadeIn()}, 1000);
      // Water gun animation
      game.timeoutId = setTimeout (function () {
        $('#watergun').addClass("hero-attack-1").show().one("animationend", function () {
          $('#watergun').removeClass("hero-attack-1").hide();
          game.runFirstAnimation = true;
        });}, 500);
        game.runFirstAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, 900);

    } else if (game.chosenHero === 'leaf') {
      // Hide hero standing and show spelling animation
      game.heroLeaf.hide();
      $('#leaf-spelling').addClass("spelling").show();
      $('#razor-leaf-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#leaf-spelling').removeClass("spelling").hide()},1000);
      game.timeoutId = setTimeout (function () {
        game.heroLeaf.fadeIn()},1000);
      // Razor leaf animation
      
      game.timeoutId = setTimeout (function() {
        $('#razorleaf').addClass("hero-attack-1").show().one("animationend", function () {
          $('#razorleaf').removeClass("hero-attack-1").hide();
          game.runFirstAnimation = true;
        })}, game.loopDuration * 500);
        game.runFirstAnimation = true; 
      // Monster Takes Damage animation  
      
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, game.loopDuration * 900
      );
      
    };
  },

  heroFinalAttackAnimation: function () {
    if (game.chosenHero === 'fire') {
      // Hide hero standing and show spelling animation
      game.heroFire.hide();
      $('#fire-spelling').addClass("spelling").show();
      $('#fire-ball-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#fire-spelling').removeClass("spelling").hide()}, 1000);
      game.timeoutId = setTimeout (function () {
        game.heroFire.fadeIn()}, 1000);
      // Inferno animation
      $('#inferno').addClass("hero-attack-2").show();
      game.timeoutId = setTimeout (function () {
        $('#inferno').removeClass("hero-attack-2").hide()
      }, 1000);
      game.runFinalAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, 900
      );
      } else if (game.chosenHero === 'water') {
        // Hide hero standing and show spelling animation
        game.heroWater.hide();
        $('#water-spelling').addClass("spelling").show();
        game.timeoutId = setTimeout(function () {
          $('#waves-audio')[0].play()}, 500);
        game.timeoutId = setTimeout (function () {
           $('#water-spelling').removeClass("spelling").hide()}, 1000);
        game.timeoutId = setTimeout (function () {
        game.heroWater.fadeIn()}, 1000);
        // Wave animation
        game.timeoutId = setTimeout (function () {
          $('#wave').addClass("hero-attack-1").show().one("animationend", function () {
            $('#wave').removeClass("hero-attack-1").hide();
            game.runFinalAnimation = true;
          });}, 500);
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        game.timeoutId = setTimeout (function () {
          game.monsterHurt()}, 900);
      } else if (game.chosenHero === 'leaf') {
        // Hide hero standing and show spelling animation
        game.heroLeaf.hide();
        $('#leaf-spelling').addClass("spelling").show();
        $('#solar-beam-audio')[0].play();
        game.timeoutId = setTimeout (function () {
          $('#leaf-spelling').removeClass("spelling").hide()}, 1000);
        game.timeoutId = setTimeout (function () {
          game.heroLeaf.fadeIn()}, 1000);
        // Solar beam animation
          $('#solarbeam').addClass("hero-attack-2").show();
          game.timeoutId = setTimeout (function () {
            $('#solarbeam').removeClass("hero-attack-2").hide();
          }, 1800);
          
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        
        game.timeoutId = setTimeout (function () {
          game.monsterHurt()}, 900);
      };
  },

  heroHurt: function (){
    if(game.chosenHero === 'fire') {
      game.fireHurt.addClass("hero-hurt").show();
      game.heroFire.hide();
      game.timeoutId = setTimeout (function () {
        game.fireHurt.removeClass("hero-hurt").hide();
      }, 1000); 
      game.timeoutId = setTimeout (function () {
        game.heroFire.show()}, 1000); 
      $('#takehit-audio')[0].play();
    } else if (game.chosenHero === 'water') {
      game.waterHurt.addClass("hero-hurt").show();
      game.heroWater.hide();
      game.timeoutId = setTimeout (function () {
        game.waterHurt.removeClass("hero-hurt").hide();
      }, 1000); 
      game.timeoutId = setTimeout (function () {
        game.heroWater.show()}, 1000); 
      $('#takehit-audio')[0].play();
    } else {
      game.leafHurt.addClass("hero-hurt").show();
      game.heroLeaf.hide();
      game.timeoutId = setTimeout (function () {
        game.leafHurt.removeClass("hero-hurt").hide();
      }, 1000); 
      game.timeoutId = setTimeout (function () {
        game.heroLeaf.show()}, 1000); 
      $('#takehit-audio')[0].play();
    };
  },
            
  monsterHurt: function () {
    game.monster.hide();
    $('#monster-shaking').addClass("monster-hurt").show();
    game.timeoutId = setTimeout (function () {
      $('#monster-shaking').removeClass("monster-hurt").hide();
    }, 800); 
    game.timeoutId = setTimeout (function () {
      game.monster.show()}, 800); 
    $('#takehit-audio')[0].play();
  },

  monsterAttack: function (){
    //monster launch attack
    $('#shadowball-audio')[0].play();
    $('#shadowball').addClass("monster-attack").show();
    game.timeoutId = setTimeout (function () {
      $('#shadowball').removeClass("monster-attack").hide();
    }, 1000);
    // Hero shaking due to damage
    game.timeoutId = setTimeout (function () {
      game.heroHurt()}, 1100);
    // update hero HP bar to 0
    game.timeoutId = setTimeout (function () {
      game.hpHero.css('width','0%')}, 1200);
  },

  // ------ Timer Set Up -------
  toggleBtn: function () {
    game.isRunning = !game.isRunning;
  },
  updateClockDisplay: function() {
    let newMins = Math.floor(game.timeRemaining / 60);
    let newSeconds = game.timeRemaining % 60;
    let newMinsFormat = ('0'+ newMins).slice(-2);
    let newSecondsFormat = ('0' + newSeconds).slice(-2);
    game.minutes.html(newMinsFormat);
    game.seconds.html(newSecondsFormat);
  },

  // these lines of code plays a role of count down time and reset the whole game when time is out.
  countdownLoop: function() {
    if (game.isRunning) {
        if (game.timeRemaining >0) {
            game.timeRemaining --;
            game.updateClockDisplay();
            // clearTimeout(timeoutId);
            game.timeoutId = setTimeout(game.countdownLoop,game.loopDuration * 1000);
            console.log(game.timeREmaining);
        } else if (game.timeRemaining <= 0) {
            // clearTimeout(game.timeoutId);
            window.setTimeout(game.resetTimer,3000);
        }
    };
  },  
    // start the timer loop and pause it.
  startTimer: function() {
    if (!game.isRunning) {
        game.toggleBtn();
        game.timeoutId = setTimeout(game.countdownLoop, game.loopDuration);
    } else if (game.isRunning) {
        game.toggleBtn();
        clearTimeout(game.timeoutId); // this line of code helps to clear the time loop when we pause.
    };
  },

  resetTimer: function() {
      // initialize the clock back to total time (90s)
      game.timeRemaining = game.totalTime;
      // set the clock back to 90s and the progress bar to full width
      game.updateClockDisplay();
      
  },
  
  startGame: function () {
    if ( $('#inputname').val().length > 0 && $('[name="difficulty"]:checked').val() && $('[name="hero"]:checked').val()) {
      $('.btn-start').prop('disabled', false);
    } else {
      $('.btn-start').prop('disabled', true);
    }

    $('.btn-start').on('click', function () {
      game.switchScreen('game-scr');
      game.setupGameScreen();
      game.chosenHero = $('[name="hero"]:checked').val();
      game.currentMode = $('[name="difficulty"]:checked').val();
      game.playerName = $('#inputname').val();
    });
  },

    // --- Initialize the game when DOM is loaded
    setupGameScreen: () => {
    // fetch the (bacon) target
    game.fetchTheBacon();
    $(window).on("keyup", game.handleKeyup);

    // Call function to show the chosen Hero at the Battle screen when game is started
    game.showHeroAtFirst();
    game.displayMode();
    game.displayPlayerName();
    game.displayRound();
  },

    init: () => {
      // Select to start the game
      game.startGame();
      $('#inputname, [name="difficulty"], [name="hero"]').on('change', game.startGame);
       // stlying mode buttons
      $('[name="difficulty"]').on('change', function() {
      game.selectedOption = $(this).val();
      console.log("Selected difficulty: " + game.selectedOption);
    
      $('[name="difficulty"]').each(function() {
        if ($(this).val() === 'hard') {
          $(this).next('label').css('background-color', game.selectedOption === 'hard' ? 'red' : '');
        } else if ($(this).val() === 'normal') {
          $(this).next('label').css('background-color', game.selectedOption === 'normal' ? 'orange' : '');
        } else {
          $(this).next('label').css('background-color', '');
        }
      });
    });
    },

  text50: [
    "Armed with a gleaming sword and unwavering resolve, the hero ventured into the treacherous unknown. Perilous mountains and haunted forests stood in their path, but they pressed on, fueled by courage and the call of destiny. They faced fearsome beasts and conquered daunting trials, emerging as a legend whose tale would endure.",
    "In a world yearning for salvation, a hero emerged from the shadows, driven by a burning desire to protect the innocent. With lightning-fast reflexes and a heart ablaze with righteousness, they battled dark forces that threatened to engulf the realm. Their valiant deeds etched their name in history, inspiring generations to come."
  ],

  text70: [
    "Amidst a realm gripped by darkness, a hero emerged, driven by an unyielding sense of justice. Their path was fraught with peril as they journeyed through treacherous lands and faced malevolent creatures. With a sword of gleaming steel and a heart ablaze with determination, they vanquished evil, rekindling hope in the hearts of the oppressed. Legends would sing of their valor, forever immortalizing their name in the annals of heroism.",
    "From humble beginnings, a hero's destiny unfolded. They embarked on a quest, guided by ancient prophecies and the whispered tales of sages. Across vast landscapes, they encountered allies and foes alike, honing their skills and forging an indomitable spirit. Through trials and tribulations, they rose as a beacon of hope, inspiring others to embrace their own heroic journey, forever changing the course of their world."
  ],
  text100: [
    "In a realm where dreams took flight, a land brimming with enchantment, a wondrous fairy tale unfolded. Whimsical creatures danced beneath moonlit skies, their laughter echoing through ancient woods. Pixies adorned petals with sparkling dewdrops, casting a spell of ethereal beauty. Majestic castles stood tall, guarded by noble knights with hearts pure as the morning sun. Princesses, with flowing gowns and kind hearts, awaited their destined heroes. Legends spoke of magical mirrors and everlasting love. Amidst mystical realms, wishes whispered on gentle breezes, secrets hidden in mythical forests. Within this realm, where imagination reigned, fairy tales were woven, bringing joy and wonder to all who believed.",
    "In a world painted with magic hues, a tapestry of enchanting tales unfurled. Forests whispered secrets to the wind, while mystical creatures frolicked in dappled glades. Beneath a moonlit sky, fairies weaved spells of wonder, their delicate wings shimmering with ethereal light. Brave adventurers embarked on quests, guided by the wisdom of ancient sorcerers and the melodies of enchanted flutes. Princes battled wicked sorceresses, their love a beacon of hope in the darkness. Castles guarded cherished treasures, while unicorns pranced through emerald meadows. Within this realm, where dreams danced and wishes came true, fairy tales cast their spell, painting the world with pure enchantment."
  ],
  text120: [
    "Once upon a time, in a world drenched in enchantment and wonder, fairy tales wove their timeless narratives. Towering castles loomed over emerald landscapes, their turrets reaching towards the heavens. Noble knights mounted their gallant steeds, embarking on daring quests to vanquish evil and rescue damsels in distress. Benevolent fairies sprinkled shimmering pixie dust, granting wishes and spreading joy. Mythical creatures roamed enchanted forests, where talking animals imparted wisdom to those who would listen. Dragons breathed flames, their scales glistening like jewels in the sunlight. Wicked witches weaved spells of malevolence, their cackles echoing through the night. And amidst this tapestry of magic, brave heroes and heroines confronted their fears, found love, and discovered their destinies, reminding us all that within the realms of imagination, dreams become reality.",
    "In a realm where fantasy and reality intertwined, fairy tales unfurled their mesmerizing tales. Beneath starlit skies, resplendent castles stood as symbols of grandeur and aspiration. Heroes and heroines embarked on epic odysseys, wielding swords of destiny against formidable adversaries. Gentle fairies flitted on gossamer wings, granting blessings of love and happiness. Lush forests teemed with mystical creatures, their eyes gleaming with ancient wisdom. Dragons soared through clouds, breathing fire that illuminated the heavens. Enchanting spells cast by wise sorcerers illuminated hidden truths and tested the limits of courage. And in this realm, dreams blossomed into extraordinary adventures, reminding us that within each of us lies the power to believe in magic, embrace our destinies, and create our own happily ever after."
  ],
  text150: [
    "In a realm where the extraordinary merged with the ordinary, a tapestry of enchantment unfurled. Magic crackled in the air, swirling in vibrant hues, as wizards and sorceresses cast spells that defied the laws of nature. Luminous fairies flitted among ancient forests, their delicate wings leaving trails of iridescent dust. Majestic creatures—unicorns with silver manes, phoenixes ablaze with resplendent plumage—graced the landscape, their presence a testament to the realm's ethereal beauty. Hidden within the heart of the land stood enchanted citadels, their spires reaching towards the heavens. Whispers of forgotten incantations echoed through the corridors of time, while mystical artifacts held immeasurable power. It was a world where dreams took flight, where imagination kindled the spark of possibility. In this realm of wonder, both dazzling and elusive, each moment was infused with the potential for magical transformation—a realm where the veil between the mystical and the tangible was forever thin.",
    "Step into a world where the veil of reality is gently lifted, revealing a realm of captivating magic. Cascading waterfalls glimmer with golden essence, their droplets imbued with extraordinary properties. Energetic sprites dart among sunlit meadows, their playful laughter filling the air. Ancient trees, their branches laden with ancient wisdom, whisper secrets only the attentive can decipher. Ethereal beings, shimmering with light, traverse the skies, leaving trails of stardust in their wake. Enchanted crystals pulse with raw power, harnessed by skilled sorcerers for noble pursuits. Each step reveals hidden doorways to enchanted realms, where time bends and dreams take tangible form. It is a world of limitless possibility, where the ordinary is infused with the extraordinary, and where the boundary between reality and imagination dissolves into a symphony of wonder. In this magical world, the wonders of the cosmos are but a touch away, and the essence of magic dances in harmony with the pulse of life itself."
  ],
};

$(game.init);
