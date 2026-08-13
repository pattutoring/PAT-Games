document.addEventListener("DOMContentLoaded", () => {


/* ==========================================================
   CLUE DATABASE
========================================================== */

const clueCards = [

  {
    number: "001",

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

    clueSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0200.jpeg",

      "images/cluecards/001/IMG_0201.jpeg",

      "images/cluecards/001/IMG_0203.jpeg"

    ],

    solutionSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0204.jpeg",

      "images/cluecards/001/IMG_0206.jpeg",

      "images/cluecards/001/IMG_0205.jpeg"

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

let solutionUnlocked =
  false;

let guesses =
  0;

let solved =
  false;


/*
  THE MAIN CLUE IMAGE IS PRELOADED
  AND STORED HERE FOR SHARING.
*/

let shareImageFile =
  null;


/* ==========================================================
   ELEMENTS
========================================================== */

const currentTab =
  document.getElementById("currentTab");

const archiveTab =
  document.getElementById("archiveTab");

const playView =
  document.getElementById("playView");

const archiveView =
  document.getElementById("archiveView");

const clueNumber =
  document.getElementById("clueNumber");

const clueTitle =
  document.getElementById("clueTitle");

const clueText =
  document.getElementById("clueText");

const enumeration =
  document.getElementById("enumeration");

const cluePhaseButton =
  document.getElementById("cluePhaseButton");

const solutionPhaseButton =
  document.getElementById("solutionPhaseButton");

const phaseLabel =
  document.getElementById("phaseLabel");

const slideCounter =
  document.getElementById("slideCounter");

const clueImage =
  document.getElementById("clueImage");

const imageFrame =
  document.getElementById("imageFrame");

const previousButton =
  document.getElementById("previousButton");

const nextButton =
  document.getElementById("nextButton");

const dots =
  document.getElementById("dots");

const guessInput =
  document.getElementById("guessInput");

const guessButton =
  document.getElementById("guessButton");

const guessCounter =
  document.getElementById("guessCounter");

const guessFeedback =
  document.getElementById("guessFeedback");

const revealBox =
  document.getElementById("revealBox");

const bigRevealButton =
  document.getElementById("bigRevealButton");

const shareButton =
  document.getElementById("shareButton");

const shareSolvedButton =
  document.getElementById("shareSolvedButton");

const solutionInfo =
  document.getElementById("solutionInfo");

const answerTitle =
  document.getElementById("answerTitle");

const senseA =
  document.getElementById("senseA");

const senseB =
  document.getElementById("senseB");

const mechanism =
  document.getElementById("mechanism");

const mechanismDescription =
  document.getElementById("mechanismDescription");

const archiveList =
  document.getElementById("archiveList");


/* ==========================================================
   ANSWER PLACEHOLDER
========================================================== */

function buildAnswerPlaceholder(text) {

  const clean =
    text.replace(/[()]/g, "");

  return clean.replace(
    /\d+/g,
    number =>
      "_".repeat(
        Number(number)
      )
  );

}


/* ==========================================================
   NORMALIZE ANSWER
========================================================== */

function normalizeAnswer(text) {

  return text
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      ""
    );

}


/* ==========================================================
   SLIDES
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
   PRELOAD MAIN CLUE IMAGE FOR SHARING
========================================================== */

async function prepareShareImage() {

  shareImageFile =
    null;


  const imageUrl =
    activeClue.clueSlides[0];


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


    shareImageFile =
      new File(

        [blob],

        `Koan-Kaon-Clue-${activeClue.number}.jpeg`,

        {
          type:
            blob.type ||
            "image/jpeg"
        }

      );

  }

  catch(error) {

    console.log(
      "Could not prepare share image:",
      error
    );

  }

}


/* ==========================================================
   LOAD CLUE
========================================================== */

function loadClue(card) {

  activeClue =
    card;

  phase =
    "clue";

  slideIndex =
    0;

  solutionUnlocked =
    false;

  guesses =
    0;

  solved =
    false;


  clueNumber.textContent =
    `CLUE-CARD #${card.number}`;


  clueTitle.textContent =
    buildAnswerPlaceholder(
      card.enumeration
    );


  enumeration.textContent =
    card.enumeration;


  clueText.textContent =
    `"${card.clue}"`;


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
    `${card.type} • ${card.mechanism}`;


  mechanismDescription.textContent =
    card.mechanismDescription;


  solutionInfo.classList.remove(
    "visible"
  );


  revealBox.style.display =
    "block";


  cluePhaseButton.classList.add(
    "active"
  );


  solutionPhaseButton.classList.remove(
    "active"
  );


  solutionPhaseButton.textContent =
    "🔒 Reveal Solution";


  renderSlide();


  /*
    PREPARE SHARE IMAGE NOW,
    BEFORE THE USER EVER PRESSES SHARE.
  */

  prepareShareImage();

}


/* ==========================================================
   RENDER SLIDE
========================================================== */

function renderSlide() {

  const slides =
    getSlides();


  if (
    !slides ||
    slides.length === 0
  ) {

    return;

  }


  clueImage.src =
    slides[slideIndex];


  slideCounter.textContent =
    `${slideIndex + 1} / ${slides.length}`;


  phaseLabel.textContent =
    phase === "clue"
      ? "CLUE RELEASE"
      : "SOLUTION RELEASE";


  previousButton.disabled =
    slideIndex === 0;


  nextButton.disabled =
    slideIndex ===
    slides.length - 1;


  buildDots();

}


/* ==========================================================
   DOTS
========================================================== */

function buildDots() {

  dots.innerHTML =
    "";


  const slides =
    getSlides();


  slides.forEach(
    (slide, index) => {

      const dot =
        document.createElement(
          "button"
        );


      dot.className =
        "dot";


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
        () => {

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
  () => {

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
  () => {

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
  () => {

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

function revealSolution() {

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


  renderSlide();

}


/* ==========================================================
   SOLUTION BUTTON
========================================================== */

solutionPhaseButton.addEventListener(
  "click",
  () => {

    if (
      !solutionUnlocked
    ) {

      revealSolution();

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
  revealSolution
);


/* ==========================================================
   GUESSING
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
    guess === ""
  ) {

    guessFeedback.textContent =
      "Type an answer first.";

    return;

  }


  guesses++;


  guessCounter.textContent =
    `Guesses: ${guesses}`;


  const answer =
    normalizeAnswer(
      activeClue.answer
    );


  if (
    guess === answer
  ) {

    solved =
      true;


    guessFeedback.textContent =
      `Correct — ${activeClue.answer}!`;


    guessFeedback.classList.add(
      "correct"
    );


    setTimeout(
      revealSolution,
      500
    );


    return;

  }


  guessFeedback.textContent =
    "Not quite — try another interpretation.";


  guessInput.value =
    "";


  guessInput.focus();

}


guessButton.addEventListener(
  "click",
  submitGuess
);


guessInput.addEventListener(
  "keydown",
  event => {

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

  let resultLine;


  /*
    AFTER A CORRECT SOLVE
  */

  if (
    solved
  ) {

    resultLine =
      `Solved in ${guesses} ${guesses === 1 ? "guess" : "guesses"}!`;

  }


  /*
    MANUAL REVEAL
  */

  else if (
    solutionUnlocked
  ) {

    resultLine =
      guesses === 0

        ? "Answer revealed"

        : `Answer revealed after ${guesses} ${guesses === 1 ? "guess" : "guesses"}`;

  }


  /*
    STILL UNSOLVED
  */

  else {

    resultLine =
      `${guesses} ${guesses === 1 ? "guess" : "guesses"} so far`;

  }


  return `KOAN~KAON • Clue-Card #${activeClue.number}

"${activeClue.clue}" ${activeClue.enumeration}

${resultLine}

Can you collapse the clue?

PAT Learning Lab`;

}


/* ==========================================================
   SHARE FUNCTION

   BOTH SHARE BUTTONS USE THIS.

   ALWAYS SHARES THE ORIGINAL MAIN CLUE IMAGE.
========================================================== */

async function shareCurrentClue() {

  const text =
    buildShareText();


  /*
    IMAGE IS ALREADY PREPARED,
    SO SAFARI CAN OPEN THE SHARE SHEET
    IMMEDIATELY FROM THE BUTTON TAP.
  */

  if (
    shareImageFile &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare(
      {
        files:
          [shareImageFile]
      }
    )
  ) {

    try {

      await navigator.share(
        {
          title:
            `Koan~Kaon Clue-Card #${activeClue.number}`,

          text:
            text,

          files:
            [shareImageFile]
        }
      );

    }

    catch(error) {

      console.log(
        "Share cancelled:",
        error
      );

    }


    return;

  }


  /*
    FALLBACK:
    SHARE TEXT + LINK
  */

  if (
    navigator.share
  ) {

    try {

      await navigator.share(
        {
          title:
            `Koan~Kaon Clue-Card #${activeClue.number}`,

          text:
            text,

          url:
            window.location.href
        }
      );

    }

    catch(error) {

      console.log(
        "Share cancelled:",
        error
      );

    }


    return;

  }


  /*
    FINAL FALLBACK:
    COPY TEXT
  */

  try {

    await navigator
      .clipboard
      .writeText(
        `${text}

${window.location.href}`
      );


    showCopiedMessage();

  }

  catch(error) {

    console.log(
      "Clipboard unavailable:",
      error
    );

  }

}


/* ==========================================================
   SHARE BUTTON FEEDBACK
========================================================== */

function showCopiedMessage() {

  shareButton.textContent =
    "Copied!";


  shareSolvedButton.textContent =
    "Copied!";


  setTimeout(
    () => {

      shareButton.textContent =
        "📤 Share Clue";


      shareSolvedButton.textContent =
        "📤 Share Result";

    },

    1400
  );

}


/* ==========================================================
   CONNECT BOTH SHARE BUTTONS
========================================================== */

shareButton.addEventListener(
  "click",
  shareCurrentClue
);


shareSolvedButton.addEventListener(
  "click",
  shareCurrentClue
);


/* ==========================================================
   ARCHIVE
========================================================== */

function buildArchive() {

  archiveList.innerHTML =
    "";


  const oldClues =
    clueCards
      .slice(0, -1)
      .reverse();


  if (
    oldClues.length === 0
  ) {

    archiveList.innerHTML = `

      <div class="empty-archive">

        Clue-Card #001 is currently live.

        <br><br>

        When #002 is released,
        #001 will automatically move here.

      </div>

    `;


    return;

  }


  oldClues.forEach(
    card => {

      const box =
        document.createElement(
          "div"
        );


      box.className =
        "archive-card";


      box.innerHTML = `

        <div class="archive-top">

          <span class="archive-number">
            CLUE-CARD #${card.number}
          </span>

          <span>
            ${card.difficulty}
          </span>

        </div>

        <div class="archive-clue">

          "${card.clue}"

          ${card.enumeration}

        </div>

        <button
          class="archive-play-button"
        >
          Play Archived Clue
        </button>

      `;


      box
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(
          "click",
          () => {

            loadClue(card);


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

          }
        );


      archiveList.appendChild(
        box
      );

    }
  );

}


/* ==========================================================
   MAIN NAVIGATION
========================================================== */

currentTab.addEventListener(
  "click",
  () => {

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

  }
);


archiveTab.addEventListener(
  "click",
  () => {

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
   SWIPE
========================================================== */

let touchStartX =
  0;


imageFrame.addEventListener(
  "touchstart",
  event => {

    touchStartX =
      event.changedTouches[0].screenX;

  },
  {
    passive: true
  }
);


imageFrame.addEventListener(
  "touchend",
  event => {

    const touchEndX =
      event.changedTouches[0].screenX;


    const difference =
      touchEndX -
      touchStartX;


    if (
      Math.abs(difference) < 50
    ) {

      return;

    }


    const slides =
      getSlides();


    if (
      difference < 0 &&
      slideIndex <
      slides.length - 1
    ) {

      slideIndex++;

      renderSlide();

    }


    if (
      difference > 0 &&
      slideIndex > 0
    ) {

      slideIndex--;

      renderSlide();

    }

  },
  {
    passive: true
  }
);


/* ==========================================================
   START
========================================================== */

loadClue(
  currentClue
);


});
