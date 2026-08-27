document.addEventListener("DOMContentLoaded", function () {


/* ==========================================================
   CLUE-CARD DATABASE

   The LAST clue automatically becomes the current clue.
   Earlier clues automatically move into the archive.
========================================================== */

const clueCards = [

  /* ========================================================
     CLUE-CARD #001
     ARCHIVED
  ======================================================== */

  {
    number:
      "001",

    clue:
      "Pulling a rabbit out three times is the goal.",

    enumeration:
      "(3-5)",

    answer:
      "HAT-TRICK",

    type:
      "Double-Play",

    mechanism:
      "Double Definition / Superposition",

    mechanismDescription:
      "One answer satisfies two different meanings at the same time.",

    senseA:
      "Magic: pulling a rabbit out of a hat.",

    senseB:
      "Sport: scoring three goals.",

    difficulty:
      "Easy",


    /* ORIGINAL CLUE RELEASE */

    clueSlides: [

      "/PAT-Games/images/cluecards/001/IMG_0202.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0200.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0201.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0203.jpeg"

    ],


    /* ANSWER RELEASE */

    solutionSlides: [

      "/PAT-Games/images/cluecards/001/IMG_0204.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0206.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0205.jpeg"

    ]
  },



  /* ========================================================
     CLUE-CARD #002
     CURRENT PUZZLE
  ======================================================== */

  {
    number:
      "002",

    clue:
      "Sounds like baseball has a pair of these for their uniforms.",

    enumeration:
      "(3)",

    answer:
      "SOX",

    type:
      "Homophone / Approximation",

    mechanism:
      "Homophone / Approximation",

    mechanismDescription:
      "SOX approximates the sound of SOCKS. The surface reading suggests a pair of socks worn with a uniform, while the baseball reading collapses the sound into SOX.",

    senseA:
      "SOCKS: a pair of socks can be worn as part of a uniform.",

    senseB:
      "SOX: the baseball name found in Red Sox and White Sox.",

    difficulty:
      "Easy",


    /* ======================================================
       CLUE RELEASE
       FIRST FIVE IMAGES
    ====================================================== */

    clueSlides: [

      "/PAT-Games/images/cluecards/002/IMG_0270.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0269.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0265.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0268.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0266.jpeg"

    ],


    /* ======================================================
       ANSWER REVEAL
       FINAL FOUR IMAGES
    ====================================================== */

    solutionSlides: [

      "/PAT-Games/images/cluecards/002/IMG_0273.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0272.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0271.jpeg",

      "/PAT-Games/images/cluecards/002/IMG_0267.jpeg"

    ]
  }

];



/* ==========================================================
   STATE
========================================================== */

const currentClue =
  clueCards[
    clueCards.length - 1
  ];


let activeClue =
  currentClue;


let phase =
  "clue";


let slideIndex =
  0;


let guesses =
  0;


let solved =
  false;


let solutionUnlocked =
  false;


let puzzleStartTracked =
  false;


let solveTracked =
  false;


let revealTracked =
  false;



/* ==========================================================
   ANALYTICS
========================================================== */

function trackEvent(
  eventName,
  parameters
) {

  if (
    typeof gtag !==
    "function"
  ) {

    return;

  }


  gtag(
    "event",
    eventName,
    {

      game_name:
        "clue_cards",

      mode:
        "cryptic_clue_card",

      puzzle_number:
        activeClue.number,

      archived:
        activeClue !== currentClue,

      ...(parameters || {})

    }
  );

}



function trackPuzzleStart() {

  if (
    puzzleStartTracked
  ) {

    return;

  }


  puzzleStartTracked =
    true;


  trackEvent(
    "puzzle_started"
  );

}



/* ==========================================================
   ELEMENTS
========================================================== */

const currentTab =
  document.getElementById(
    "currentTab"
  );


const archiveTab =
  document.getElementById(
    "archiveTab"
  );


const playView =
  document.getElementById(
    "playView"
  );


const archiveView =
  document.getElementById(
    "archiveView"
  );


const clueNumber =
  document.getElementById(
    "clueNumber"
  );


const clueTitle =
  document.getElementById(
    "clueTitle"
  );


const enumeration =
  document.getElementById(
    "enumeration"
  );


const clueText =
  document.getElementById(
    "clueText"
  );


const cluePhaseButton =
  document.getElementById(
    "cluePhaseButton"
  );


const solutionPhaseButton =
  document.getElementById(
    "solutionPhaseButton"
  );


const phaseLabel =
  document.getElementById(
    "phaseLabel"
  );


const slideCounter =
  document.getElementById(
    "slideCounter"
  );


const clueImage =
  document.getElementById(
    "clueImage"
  );


const imageFrame =
  document.getElementById(
    "imageFrame"
  );


const previousButton =
  document.getElementById(
    "previousButton"
  );


const nextButton =
  document.getElementById(
    "nextButton"
  );


const dots =
  document.getElementById(
    "dots"
  );


const guessInput =
  document.getElementById(
    "guessInput"
  );


const guessButton =
  document.getElementById(
    "guessButton"
  );


const guessCounter =
  document.getElementById(
    "guessCounter"
  );


const guessFeedback =
  document.getElementById(
    "guessFeedback"
  );


const shareButton =
  document.getElementById(
    "shareButton"
  );


const revealBox =
  document.getElementById(
    "revealBox"
  );


const bigRevealButton =
  document.getElementById(
    "bigRevealButton"
  );


const solutionInfo =
  document.getElementById(
    "solutionInfo"
  );


const answerTitle =
  document.getElementById(
    "answerTitle"
  );


const senseA =
  document.getElementById(
    "senseA"
  );


const senseB =
  document.getElementById(
    "senseB"
  );


const mechanism =
  document.getElementById(
    "mechanism"
  );


const mechanismDescription =
  document.getElementById(
    "mechanismDescription"
  );


const archiveList =
  document.getElementById(
    "archiveList"
  );



/* ==========================================================
   ANSWER PLACEHOLDER
========================================================== */

function buildAnswerPlaceholder(
  enumerationText
) {

  const clean =
    enumerationText
      .replace(
        /[()]/g,
        ""
      );


  const parts =
    clean.split(
      "-"
    );


  return parts
    .map(
      function (
        part
      ) {

        const amount =
          parseInt(
            part,
            10
          );


        if (
          isNaN(
            amount
          )
        ) {

          return "";

        }


        return "_".repeat(
          amount
        );

      }
    )
    .join(
      "-"
    );

}



/* ==========================================================
   NORMALIZE ANSWERS
========================================================== */

function normalizeAnswer(
  text
) {

  return text
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      ""
    );

}



/* ==========================================================
   GET ACTIVE SLIDES
========================================================== */

function getSlides() {

  if (
    phase ===
    "solution"
  ) {

    return activeClue.solutionSlides;

  }


  return activeClue.clueSlides;

}



/* ==========================================================
   LOAD A CLUE
========================================================== */

function loadClue(
  card
) {

  activeClue =
    card;


  phase =
    "clue";


  slideIndex =
    0;


  guesses =
    0;


  solved =
    false;


  solutionUnlocked =
    false;


  puzzleStartTracked =
    false;


  solveTracked =
    false;


  revealTracked =
    false;


  clueNumber.textContent =
    "CLUE-CARD #" +
    card.number;


  clueTitle.textContent =
    buildAnswerPlaceholder(
      card.enumeration
    );


  enumeration.textContent =
    card.enumeration;


  clueText.textContent =
    "“" +
    card.clue +
    "”";


  guessCounter.textContent =
    "Guesses: 0";


  guessInput.value =
    "";


  guessInput.disabled =
    false;


  guessButton.disabled =
    false;


  guessFeedback.textContent =
    "";


  guessFeedback.classList.remove(
    "correct"
  );


  answerTitle.textContent =
    card.answer;


  senseA.textContent =
    card.senseA;


  senseB.textContent =
    card.senseB;


  mechanism.textContent =
    card.type +
    " • " +
    card.mechanism;


  mechanismDescription.textContent =
    card.mechanismDescription;


  solutionInfo.classList.remove(
    "visible"
  );


  revealBox.style.display =
    "block";


  shareButton.textContent =
    "📤 Share Clue";


  cluePhaseButton.classList.add(
    "active"
  );


  solutionPhaseButton.classList.remove(
    "active"
  );


  solutionPhaseButton.textContent =
    "🔒 Reveal Solution";


  renderSlide();

}



/* ==========================================================
   RENDER CURRENT IMAGE
========================================================== */

function renderSlide() {

  const slides =
    getSlides();


  if (
    !slides ||
    slides.length ===
    0
  ) {

    return;

  }


  if (
    slideIndex < 0
  ) {

    slideIndex =
      0;

  }


  if (
    slideIndex >=
    slides.length
  ) {

    slideIndex =
      slides.length - 1;

  }


  clueImage.src =
    slides[
      slideIndex
    ];


  clueImage.alt =
    "Koan~Kaon Clue-Card #" +
    activeClue.number +
    " slide " +
    (
      slideIndex + 1
    );


  slideCounter.textContent =
    (
      slideIndex + 1
    )
    +
    " / "
    +
    slides.length;


  if (
    phase ===
    "clue"
  ) {

    phaseLabel.textContent =
      "CLUE RELEASE";

  }

  else {

    phaseLabel.textContent =
      "SOLUTION RELEASE";

  }


  previousButton.disabled =
    slideIndex ===
    0;


  nextButton.disabled =
    slideIndex ===
    slides.length - 1;


  buildDots();

}



/* ==========================================================
   DOT NAVIGATION
========================================================== */

function buildDots() {

  dots.innerHTML =
    "";


  const slides =
    getSlides();


  slides.forEach(
    function (
      slide,
      index
    ) {

      const dot =
        document.createElement(
          "button"
        );


      dot.type =
        "button";


      dot.className =
        "dot";


      dot.setAttribute(
        "aria-label",
        "Go to slide " +
        (
          index + 1
        )
      );


      if (
        index ===
        slideIndex
      ) {

        dot.classList.add(
          "active"
        );

      }


      dot.addEventListener(
        "click",
        function () {

          trackPuzzleStart();


          slideIndex =
            index;


          renderSlide();

        }
      );


      dots.appendChild(
        dot
      );

    }
  );

}



/* ==========================================================
   PREVIOUS / NEXT
========================================================== */

previousButton.addEventListener(
  "click",
  function () {

    trackPuzzleStart();


    if (
      slideIndex > 0
    ) {

      slideIndex--;


      renderSlide();

    }

  }
);



nextButton.addEventListener(
  "click",
  function () {

    trackPuzzleStart();


    const slides =
      getSlides();


    if (
      slideIndex <
      slides.length - 1
    ) {

      slideIndex++;


      renderSlide();

    }

  }
);



/* ==========================================================
   CLUE TAB
========================================================== */

cluePhaseButton.addEventListener(
  "click",
  function () {

    trackPuzzleStart();


    phase =
      "clue";


    slideIndex =
      0;


    cluePhaseButton.classList.add(
      "active"
    );


    solutionPhaseButton.classList.remove(
      "active"
    );


    renderSlide();

  }
);



/* ==========================================================
   REVEAL SOLUTION
========================================================== */

function revealSolution(
  wasSolved
) {

  trackPuzzleStart();


  if (
    !wasSolved
    &&
    !solutionUnlocked
    &&
    !revealTracked
  ) {

    revealTracked =
      true;


    trackEvent(
      "puzzle_revealed",
      {

        guesses_before_reveal:
          guesses

      }
    );

  }


  solutionUnlocked =
    true;


  phase =
    "solution";


  slideIndex =
    0;


  clueTitle.textContent =
    activeClue.answer;


  guessInput.disabled =
    true;


  guessButton.disabled =
    true;


  solutionPhaseButton.textContent =
    "🔓 Solution";


  solutionPhaseButton.classList.add(
    "active"
  );


  cluePhaseButton.classList.remove(
    "active"
  );


  solutionInfo.classList.add(
    "visible"
  );


  revealBox.style.display =
    "none";


  shareButton.textContent =
    "📤 Share Result";


  renderSlide();

}



/* ==========================================================
   SOLUTION TAB
========================================================== */

solutionPhaseButton.addEventListener(
  "click",
  function () {

    trackPuzzleStart();


    if (
      !solutionUnlocked
    ) {

      revealSolution(
        false
      );


      return;

    }


    phase =
      "solution";


    slideIndex =
      0;


    solutionPhaseButton.classList.add(
      "active"
    );


    cluePhaseButton.classList.remove(
      "active"
    );


    renderSlide();

  }
);



bigRevealButton.addEventListener(
  "click",
  function () {

    revealSolution(
      false
    );

  }
);



/* ==========================================================
   GUESSING

   IMPORTANT:
   Only the exact official answer counts.

   For #002:
   SOX = correct
   SOCKS = incorrect
========================================================== */

function submitGuess() {

  if (
    solved ||
    solutionUnlocked
  ) {

    return;

  }


  const guess =
    normalizeAnswer(
      guessInput.value
    );


  if (
    guess ===
    ""
  ) {

    guessFeedback.textContent =
      "Enter an answer first.";


    return;

  }


  trackPuzzleStart();


  guesses++;


  guessCounter.textContent =
    "Guesses: " +
    guesses;


  trackEvent(
    "puzzle_guess",
    {

      guess_number:
        guesses

    }
  );


  const correctAnswer =
    normalizeAnswer(
      activeClue.answer
    );


  if (
    guess ===
    correctAnswer
  ) {

    solved =
      true;


    if (
      !solveTracked
    ) {

      solveTracked =
        true;


      trackEvent(
        "puzzle_solved",
        {

          guesses:
            guesses

        }
      );

    }


    guessFeedback.textContent =
      "Correct — " +
      activeClue.answer +
      "!";


    guessFeedback.classList.add(
      "correct"
    );


    revealSolution(
      true
    );


    return;

  }


  guessFeedback.classList.remove(
    "correct"
  );


  guessFeedback.textContent =
    "Not quite. Re-examine the clue from both senses.";


  guessInput.select();

}



/* ==========================================================
   GUESS BUTTON
========================================================== */

guessButton.addEventListener(
  "click",
  submitGuess
);



guessInput.addEventListener(
  "keydown",
  function (
    event
  ) {

    if (
      event.key ===
      "Enter"
    ) {

      event.preventDefault();


      submitGuess();

    }

  }
);



/* ==========================================================
   SHARE TEXT
========================================================== */

function buildShareText() {

  let resultText =
    "";


  if (
    solved
  ) {

    resultText =
      "Solved in "
      +
      guesses
      +
      " "
      +
      (
        guesses ===
        1
        ?
          "guess"
        :
          "guesses"
      )
      +
      "!";

  }

  else if (
    solutionUnlocked
  ) {

    if (
      guesses ===
      0
    ) {

      resultText =
        "Answer revealed";

    }

    else {

      resultText =
        "Answer revealed after "
        +
        guesses
        +
        " guesses";

    }

  }

  else {

    resultText =
      guesses
      +
      " "
      +
      (
        guesses ===
        1
        ?
          "guess"
        :
          "guesses"
      )
      +
      " so far";

  }


  return (
    "KOAN~KAON • Clue-Card #"
    +
    activeClue.number
    +
    "\n\n"
    +
    "“"
    +
    activeClue.clue
    +
    "” "
    +
    activeClue.enumeration
    +
    "\n\n"
    +
    resultText
    +
    "\n\n"
    +
    "Can you collapse the clue?"
    +
    "\n\n"
    +
    "PAT Learning Lab"
  );

}



/* ==========================================================
   SHARE

   Always shares the FIRST CLUE IMAGE,
   even when viewing the solution.
========================================================== */

async function shareClue() {

  trackPuzzleStart();


  const text =
    buildShareText();


  const imageUrl =
    activeClue.clueSlides[
      0
    ];


  try {

    const response =
      await fetch(
        imageUrl
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "Could not load share image."
      );

    }


    const blob =
      await response.blob();


    const file =
      new File(
        [
          blob
        ],
        "Koan-Kaon-Clue-"
        +
        activeClue.number
        +
        ".jpeg",
        {

          type:
            blob.type ||
            "image/jpeg"

        }
      );


    if (
      navigator.share
      &&
      navigator.canShare
      &&
      navigator.canShare(
        {

          files:
            [
              file
            ]

        }
      )
    ) {

      await navigator.share(
        {

          title:
            "Koan~Kaon Clue-Card #"
            +
            activeClue.number,

          text:
            text,

          files:
            [
              file
            ]

        }
      );


      trackEvent(
        "puzzle_shared",
        {

          guesses:
            guesses,

          solved:
            solved,

          solution_unlocked:
            solutionUnlocked,

          share_method:
            "native_file"

        }
      );


      return;

    }


    if (
      navigator.share
    ) {

      await navigator.share(
        {

          title:
            "Koan~Kaon Clue-Card #"
            +
            activeClue.number,

          text:
            text,

          url:
            window.location.href

        }
      );


      trackEvent(
        "puzzle_shared",
        {

          guesses:
            guesses,

          solved:
            solved,

          solution_unlocked:
            solutionUnlocked,

          share_method:
            "native"

        }
      );


      return;

    }


    await navigator.clipboard.writeText(
      text
      +
      "\n\n"
      +
      window.location.href
    );


    trackEvent(
      "puzzle_shared",
      {

        guesses:
          guesses,

        solved:
          solved,

        solution_unlocked:
          solutionUnlocked,

        share_method:
          "clipboard"

      }
    );


    const oldText =
      shareButton.textContent;


    shareButton.textContent =
      "Copied!";


    setTimeout(
      function () {

        shareButton.textContent =
          oldText;

      },
      1200
    );

  }

  catch (
    error
  ) {

    try {

      if (
        navigator.share
      ) {

        await navigator.share(
          {

            title:
              "Koan~Kaon Clue-Card #"
              +
              activeClue.number,

            text:
              text,

            url:
              window.location.href

          }
        );


        trackEvent(
          "puzzle_shared",
          {

            guesses:
              guesses,

            solved:
              solved,

            solution_unlocked:
              solutionUnlocked,

            share_method:
              "native_fallback"

          }
        );

      }

      else {

        await navigator.clipboard.writeText(
          text
          +
          "\n\n"
          +
          window.location.href
        );

      }

    }

    catch (
      secondError
    ) {

      console.log(
        "Share cancelled."
      );

    }

  }

}



