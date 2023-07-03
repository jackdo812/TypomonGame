"use strict";

const game = {
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
  chosenHero: 'fire',
  loopDuration: 1,
  selectedOption: null,
  fetchTheBacon: () => {
    $.getJSON(
      "https://baconipsum.com/api/?callback=?",
      { type: "all-meat", "start-with-lorem": "0", paras: "1" },
      function (baconGoodness) {
        if (baconGoodness && baconGoodness.length > 0) {
          $("#target").html("");
          for (let i = 0; i < baconGoodness.length; i++) {
            game.targetWords = baconGoodness[i].split(/\s+/).filter(word => word.trim() !== "");
            // Count total words and add to totalWords property
            game.totalWords = game.targetWords.length;
            $("#target").append("<p>");
            // now loop through each character 
            for (let j = 0; j < baconGoodness[i].length; j++) {
              if (baconGoodness[i][j] !== " " || (j > 0 && baconGoodness[i][j - 1] !== " ")) {
                $("#target").append(`<span>${baconGoodness[i][j]}</span>`);
                game.targetText.push(baconGoodness[i][j]);
              }
            }
  
            $("#target").append("</p>");
            // these 2 lines of codes are for highlighting the first letter when the paragraph was generated
            $("#target span:eq(0)").addClass("cursorPosition");
            $("#target span:eq(0)").addClass("cursorPosition-bkg");
          }
        }
      }
    );
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
    } else if (game.percentageCompletion >=10 && game.runFirstAnimation === false) {
      game.heroFirstAttackAnimation();
    } else if (!game.runFirstAnimation && !game.runSecondAnimation) {
      $('#fireball').removeClass("hero-attack-1").hide();
      $('#watergun').removeClass("hero-attack-1").hide();
      $('#razorleaf').removeClass("hero-attack-1").hide();
    };
  },
  

  // heroFirstAttackAnimation: function () {
  //   if (game.chosenHero === 'fire') {
  //     $('#fire-spelling').addClass("spelling").show().one("animationend", function () {
  //       $('#fire-spelling').removeClass("spelling").hide();
  //       $('#fireball').addClass("hero-attack-1").show().one("animationend", function () {
  //         console.log('done casting fireball');
  //         $('#fireball').removeClass("hero-attack-1").hide();
  //         game.runFirstAnimation = true;
  //       });  
  //     });
      
       
  //   } else if (game.chosenHero === 'water') {
  //     $('#watergun').addClass("hero-attack-1").show().one("animationend", function () {
  //       $('#watergun').removeClass("hero-attack-1").hide();
  //       game.runFirstAnimation = true;
  //     });
      
  //   } else if (game.chosenHero === 'leaf') {
  //     $('#razorleaf').addClass("hero-attack-1").show().one("animationend", function () {
  //       $('#razorleaf').removeClass("hero-attack-1").hide();
  //       game.runFirstAnimation = true;
  //     });
      
  //   }
  // },

  heroFirstAttackAnimation: function () {
    if (game.chosenHero === 'fire') {
      //Spelling animation
      $('#fire-spelling').addClass("spelling").show();
      $('#fire-ball-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#fire-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
      // Fireball animation
      $('#fireball').addClass("hero-attack-1").show().one("animationend", function () {
        $('#fireball').removeClass("hero-attack-1").hide();
        game.runFirstAnimation = true;
      });
      game.runFirstAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, game.loopDuration * 900
      );
     
       
    } else if (game.chosenHero === 'water') {
      //Spelling animation
      $('#water-spelling').addClass("spelling").show();
      game.timeoutId = setTimeout(function () {
        $('#water-gun-audio')[0].play()}, game.loopDuration * 500);
      game.timeoutId = setTimeout (function () {
         $('#water-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
      // Water gun animation
      game.timeoutId = setTimeout (function () {
        $('#watergun').addClass("hero-attack-1").show().one("animationend", function () {
          $('#watergun').removeClass("hero-attack-1").hide();
          game.runFirstAnimation = true;
        });}, game.loopDuration * 500);
        game.runFirstAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, game.loopDuration * 900
      );

    } else if (game.chosenHero === 'leaf') {
      //Spelling animation
      $('#leaf-spelling').addClass("spelling").show();
      $('#razor-leaf-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#leaf-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
        
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
      //Spelling animation
      $('#fire-spelling').addClass("spelling").show();
      $('#fire-ball-audio')[0].play();
      game.timeoutId = setTimeout (function () {
        $('#fire-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
      // Inferno animation
      $('#inferno').addClass("hero-attack-2").show();
      game.timeoutId = setTimeout (function () {
        $('#inferno').removeClass("hero-attack-2").hide()
      }, game.loopDuration * 1000);
      game.runFinalAnimation = true; 
      // Monster Takes Damage animation  
      game.timeoutId = setTimeout (function () {
        game.monsterHurt()}, game.loopDuration * 900
      );
      } else if (game.chosenHero === 'water') {
        //Spelling animation
        $('#water-spelling').addClass("spelling").show();
        game.timeoutId = setTimeout(function () {
          $('#waves-audio')[0].play()}, game.loopDuration * 500);
        game.timeoutId = setTimeout (function () {
           $('#water-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
        // Wave animation
        game.timeoutId = setTimeout (function () {
          $('#wave').addClass("hero-attack-1").show().one("animationend", function () {
            $('#wave').removeClass("hero-attack-1").hide();
            game.runFinalAnimation = true;
          });}, game.loopDuration * 500);
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        game.timeoutId = setTimeout (function () {
          game.monsterHurt()}, game.loopDuration * 900
        );
      } else if (game.chosenHero === 'leaf') {
        //Spelling animation
        $('#leaf-spelling').addClass("spelling").show();
        $('#solar-beam-audio')[0].play();
        game.timeoutId = setTimeout (function () {
          $('#leaf-spelling').removeClass("spelling").hide()},game.loopDuration * 1000);
          
        // Solar beam animation
          $('#solarbeam').addClass("hero-attack-2").show();
          game.timeoutId = setTimeout (function () {
            $('#solarbeam').removeClass("hero-attack-2").hide();
          }, game.loopDuration * 1800);
          
          game.runFinalAnimation = true; 
        // Monster Takes Damage animation  
        
        game.timeoutId = setTimeout (function () {
          game.monsterHurt()}, game.loopDuration * 900
        );
      };
  },
            
          

  monsterHurt: function () {
    $('#monster-shaking').addClass("monster-hurt").show();
    game.timeoutId = setTimeout (function () {
      $('#monster-shaking').removeClass("monster-hurt").hide();
    }, game.loopDuration * 800); 
    $('#takehit-audio')[0].play();
  },

  init: () => {
    // fetch the (bacon) target
    game.fetchTheBacon();
    $(window).on("keyup", game.handleKeyup);

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
};

$(game.init);