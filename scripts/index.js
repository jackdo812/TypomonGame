"use strict";

const game = {
  playerName: '',
  isRunning: false,
  wasRunning: false,
  isAudioPlaying: true,
  gameResult: null,
  quitBeforePlay: null,
  targetWords: [],
  targetText: [],
  userText: [],
  totalWords: null,
  numberCorrectWords: 0,
  numberIncorrectWords: 0,
  percentageIncorrectWords: 0,
  incorrectWordsBreakPoint: 25,
  completedWordsCount:0,
  percentageCompletion: 0,
  timeoutId: null,
  timeoutId1: null,
  timeoutId2: null,
  timeoutId3: null,
  timeoutId4: null,
  timeoutId5: null,
  runFirstAnimation: false,
  runFinalAnimation: false,
  chosenHero: '',
  heroFire: $('#fire-standing'),
  heroWater: $('#water-standing'),
  heroLeaf: $('#leaf-standing'),
  fireHurt: $('#fire-shaking'),
  waterHurt: $('#water-shaking'),
  leafHurt: $('#leaf-shaking'),
  fireWin: $('.fire-win'),
  waterWin: $('.water-win'),
  leafWin: $('.leaf-win'),
  fireLose: $('.fire-lose'),
  waterLose: $('.water-lose'),
  leafLose: $('.leaf-lose'),
  unavailableSign: $('#unvailable-icon'),
  drawSign: $('#draw-icon'),
  monster: $('#monster-standing'),
  hpHero: $('.hero-hp'),
  hpMonster: $('.monster-hp'),
  monsterGaugeBar: $('.gauge-bar'),
  heroGaugeBar: $('.hero-gauge-bar'),
  resultMessages: $('#result-message'),
  controlAudio: $('#control-audio'),
  percentageToLaunchFirstAttack: 45,
  percentageToLaunchFinalAttack: 100,
  loopDuration: 1,
  selectedOption: null,
  currentMode: 'easy', 
  currentRound: '1', 
  currentScreen: 'splash-scr',
  numberOfParagraph: 10,
  totalTime: 0,
  timeRemaining: 0,
  minutes: $('#mins'),
  seconds: $('#secs'),
  wordsPerMins: null,
  switchScreen: function(newScreen) {
    $('.screen').hide();
    $(`#${newScreen}`).fadeIn(350);
    this.currentScreen = newScreen;
    this.isRunning = false;
    this.wasRunning = false;
    game.controlAudioEachScreen();
    
    if(this.currentScreen === 'game-scr') {
      $('.btn-ready').show();
      game.resetGameScreen();
      game.resetTimer();
      game.resetHandleKeyup();
      game.resetEndGameScreen();
      game.quitBeforePlay = null;
    } else if (this.currentScreen === 'splash-scr') {
      game.resetSplashScreen();
      game.resetEndGameScreen();
      game.quitBeforePlay = null;
      game.resetGameScreen();
      game.resetTimer();
      game.currentRound = '1';
    } else if (this.currentScreen === 'end-game-scr') {
      game.checkWordsPerMins();
      game.showIncorrectWords();
      game.showGameResult();
    };

  },

  toggleIsRunning: function () {
    console.log('toggle isRunning successfully');
    game.isRunning = !game.isRunning;
  },

  toggleWasRunning: function () {
    console.log('toggle wasRunning successfully');
    game.wasRunning = !game.wasRunning;
  },

  toggleAudioOption: function () {
    game.isAudioPlaying = !game.isAudioPlaying;
  },

  fetchTheBacon: () => {
    let paragraph = '';
    // Set the conditions to generate the PARAGRAPH & TIMER based on the mode and round
    if (game.currentMode === 'easy' && game.currentRound === '1') {
      paragraph = game.text50[Math.floor(Math.random() * game.numberOfParagraph)];
      game.totalTime = 180;
      game.timeRemaining = 180;
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
      $("#target").append('<img id="end-typing-sign" src="images/dual-sword.png" alt="">');  
      $("#target").append("</p>");
      // these 2 lines of codes are for highlighting the first letter when the paragraph was generated
      $("#target span:eq(0)").addClass("cursorPosition");
      $("#target span:eq(0)").addClass("cursorPosition-bkg");
    };
    $(window).off("keyup"); //unbind the keyup event to prevent multiple bindings
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

  // the Monster gauge play a role of incorrectWords limit indicators
  updateMonsterGauge: function () {
    let gaugeUnit = game.numberIncorrectWords/game.totalWords * 100;
    let percentageGaugeUnit = gaugeUnit/ game.incorrectWordsBreakPoint * 100;
    game.monsterGaugeBar.css('width',percentageGaugeUnit+'%');
    if (percentageGaugeUnit >= 80) {
      game.monsterGaugeBar.addClass("blinking-gauge");
    } else if (percentageGaugeUnit <80) {
      game.monsterGaugeBar.removeClass("blinking-gauge");
    };
  },

  updateHeroGauge: function (){
    game.heroGaugeBar.css('width', game.percentageCompletion+"%");
    if (game.percentageCompletion >= 35 && game.percentageCompletion <45) {
      game.heroGaugeBar.addClass("blinking-hero-gauge1");
    } else if (game.percentageCompletion >= 45 && game.percentageCompletion <80) {
      game.heroGaugeBar.css('background-color','#f2900f');
      game.heroGaugeBar.removeClass("blinking-hero-gauge1");
    } else if (game.percentageCompletion >= 80) {
      game.heroGaugeBar.addClass("blinking-hero-gauge2");
    };
  },

  handleKeyup: function (event) {
    if (game.isRunning) {
      // console.log("key up", event, event.key);
      // these lines of codes help to add cursor position with styles and remove these styles when the letters were typed.
      const cursorPosition = game.userText.length +1;
      const pastCursorPosition = game.userText.length;
  
      if (/^[a-z ,.'-]$/i.test(event.key)) {
      $("#target > span").eq(cursorPosition).addClass("cursorPosition");
      $("#target > span").eq(cursorPosition).addClass("cursorPosition-bkg");
      $("#target > span").eq(pastCursorPosition).removeClass("cursorPosition");
      $("#target > span").eq(pastCursorPosition).removeClass("cursorPosition-bkg");
      } else {
        return;
      };
  
      // Checking key valid or invalid then call functions
      const regex = /^[a-z ,.'-]$/i;
      if (regex.test(event.key)) {
        // console.log("valid key");
        game.checkLetterMatch(event.key);
        game.checkWordCompletion(event.key);
      } else {
        // console.log("invalid key");
      };
    } return; 
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
      // Check if the last word is fully typed
    if (
      currentWord.trim() !== "" &&
      game.userText.length === game.targetText.length
    ) {
      completedWordsCount++;
      const lastCorrectWord = game.targetWords[game.targetWords.length - 1];
      if (currentWord === lastCorrectWord || currentWord === lastCorrectWord + ".") {
        numberCorrectWords++;
      }
    }
    
    
  
    game.numberCorrectWords = numberCorrectWords;
    game.numberIncorrectWords = completedWordsCount - game.numberCorrectWords;
    game.completedWordsCount = completedWordsCount;
    game.percentageCompletion = Math.floor(game.completedWordsCount/game.totalWords * 100);
    // call function updateMonsterGauge to update the gauge bar
    game.updateMonsterGauge();

    // call function updateHeroGauge to update the gauge bar
    game.updateHeroGauge();

    // call loseGame function if the condition meet (incorrect word> breakpoint)
    if (((game.numberIncorrectWords)/game.totalWords * 100)> game.incorrectWordsBreakPoint){
      game.loseGame();
    };

    if (game.percentageCompletion === game.percentageToLaunchFinalAttack && game.runFinalAnimation === false) {
      game.heroFinalAttackAnimation();
      //update monster HP bar after the attack
      
      game.timeoutId5 = setTimeout (function () {
        game.hpMonster.css('width','0%')}, 1200);
      

        
    } else if (game.percentageCompletion >=game.percentageToLaunchFirstAttack && game.runFirstAnimation === false) {
      game.heroFirstAttackAnimation();
      //update monster HP bar after the attack
      game.timeoutId = setTimeout (function () {
        game.hpMonster.css('width','60%')}, 1200);
    } else if (!game.runFirstAnimation && !game.runSecondAnimation) {
      $('#fireball').removeClass("fireball-animation").hide();
      $('#watergun').removeClass("hero-attack-1").hide();
      $('#razorleaf').removeClass("hero-attack-1").hide();
    };

    if (game.percentageCompletion === 100) {
      game.winGame();
    } return;
  },

  checkWordsPerMins: function () {
    let timeCompletion = (game.totalTime - game.timeRemaining) / 60; // how long (in minute) user complete his/her typing part
    game.wordsPerMins = Math.round(game.numberCorrectWords / timeCompletion);
    console.log(game.wordsPerMins);
    $('.wpm').text(game.wordsPerMins);
  },

  showIncorrectWords: function () {
    game.percentageIncorrectWords = Math.round(game.numberIncorrectWords/game.completedWordsCount *100);
    if (game.numberIncorrectWords !== 0) {
      $('.percentage-incorrect-word').text(game.percentageIncorrectWords);
    } else {
      $('.percentage-incorrect-word').text('0');
    }
  },

  resetHandleKeyup: function() {
    game.userText = []; // Reset the user input array
    const firstChar = $("#target > span:eq(0)");
    firstChar.addClass("cursorPosition");
    firstChar.addClass("cursorPosition-bkg");
    $("#target > span").not(":eq(0)").removeClass("cursorPosition");
    $("#target > span").not(":eq(0)").removeClass("cursorPosition-bkg");
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
  // ------ Battle Animation Functions ------
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
      $('#fireball').addClass("fireball-animation").show().one("animationend", function () {
        $('#fireball').removeClass("fireball-animation").hide();
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
        game.monsterHurt()}, 900);
      
    };
  },

  heroFinalAttackAnimation: function () {
    if (game.chosenHero === 'fire') {
      // Hide hero standing and show spelling animation
      game.heroFire.hide();
      $('#fire-spelling').addClass("spelling").show();
      $('#fire-ball-audio')[0].play();
      game.timeoutId1 = setTimeout (function () {
        $('#fire-spelling').removeClass("spelling").hide()}, 1000);
      game.timeoutId2 = setTimeout (function () {
        game.heroFire.fadeIn()}, 1000);
      // Inferno animation
      $('#inferno').addClass("hero-attack-2").show();
      game.timeoutId3 = setTimeout (function () {
        $('#inferno').removeClass("hero-attack-2").hide()
      }, 1000);
      game.runFinalAnimation = true; 
      // Monster Takes Damage animation 
      game.timeoutId4 = setTimeout (function () {
        game.monsterHurt()}, 900
      );
      } else if (game.chosenHero === 'water') {
        // Hide hero standing and show spelling animation
        game.heroWater.hide();
        $('#water-spelling').addClass("spelling").show();
        game.timeoutId = setTimeout(function () {
          $('#waves-audio')[0].play()}, 500);
        game.timeoutId1 = setTimeout (function () {
           $('#water-spelling').removeClass("spelling").hide()}, 1000);
        game.timeoutId2 = setTimeout (function () {
        game.heroWater.fadeIn()}, 1000);
        // Wave animation
        game.timeoutId3 = setTimeout (function () {
          $('#wave').addClass("wave-animation").show().one("animationend", function () {
            $('#wave').removeClass("wave-animation").hide();
            game.runFinalAnimation = true;
          });}, 500);
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        game.timeoutId4 = setTimeout (function () {
          game.monsterHurt()}, 900);
      } else if (game.chosenHero === 'leaf') {
        // Hide hero standing and show spelling animation
        game.heroLeaf.hide();
        $('#leaf-spelling').addClass("spelling").show();
        $('#solar-beam-audio')[0].play();
        game.timeoutId1 = setTimeout (function () {
          $('#leaf-spelling').removeClass("spelling").hide()}, 1000);
        game.timeoutId2 = setTimeout (function () {
          game.heroLeaf.fadeIn()}, 1000);
        // Solar beam animation
          $('#solarbeam').addClass("hero-attack-2").show();
          game.timeoutId3 = setTimeout (function () {
            $('#solarbeam').removeClass("hero-attack-2").hide();
          }, 1800);
          
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        game.timeoutId4 = setTimeout (function () {
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

  // ------ Audio On/Off ------

  audioOn: function () {
    game.controlAudio.html('ON <img class="audio-icon" src="images/unmute-audio.png" alt="unmuted audio icon">');
    game.controlAudio.addClass("btn-light");
    game.controlAudio.removeClass("btn-secondary");
    $('.background-audio').prop('muted',true);
    
  },

  audioOff: function () {
    game.controlAudio.html('OFF <img class="audio-icon" src="images/muted-audio.png" alt="muted audio icon">');
    game.controlAudio.removeClass("btn-light");
    game.controlAudio.addClass("btn-secondary");
    $('.background-audio').prop('muted',true);
  },

  controlAudioEachScreen: function () {
    if (game.isAudioPlaying) {

      $('.background-audio').prop('muted',true);
      if(game.currentScreen === 'splash-scr') {
        $('#opening-game-audio').prop('muted',false);   
      } else if (game.currentScreen === 'game-scr') {
        $('#battle-audio').prop('muted',true);
      } else if (game.currentScreen === 'end-game-scr') {
          if (game.gameResult === 'won') {
            $('#win-audio').prop('muted',false);
          } else if (game.gameResult === 'lost' || game.gameResult === 'unavailable' || game.gameResult === 'draw' ) {
            $('#lose-audio').prop('muted',false);
          };
      };
    } else {
      return;
    }
  },

  // ------ Timer Set Up -------
  
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
            if (game.percentageCompletion < 100) {
              game.loseGame();
            };
        }
    };
  },  
  // start the timer loop and pause it.
  startTimer: function() {
    if (game.isRunning) {
        game.timeoutId = setTimeout(game.countdownLoop, game.loopDuration);
    } else if (!game.isRunning) {
        clearTimeout(game.timeoutId); // this line of code helps to clear the time loop when we pause.
    };
  },

  resetTimer: function() {
      // initialize the clock back to total time (90s)
      game.timeRemaining = 0;
      game.totalTime = 0;
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
      game.chosenHero = $('[name="hero"]:checked').val();
      game.currentMode = $('[name="difficulty"]:checked').val();
      game.playerName = $('#inputname').val();
    });
  },

  readyToType: function () {
    game.setupGameScreen();
    game.toggleIsRunning();
    game.startTimer();
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
    game.monster.show();
    $('.hero-gauge').show();
    $('.gauge').show();
    $('.hp-bar').show();
    $('.hp-progress-bar').css('width','100%');
  },

  resetSplashScreen: function (){
    $('#inputname').val('');
    $('[name="hero"]').prop('checked', false);
    $('[name="difficulty"]').prop('checked', false);

    // Remove background colors for all difficulty labels
    $('[name="difficulty"]').next('label').css('background-color', '');
  },

  resetGameScreen: function () {
    $('.hero-standing').hide();
    $('.monster-standing').hide();
    $('.hp-bar').hide();
    $('#target').html("");
    $('.player-name-display').text("");
    $('.mode-display').text("");
    $('.round-display').text("");
    $('.gauge').hide();
    $('.hero-gauge').hide();
    game.monsterGaugeBar.css('width', '0%');
    game.heroGaugeBar.css('width', '0%');
    game.numberCorrectWords = 0;
    game.numberIncorrectWords = 0;
    game.completedWordsCount =0;
    game.percentageCompletion = 0;
    game.targetText = [];
    game.runFirstAnimation = false;
    game.runFinalAnimation = false;
  },

  pauseGameScreen: function () {
    console.log('pause game successfully');
    $('.hero-standing').hide();
    $('.monster-standing').hide();
    $('.hp-bar').hide();
    $('#target').hide();  
    $('.hero-gauge').hide();
    $('.gauge').hide();
    this.toggleIsRunning();
  },

  resumeGameScreen: function () {
    console.log('resume game successfully');
    game.showHeroAtFirst();
    $('.monster-standing').show();
    $('.hp-bar').show();
    $('.hero-gauge').show();
    $('.gauge').show();
    $('#target').show();
    this.toggleIsRunning();
    //delay 1s when resume to avoid the bug (skip 1s)
    clearTimeout(game.timeoutId);
    game.timeoutId = setTimeout(function() {
     game.startTimer()}, 1000); 
  },

  resetEndGameScreen: function (){
    this.gameResult = null;
    game.wordsPerMins = null;
    $('.hero-win').hide();
    $('.hero-lose').hide();
    game.unavailableSign.hide();
    game.drawSign.hide();
  },

  loseGame: function (){
    $(window).off("keyup"); // preventing user from continuing typing which might lead to other errors
    clearTimeout(game.timeoutId);
    game.gameResult = 'lost';
    game.monsterAttack();
    if (game.percentageCompletion === 100) {
      game.gameResult = 'draw';
    };
    game.timeoutId = setTimeout(function() {
     game.switchScreen('end-game-scr');}, 2000);
  },

  showGameResult: function (){
    const result = game.gameResult;
    switch (result) {
      case 'unavailable':
        game.resultMessages.html('<span>Unavailable</span><br> Go back and play...');
        game.unavailableSign.show();
        $('#summary-box').hide();
        $('.btn-next-round').hide();
      break;
      case 'draw':
        game.resultMessages.html('<span>Draw</span><br>  I will forever remember your sacrifice...');
        game.drawSign.show(); 
        $('#summary-box').show();
        $('.btn-next-round').hide();
      break;
      case 'lost':
        game.resultMessages.html('<span>You Lose!</span><br>  So sorry...');
        $('#summary-box').show();
        $('.btn-next-round').hide();
        if(game.chosenHero === 'fire') {
          game.fireLose.show();
        } else if (game.chosenHero === 'water') {
          game.waterLose.show();
        } else if (game.chosenHero === 'leaf') {
          game.leafLose.show();
        };
      break;
      case 'won':
        game.resultMessages.html('<span>You Win!</span><br> Congratulations...');
        $('#summary-box').show();
        if(game.currentRound === '3') { // this condition prevents to show the Next Round button as round 3 is the maximum number of round in one mode.
          $('.btn-next-round').hide();
        } else {
          $('.btn-next-round').show();
        }
        if(game.chosenHero === 'fire') {
          game.fireWin.show();
        } else if (game.chosenHero === 'water') {
          game.waterWin.show();
        } else if (game.chosenHero === 'leaf') {
          game.leafWin.show();
        };  
      break;
      default:
        game.resultMessages.html('<span>Loading...</span> So sorry...the system gets errors to show the summary');
    }
  },

  winGame: function () {
    if (game.timeRemaining >= 0 &&
      ((game.numberIncorrectWords / game.totalWords * 100) <= game.incorrectWordsBreakPoint)
    ) {
      console.log('Done checking conditions');
      game.gameResult = 'won';
      console.log('Set gameResult to WON')
      clearTimeout(this.timeoutId);
      game.timeoutId = setTimeout(function() {
        game.switchScreen('end-game-scr');
      }, 2000);
    } 
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

    // Quit button on Game Screen
    $('.btn-end-game').on('click', function() {
      if (!game.isRunning) {
        game.quitBeforePlay = true; 
      } else {
        game.quitBeforePlay = false; 
      }

      // game.switchScreen('end-game-scr');
      
      if (game.quitBeforePlay) {
        game.gameResult = 'unavailable';
        
      } else {
        game.gameResult = 'lost';
        
      }; 
      game.switchScreen('end-game-scr');
    });

    // Back to 'Menu' button on End-game Screen
    $('.btn-quit-1').on('click', function() {
      game.switchScreen('splash-scr');
    });

    // 'PlayAgain' button on End-game Screen - go back to gamescreen to play at the same mode and round.

    $('.btn-play-again').on('click', function(){
      game.switchScreen('game-scr');
    });

    // 'NextRound' button on End-game Screen - go back to gamescreen to play at the same mode BUT +1 round (next round).

    $('.btn-next-round').on('click', function() {
      game.switchScreen('game-scr');
      const round = game.currentRound;
      switch (round) {
        case '1':
          game.currentRound = '2';
          break;
        case '2':
          game.currentRound = '3';
          break;
          default:
            alert('Sorry...there is an error! Please go back to the Menu or try to refresh the page.');
      };
    });

    // Ready to Type button on Game Screen
    $('.btn-ready').on('click', function () {
      game.readyToType();
      $('.btn-ready').hide();
      if(game.isAudioPlaying) {
        $('#battle-audio').prop('muted',false);
      } else {
        return;
      };
      
    })

    // Help button on Game Screen
    $(document).on('show.bs.modal', '#modal-game', function() {
      if(game.isRunning && !game.wasRunning) {
        game.pauseGameScreen();
        game.toggleWasRunning();
        if (game.currentScreen === 'game-scr') {
          $('#battle-audio')[0].pause();
        }
      } else if (!game.isRunning && !game.wasRunning)  {
        return;
      }
      
    });

    $(document).on('hidden.bs.modal', '#modal-game', function() {
      if(!game.isRunning && game.wasRunning) {
        game.resumeGameScreen();
        game.toggleWasRunning();
        if (game.currentScreen === 'game-scr') {
          $('#battle-audio')[0].play();
        }
      } else if (!game.isRunning && !game.wasRunning) {
        return;
      }
      
    });


    game.controlAudio.on('click', function() {
      if(game.isAudioPlaying) {
        game.audioOff();
        game.toggleAudioOption();
      } else if (!game.isAudioPlaying) {
        game.audioOn();
        game.toggleAudioOption();
        game.controlAudioEachScreen();
      };
    });
  },

  
    

  // Prepared paragraphs for data fetching
  text50: [
    "Armed' with a gleaming sword and unwavering resolve, the hero ventured into the treacherous unknown. Perilous mountains and haunted forests stood in their path, but they pressed on, fueled by courage and the call of destiny. They faced fearsome beasts and conquered daunting trials, emerging as a legend whose tale would endure.",
    "In a world yearning for salvation, a hero emerged from the shadows, driven by a burning desire to protect the innocent. With lightning-fast reflexes and a heart ablaze with righteousness, they battled dark forces that threatened to engulf the realm. Their valiant deeds etched their name in history, inspiring generations to come.",
    "In a magical world, a young hero ventures forth with unwavering courage. They encounter mythical creatures, ancient wizards, and enchanted forests, discovering their latent powers along the way. Guided by fairies and steadfast companions, they conquer formidable challenges, ultimately restoring harmony and ushering in an era of lasting peace.",
    "In the enchanting realms, a hero rises to the daunting task of saving a cursed kingdom. Armed with a powerful artifact bestowed upon them by a wise sorcerer, they embark on a treacherous journey through mystical landscapes. Facing peril and overcoming adversity, they triumph over evil, bringing radiant light to a once-darkened world.",
    "In a world woven with legends, a hero embarks on a breathtaking adventure, traversing spellbinding realms teeming with mythical creatures, hidden kingdoms, and untold treasures. Armed with a gleaming sword and an indomitable spirit, they courageously battle formidable adversaries, unraveling age-old curses, and proving that the extraordinary lies within their grasp.",
    "Amidst the captivating landscapes of a fairy tale realm, a hero's journey unfolds. Through enchanted forests, shimmering lakes, and majestic castles, they embark on a perilous quest to retrieve stolen artifacts. Along their arduous path, they confront misaligned magic, pass tests of courage, and ultimately restore equilibrium, unveiling the true essence of heroism and the enchantment that resides within.",
    "Within the tapestry of a magical realm, a humble hero embraces their extraordinary destiny. Propelled by a celestial prophecy, they traverse ethereal lands and mystical realms, encountering awe-inspiring mythical creatures and forging indelible bonds with legendary beings. Through acts of bravery, they unravel ancient spells, bringing restoration and hope to a world fueled by dreams and wonder.",
    "Journey to Arcanum, a realm of grand kingdoms and mysterious forests, where celestial beings find their home in the ethereal city of Celestia. Here, powerful sorcerers channel the elemental forces, and ancient prophecies intertwine with extraordinary tales, beckoning heroes to embark on epic adventures that will shape the fate of the realm.",
    "Welcome to Lumina, a realm teeming with shape-shifting creatures and bustling cities. Mystical energy pulses through the air, guiding brave adventurers on quests of destiny amidst ancient ruins, enchanting forests, and shimmering constellations. Explore, unravel secrets, and discover your true purpose in this captivating realm of wonder.",
    "Ethereal Haven's fantasy realm brims with vibrant landscapes, where majestic dragons soar amidst the azure sky and heroes wield starlight-forged swords against encroaching darkness. Enchantment and wonder saturate the air as mischievous fairies frolic amidst the enchanting, magic-woven tapestry, bringing life to this spellbound and mystical domain."
  ],

  text70: [
    "Amidst a realm gripped by darkness, a hero emerged, driven by an unyielding sense of justice. Their path was fraught with peril as they journeyed through treacherous lands and faced malevolent creatures. With a sword of gleaming steel and a heart ablaze with determination, they vanquished evil, rekindling hope in the hearts of the oppressed. Legends would sing of their valor, forever immortalizing their name in the annals of heroism.",
    "From humble beginnings, a hero's destiny unfolded. They embarked on a quest, guided by ancient prophecies and the whispered tales of sages. Across vast landscapes, they encountered allies and foes alike, honing their skills and forging an indomitable spirit. Through trials and tribulations, they rose as a beacon of hope, inspiring others to embrace their own heroic journey, forever changing the course of their world.",
    "Step into a world of wonder, where a young hero's destiny intertwines with magic and courage. From the humblest of origins, they embark on a perilous quest to retrieve a stolen artifact from the clutches of a malevolent sorcerer. Guided by a whimsical fairy companion, they explore mystical realms, encounter awe-striking creatures, and unearth ancient spells, ultimately proving that the most ordinary among us can achieve the most extraordinary feats.",
    "In a land where fantasy and enchantment converge, a hero heeds the call of an extraordinary adventure. Equipped with a legendary sword and accompanied by steadfast allies, they traverse a mesmerizing magic world teeming with mythical creatures, ethereal landscapes, and enigmatic ruins. As they unravel the secrets of an ancient prophecy, they confront their ultimate test of character, forging their legacy as an everlasting beacon of hope and valor.",
    "Venture into a realm where dreams dance with reality, and the tale of a hero comes alive. Within this enchanting world, our hero battles against encroaching darkness, armed with the guidance of a wise old wizard and the wisdom of forgotten spells. As they traverse mystical forests and encounter captivating beings, their journey becomes a testament to compassion and selflessness, forever etching their name into the annals of legend.",
    "In the enchanting world of Fairy Tail, magic reigns supreme. Wizards and sorceresses wield elemental powers, dragons soar through the skies, and mythical creatures roam mystical forests. Through thrilling adventures and epic battles, heroes rise to protect their realm from dark forces. Friendship, courage, and the bonds of camaraderie prevail as they embark on quests, unravel mysteries, and overcome adversity. Fairy Tail is a place where imagination intertwines with wonder, painting a vibrant tapestry of fantastical tales.",
    "Step into a breathtaking fantasy world where imagination knows no bounds. In this realm, heroes and heroines embark on daring quests, armed with mighty swords and hearts filled with unwavering determination. They face treacherous landscapes, encounter mythical creatures, and challenge powerful adversaries. Through their courage and resilience, they forge a path of triumph and become legends that inspire generations. It is a realm where dreams become reality and where the hero's journey unfolds in glorious splendor.",
    "Embark on a thrilling hero adventure in a world where magic and wonder coexist. From mist-shrouded forests to towering citadels, the landscape teems with mythical creatures and ancient secrets. Heroes harness their unique powers, brandishing mighty swords and conjuring spells. They navigate treacherous paths, face trials of courage, and challenge dark forces threatening their realm. Their quest for justice and their unwavering determination make them the champions of this extraordinary realm.",
    "In a realm of fantasy and awe, heroes venture forth on daring adventures. Armed with their wits and trusty swords, they traverse mystical landscapes and encounter captivating creatures. Their journey takes them through ancient ruins and enchanted forests, where the line between reality and magic blurs. Guided by fate and driven by a noble cause, these heroes leave an indelible mark on their world, forever etching their names in the annals of heroism.",
    "In Sword World, warriors clad in gleaming armor wield mighty swords, defending their kingdom from encroaching darkness. Amid towering castles, lush landscapes, and ancient ruins, epic battles unfold against formidable foes. Their heroic adventures inspire generations with tales of bravery and sacrifice, as valor and honor hold the highest regard. In this realm, the clash of steel and the spirit of the hero resonate throughout."
  ],
  text100: [
    "In a realm where dreams took flight, a land brimming with enchantment, a wondrous fairy tale unfolded. Whimsical creatures danced beneath moonlit skies, their laughter echoing through ancient woods. Pixies adorned petals with sparkling dewdrops, casting a spell of ethereal beauty. Majestic castles stood tall, guarded by noble knights with hearts pure as the morning sun. Princesses, with flowing gowns and kind hearts, awaited their destined heroes. Legends spoke of magical mirrors and everlasting love. Amidst mystical realms, wishes whispered on gentle breezes, secrets hidden in mythical forests. Within this realm, where imagination reigned, fairy tales were woven, bringing joy and wonder to all who believed.",
    "In a world painted with magic hues, a tapestry of enchanting tales unfurled. Forests whispered secrets to the wind, while mystical creatures frolicked in dappled glades. Beneath a moonlit sky, fairies weaved spells of wonder, their delicate wings shimmering with ethereal light. Brave adventurers embarked on quests, guided by the wisdom of ancient sorcerers and the melodies of enchanted flutes. Princes battled wicked sorceresses, their love a beacon of hope in the darkness. Castles guarded cherished treasures, while unicorns pranced through emerald meadows. Within this realm, where dreams danced and wishes came true, fairy tales cast their spell, painting the world with pure enchantment.",
    "Embark on a thrilling hero adventure in a world where magic and wonder intertwine seamlessly. From mist-shrouded forests to towering citadels, the enchanting landscape teems with mythical creatures and whispers of ancient secrets. Heroes harness their unique powers, brandishing mighty swords and conjuring potent spells. They navigate treacherous paths filled with peril, facing daunting trials of courage, and boldly challenging the dark forces that threaten to engulf their realm. Driven by an unwavering quest for justice and fueled by their unyielding determination, these heroes become renowned champions in this extraordinary realm where the extraordinary becomes reality.",
    "In the realm of fantasy and awe, heroes venture forth on daring adventures, their destinies intertwined with the fabric of mythical landscapes. Armed with their sharp intellects and trusty swords, they traverse enchanted forests, cross treacherous terrains, and encounter captivating creatures. Their journey takes them through ancient ruins steeped in forgotten lore, where the line between reality and magic blurs into an ethereal haze. Guided by the whims of fate and propelled by a noble cause, these heroes etch their names in the annals of heroism, leaving an indelible mark on their world that inspires all who dare to dream.",
    "In the enchanting realm of Fairy Tail, where magic thrives and fantastical creatures roam freely, courageous wizards embark on thrilling quests through sprawling landscapes and hidden realms. Wielding extraordinary powers bestowed upon them by ancient forces, they fearlessly confront insidious ancient evils that threaten the very balance of their world. Along their extraordinary journey, they forge unbreakable bonds of friendship and loyalty, unlocking the depths of their inner strength and resilience. Through trials, tribulations, and triumphant victories, these valiant heroes rise above adversities, becoming legendary figures whose awe-inspiring tales of bravery and self-discovery resonate across generations in a boundless world brimming with limitless imagination and endless possibilities.",
    "Welcome to a fantastical world where dreams come alive. Here, brave heroes and heroines embark on extraordinary adventures armed with swords of valor and hearts aflame with unwavering determination. They navigate treacherous terrains, confronting formidable foes and unraveling the secrets of an ancient prophecy. Amidst a realm teeming with magic and wonder, their unwavering courage and indomitable spirit forge a path to greatness, leaving an enduring mark on the tapestry of heroism. Their tales resonate through time, inspiring generations to embrace their own extraordinary destinies and believe in the limitless power of their dreams.",
    "Enter the sprawling landscape of Sword World, where honor and bravery reign supreme. Clad in shimmering armor, valiant warriors brandish mighty swords, protecting their kingdom from the encroaching darkness. They face formidable foes, from fierce dragons to malevolent sorcerers, engaging in epic battles that shape the destiny of their realm. Their heroic exploits echo through the corridors of history, inspiring future generations to rise against adversity, fight for justice, and embrace the call of valor in a world where the resounding clash of steel reverberates with unwavering valor throughout the land and across the annals of time.",
    "Embark on a grand hero adventure in a world teeming with magic and marvels. Armed with swords forged in the crucible of destiny, heroes traverse ancient ruins, mystical forests, and treacherous mountains, immersing themselves in the wonders of the land. They confront powerful adversaries, harnessing the ancient artifacts bestowed upon them, unlocking the depths of their true potential and unleashing untold power. Guided by an unwavering spirit and driven by a noble cause, they become beacons of hope, inspiring the hearts of the people and shaping the destiny of their wondrous realm through their awe-inspiring exploits, selfless sacrifices, and indomitable determination that resonates throughout the annals of history.",
    "Welcome to the epic world of heroism and adventure, where destiny beckons and legends are born. Armed with their valorous swords, gleaming with ancient enchantments, heroes rise to confront insidious ancient evils that threaten to engulf their realms in darkness. They navigate treacherous landscapes, from enchanted forests teeming with mythical creatures to desolate wastelands where shadows loom large, overcoming trials that test their courage, resilience, and unwavering determination. Through their awe-inspiring triumphs and selfless sacrifices, they ignite a spark of hope within the hearts of the people, inspiring them to believe in the power of unity and to embrace the boundless possibilities that exist within their fantastical world.",
    "Embark on an extraordinary hero adventure in a realm brimming with mystery and peril. Heroes driven by an insatiable thirst for glory traverse treacherous lands and vast wildernesses. With swords of destiny gleaming in their hands, they face down monstrous beasts, vanquishing nefarious foes along their perilous journey. Their unwavering resolve is tested at every turn as they encounter allies and foes alike. Through daunting trials and unimaginable challenges, they discover hidden depths of strength, emerging as beacons of hope in a world shrouded in darkness. Their courageous exploits etch their names into the annals of legend, inspiring generations to follow their valiant footsteps in their own heroic quests."
  ],
  text120: [
    "Once upon a time, in a world drenched in enchantment and wonder, fairy tales wove their timeless narratives. Towering castles loomed over emerald landscapes, their turrets reaching towards the heavens. Noble knights mounted their gallant steeds, embarking on daring quests to vanquish evil and rescue damsels in distress. Benevolent fairies sprinkled shimmering pixie dust, granting wishes and spreading joy. Mythical creatures roamed enchanted forests, where talking animals imparted wisdom to those who would listen. Dragons breathed flames, their scales glistening like jewels in the sunlight. Wicked witches weaved spells of malevolence, their cackles echoing through the night. And amidst this tapestry of magic, brave heroes and heroines confronted their fears, found love, and discovered their destinies, reminding us all that within the realms of imagination, dreams become reality.",
    "In a realm where fantasy and reality intertwined, fairy tales unfurled their mesmerizing tales. Beneath starlit skies, resplendent castles stood as symbols of grandeur and aspiration. Heroes and heroines embarked on epic odysseys, wielding swords of destiny against formidable adversaries. Gentle fairies flitted on gossamer wings, granting blessings of love and happiness. Lush forests teemed with mystical creatures, their eyes gleaming with ancient wisdom. Dragons soared through clouds, breathing fire that illuminated the heavens. Enchanting spells cast by wise sorcerers illuminated hidden truths and tested the limits of courage. And in this realm, dreams blossomed into extraordinary adventures, reminding us that within each of us lies the power to believe in magic, embrace our destinies, and create our own happily ever after.",
    "Step into the enchanting realm of Fairy Tail, where magic weaves through every corner. Wizards with extraordinary abilities embark on thrilling quests, encountering mythical creatures and unraveling ancient mysteries that hold the key to their world's fate. With bonds forged in friendship and hearts filled with unwavering determination, they navigate treacherous landscapes, facing formidable challenges that test their resolve. Together, they triumph over darkness, casting spells of hope and shaping the destiny of a fantastical realm where dreams materialize and extraordinary adventures are etched into the very fabric of existence. In this realm, where imagination knows no bounds, the echoes of their heroic feats inspire generations to embrace the extraordinary within themselves, forever transforming the tapestry of their world.",
    "Embark on a thrilling hero adventure in a world where magic and wonder intertwine. From mist-shrouded forests to towering citadels, the landscape teems with mythical creatures and ancient secrets waiting to be discovered. Heroes harness their unique powers, brandishing mighty swords and conjuring spells, as they navigate treacherous paths, face trials of courage, and confront dark forces threatening their realm. Their quest for justice and unwavering determination make them champions in this extraordinary realm where destiny unfolds amidst the resounding clash of steel. As their heroic deeds echo through the annals of time, they inspire all who hear their tales to believe in the transformative power of bravery and the limitless possibilities that lie within each of us.",
    "Welcome to the wondrous world of enchantment and magic, where heroes rise to face incredible challenges. Armed with swords of valor and hearts ablaze with courage, they embark on epic adventures, venturing into uncharted realms and defying the limits of what is possible. From battling fearsome dragons to unlocking ancient secrets, they weave their destinies through realms of fantasy and wonder. Each step they take shapes the course of their hero's journey, inspiring all who hear their tales of triumph and sacrifice. In this realm, where the extraordinary becomes ordinary and imagination reigns supreme, heroes rise to become the embodiment of true heroism, reminding us that within each of us lies the potential to be extraordinary.",
    "Enter the realm of heroic legends, a world where ordinary individuals become extraordinary champions. Armed with swords of destiny, they stand against the forces of darkness, venturing through mystical landscapes and facing mythical creatures. Guided by courage and fueled by determination, they leave an indelible mark on their fantasy realm, forever celebrated as beacons of hope and inspiration. Through their heroic feats and unwavering spirit, they embody the true essence of heroism, inspiring generations to believe in their own potential to make a difference in the world. As their tales echo through time, the legacy of their bravery and resilience serves as a reminder that even the most ordinary among us can achieve extraordinary things.",
    "Enter the realm of Sword World, where valor and honor hold the highest regard. Warriors clad in gleaming armor wield mighty swords, defending their kingdom from encroaching darkness. Amid towering castles, lush landscapes, and ancient ruins, epic battles unfold against formidable foes, crafting tales of bravery, sacrifice, and indomitable spirit. These heroic adventures echo through time, inspiring generations with the enduring power of their legends. In this realm, where destiny intertwines with the clash of steel, where every swing of a sword shapes the course of history, heroes emerge to challenge the darkness and ensure that light prevails. Their valorous deeds etch an everlasting legacy, a testament to the enduring power of courage and honor.",
    "Welcome to a breathtaking fantasy world where imagination knows no bounds. Here, heroes and heroines rise to the occasion, armed with mighty swords and hearts filled with unwavering determination. They traverse treacherous landscapes, face mythical creatures, and challenge powerful adversaries, forging a path of triumph that inspires generations to believe in the extraordinary. This realm is where dreams become reality, where the hero's journey unfolds in glorious splendor, and where the ordinary becomes extraordinary. With each step they take, these extraordinary individuals leave an indelible mark on the tapestry of their world, forever remembered as beacons of hope and inspiration, reminding us all of the boundless possibilities that lie within the realms of our imagination.",
    "In the realm of fables and dreams, heroes embrace their destinies with sword in hand, ready to face the monumental challenges that lie ahead. They navigate wondrous and perilous worlds, braving treacherous terrains and encountering mythical beings that test their mettle. Through epic battles and profound quests, they demonstrate unwavering resolve, inspiring hope and courage in the hearts of all who dare to dream and aspire to greatness. In this realm where imagination reigns supreme, the hero's journey unfolds, forging legends that transcend the boundaries of time and reality. Their tales of heroism and adventure echo through generations, igniting the spark of imagination and reminding us all of the boundless possibilities that await those who dare to embark on their own quests of heroism, and personal growth.",
    "In the realm of fantasy and awe, heroes embark on daring adventures, armed with their wits and trusty swords. They traverse mystical landscapes, encountering captivating creatures amidst ancient ruins and enchanted forests, where reality intertwines with magic. Guided by fate and fueled by a noble cause, these heroes carve their names in the annals of heroism, forever remembered for their unwavering determination, selflessness, and acts of courage. Their extraordinary feats inspire generations, serving as a testament to the boundless possibilities that arise when ordinary individuals embrace the power of imagination and unlock their limitless potential. Through their remarkable journeys, they ignite the flame of hope, reminding us all that within us lies the strength to achieve greatness."
  ],
  text150: [
    "In a realm where the extraordinary merged with the ordinary, a tapestry of enchantment unfurled. Magic crackled in the air, swirling in vibrant hues, as wizards and sorceresses cast spells that defied the laws of nature. Luminous fairies flitted among ancient forests, their delicate wings leaving trails of iridescent dust. Majestic creatures-unicorns with silver manes, phoenixes ablaze with resplendent plumage-graced the landscape, their presence a testament to the realm's ethereal beauty. Hidden within the heart of the land stood enchanted citadels, their spires reaching towards the heavens. Whispers of forgotten incantations echoed through the corridors of time, while mystical artifacts held immeasurable power. It was a world where dreams took flight, where imagination kindled the spark of possibility. In this realm of wonder, both dazzling and elusive, each moment was infused with the potential for magical transformation-a realm where the veil between the mystical and the tangible was forever thin.",
    "Step into a world where the veil of reality is gently lifted, revealing a realm of captivating magic. Cascading waterfalls glimmer with golden essence, their droplets imbued with extraordinary properties. Energetic sprites dart among sunlit meadows, their playful laughter filling the air. Ancient trees, their branches laden with ancient wisdom, whisper secrets only the attentive can decipher. Ethereal beings, shimmering with light, traverse the skies, leaving trails of stardust in their wake. Enchanted crystals pulse with raw power, harnessed by skilled sorcerers for noble pursuits. Each step reveals hidden doorways to enchanted realms, where time bends and dreams take tangible form. It is a world of limitless possibility, where the ordinary is infused with the extraordinary, and where the boundary between reality and imagination dissolves into a symphony of wonder. In this magical world, the wonders of the cosmos are but a touch away, and the essence of magic dances in harmony with the pulse of life itself.",
    "Step into a realm where fantasy and reality intertwine in harmonious splendor. Here, brave and valiant heroes embark on daring quests, their paths intricately woven with the threads of destiny. Armed with enchanted swords, radiant with ancient magic, and imbued with unwavering resolve, they fearlessly confront formidable challenges that lie in wait. From treacherous labyrinthine dungeons teeming with peril to towering fortresses guarded by unspeakable horrors, they rise to overcome each trial with unwavering determination. Along their perilous journey, they form unbreakable bonds of camaraderie, discover hidden truths that shape their understanding of the world, and unlock the dormant depths of their own inner power, harnessing it to achieve feats that defy imagination. In this realm of infinite possibilities and boundless wonder, their heroic deeds etch their names into the annals of legend, inspiring countless generations to dare to dream and believe in the extraordinary that lies within them.",
    "In the enchanting realm of Fairy Tail, magic weaves through every corner, casting its spell of wonder and awe. Wielding elemental powers gifted by ancient forces, brave wizards embark on thrilling quests that lead them through sprawling landscapes. From verdant forests teeming with mythical creatures to majestic castles cloaked in ethereal mists, their journeys are a tapestry of adventure and discovery. With each step, they unravel ancient mysteries and encounter challenges that test their courage and resilience. Bound by unbreakable bonds of friendship and love, these heroes rise above their own limitations, fueled by unwavering determination. Together, they triumph over the darkness that threatens to engulf their realm, shaping the destiny of a fantastical world where dreams come alive. Each tale that unfolds within Fairy Tail resonates with the power of imagination, reminding us of the boundless potential that lies within us all, waiting to be awakened.",
    "Step into a breathtaking fantasy world where imagination knows no bounds. Here, heroes and heroines rise to the occasion, armed with mighty swords and hearts filled with unwavering determination. They traverse treacherous landscapes, face mythical creatures, and challenge powerful adversaries. Through their courage and resilience, they forge a path of triumph, becoming legends that inspire generations. This realm is where dreams become reality, where the hero's journey unfolds in glorious splendor, and where the extraordinary becomes the norm. With each step they take, these extraordinary individuals leave an indelible mark on the tapestry of their world, forever remembered as beacons of hope and inspiration, reminding us all of the boundless possibilities that lie within the realms of our imagination. Embrace the enchantment, ignite your spirit, and venture forth into this captivating realm, where destiny awaits and heroic adventures await those who dare to seek them.",
    "Welcome to Sword World and Fairy Tail, where valor and honor hold the highest regard. Warriors clad in gleaming armor wield mighty swords, defending their kingdom from encroaching darkness. Amid towering castles, lush landscapes, and ancient ruins, epic battles unfold against formidable foes, crafting tales of bravery, sacrifice, and indomitable spirit. These heroic adventures echo through time, inspiring generations with the enduring power of their legends. In this realm, where destiny intertwines with the clash of steel, every swing of a sword shapes the course of history. Heroes emerge to challenge the darkness and ensure that light prevails. Their valorous deeds etch an everlasting legacy, a testament to the enduring power of courage and honor. Embark on a thrilling journey through this wondrous realm, where the echoes of heroism resound and the triumph of the human spirit awaits those who embrace the call of destiny.",
    "Enter the realm of heroic legends, a world where ordinary individuals become extraordinary champions. Armed with swords of destiny, they stand against the forces of darkness, venturing through mystical landscapes and facing mythical creatures. Guided by courage and fueled by determination, they leave an indelible mark on their fantasy realm, forever celebrated as beacons of hope and inspiration. Through their heroic feats and unwavering spirit, they embody the true essence of heroism, inspiring generations to believe in their own potential to make a difference in the world. In this realm where imagination reigns, the hero's journey unfolds, forging timeless legends that transcend the boundaries of time and reality. Their tales of heroism and adventure echo through generations, resonating with the eternal message that the power to change the world lies within each individual who dares to embark on their own transformative quest of heroism and self-discovery.",
    "Welcome to the wondrous world of enchantment and magic, where heroes rise to face incredible challenges. Armed with swords of valor and hearts ablaze with courage, they embark on epic adventures that test their mettle and shape their destinies. From battling fearsome dragons and unraveling the secrets of ancient artifacts, to navigating treacherous realms of fantasy and wonder, their journey becomes a testament to the power of perseverance and the triumph of the human spirit. With each step they take, they inspire all who hear their tales of triumph and sacrifice, igniting the spark of bravery within every heart. In this realm, where the extraordinary becomes ordinary and imagination reigns supreme, heroes transcend the boundaries of time and reality, forever reminding us of the boundless potential that lies within ourselves to become the embodiment of true heroism and make our own mark on the tapestry of the world.",
    "In the realm of fantasy and awe, heroes venture forth on daring adventures, their spirits ablaze with courage and determination. With swords as their trusted companions, they traverse mystical landscapes, where ancient ruins whisper forgotten tales and enchanted forests breathe with mystical energy. Within these realms, the line between reality and magic blurs, and the ordinary transforms into the extraordinary. Guided by fate's invisible hand and driven by a noble cause, these heroes leave an indelible mark on their world, forever etching their names in the annals of heroism. Their tales of triumph and sacrifice become the guiding light for future generations, igniting the sparks of imagination and inspiring others to realize their own potential. In this realm, where the extraordinary becomes ordinary, heroes rise as beacons of hope, embodying the essence of true heroism and reminding us that greatness resides within us all.",
    "Embark on a thrilling hero adventure in a world where magic and wonder intertwine. From mist-shrouded forests to towering citadels, the landscape teems with mythical creatures and ancient secrets waiting to be unraveled. Heroes, gifted with extraordinary powers, brandish mighty swords and conjure spells with precision. They navigate treacherous paths, facing harrowing trials of courage and resilience. With unwavering determination, they confront dark forces that threaten their realm, driven by a quest for justice and the preservation of all that is good. Each step they take is imbued with purpose and destiny, as their valiant deeds make them true champions of this extraordinary realm. Their exploits echo through the ages, becoming legendary tales that inspire future generations to embrace their own heroism and embark on extraordinary journeys of their own, where the clash of steel and the triumph of the human spirit shape the course of destiny itself."
  ],
};



$(game.init);