shareButton.addEventListener(
  "click",
  shareClue
);



/* ==========================================================
   ARCHIVE
========================================================== */

function buildArchive() {

  archiveList.innerHTML =
    "";


  const archivedClues =
    clueCards
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    archivedClues.length ===
    0
  ) {

    archiveList.innerHTML =
      '<div class="empty-archive">'
      +
      'No archived Clue-Cards yet.'
      +
      '</div>';


    return;

  }


  archivedClues.forEach(
    function (
      card
    ) {

      const archiveCard =
        document.createElement(
          "div"
        );


      archiveCard.className =
        "archive-card";


      archiveCard.innerHTML =

        '<div class="archive-top">'
        +

          '<span class="archive-number">'
          +
            'CLUE-CARD #'
            +
            card.number
          +
          '</span>'
        +

          '<span>'
          +
            card.difficulty
          +
          '</span>'
        +

        '</div>'
        +

        '<div class="archive-clue">'
        +

          '“'
          +
          card.clue
          +
          '” '
          +
          card.enumeration
        +

        '</div>'
        +

        '<button type="button" class="archive-play-button">'
        +
          'Play Archived Clue'
        +
        '</button>';


      archiveCard
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(
          "click",
          function () {

            loadClue(
              card
            );


            playView.classList.add(
              "active"
            );


            archiveView.classList.remove(
              "active"
            );


            /*
              We are playing an archived clue,
              so neither tab is treated as
              "Current Clue".
            */

            currentTab.classList.remove(
              "active"
            );


            archiveTab.classList.remove(
              "active"
            );


            trackPuzzleStart();


            window.scrollTo(
              {

                top:
                  0,

                behavior:
                  "smooth"

              }
            );

          }
        );


      archiveList.appendChild(
        archiveCard
      );

    }
  );

}



/* ==========================================================
   CURRENT CLUE NAVIGATION
========================================================== */

currentTab.addEventListener(
  "click",
  function () {

    loadClue(
      currentClue
    );


    playView.classList.add(
      "active"
    );


    archiveView.classList.remove(
      "active"
    );


    currentTab.classList.add(
      "active"
    );


    archiveTab.classList.remove(
      "active"
    );


    trackPuzzleStart();

  }
);



/* ==========================================================
   ARCHIVE NAVIGATION
========================================================== */

archiveTab.addEventListener(
  "click",
  function () {

    buildArchive();


    playView.classList.remove(
      "active"
    );


    archiveView.classList.add(
      "active"
    );


    currentTab.classList.remove(
      "active"
    );


    archiveTab.classList.add(
      "active"
    );

  }
);



/* ==========================================================
   SWIPE SUPPORT
========================================================== */

let touchStartX =
  0;



imageFrame.addEventListener(
  "touchstart",
  function (
    event
  ) {

    touchStartX =
      event
        .changedTouches[
          0
        ]
        .screenX;

  },
  {

    passive:
      true

  }
);



imageFrame.addEventListener(
  "touchend",
  function (
    event
  ) {

    const touchEndX =
      event
        .changedTouches[
          0
        ]
        .screenX;


    const difference =
      touchEndX -
      touchStartX;


    if (
      Math.abs(
        difference
      )
      <
      50
    ) {

      return;

    }


    trackPuzzleStart();


    const slides =
      getSlides();


    if (
      difference <
      0
      &&
      slideIndex <
      slides.length - 1
    ) {

      slideIndex++;


      renderSlide();

    }


    if (
      difference >
      0
      &&
      slideIndex >
      0
    ) {

      slideIndex--;


      renderSlide();

    }

  },
  {

    passive:
      true

  }
);



/* ==========================================================
   START GAME

   Because #002 is last in clueCards,
   it automatically loads as the current puzzle.

   #001 automatically appears in Archive.
========================================================== */

loadClue(
  currentClue
);


});
