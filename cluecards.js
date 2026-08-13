document.addEventListener("DOMContentLoaded", function () {


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
  clueCards[clueCards.length - 1];

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

let shareImageFile =
  null;


/* ==========================================================
   GET ELEMENTS
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

const enumeration =
  document.getElementById("enumeration");

const clueText =
  document.getElementById("clueText");

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

const shareButton =
  document.getElementById("shareButton");

const revealBox =
  document.getElementById("revealBox");

const bigRevealButton =
  document.getElementById("bigRevealButton");

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

function makePlaceholder(enumerationText) {

  const clean =
    enumerationText
      .replace("(", "")
      .replace(")", "");

  const pieces =
    clean.split("-");

  return pieces
    .map(function (piece) {

      const number =
        parseInt(piece, 10);

      return "_".repeat(number);

    })
    .join("-");

}


/* ==========================================================
   ANSWER NORMALIZATION
========================================================== */

function normalizeAnswer(text) {

  return text
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

}


/* ==========================================================
   GET SLIDES
========================================================== */

function getSlides() {

  if (phase === "solution") {

    return activeClue.solutionSlides;

  }

  return activeClue.clueSlides;

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

  guesses =
    0;

  solved =
    false;

  solutionUnlocked =
    false;


  /* HEADER */

  clueNumber.textContent =
    "CLUE-CARD #" + card.number;

  clueTitle.textContent =
    makePlaceholder(card.enumeration);

  enumeration.textContent =
    card.enumeration;

  clueText.textContent =
    '"' + card.clue + '"';


  /* GUESSING */

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


  /* SOLUTION INFO */

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


  /* PHASE BUTTONS */

  cluePhaseButton.classList.add(
    "active"
  );

  solutionPhaseButton.classList.remove(
    "active"
  );

  solutionPhaseButton.textContent =
    "🔒 Reveal Solution";


  renderSlide();

  prepareShareImage();

}


/* ==========================================================
   RENDER SLIDE
========================================================== */

function renderSlide() {

  const slides =
    getSlides();

  if (!slides || slides.length === 0) {
    return;
  }

  if (slideIndex < 0) {
    slideIndex = 0;
  }

  if (slideIndex >= slides.length) {
    slideIndex = slides.length - 1;
  }


  clueImage.src =
    slides[slideIndex];

  clueImage.alt =
    "Clue-Card #" +
    activeClue.number +
    " slide " +
    (slideIndex + 1);


  slideCounter.textContent =
    (slideIndex + 1) +
    " / " +
    slides.length;


  if (phase === "clue") {

    phaseLabel.textContent =
      "CLUE RELEASE";

  } else {

    phaseLabel.textContent =
      "SOLUTION RELEASE";

  }


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


  slides.forEach(function (slide, index) {

    const dot =
      document.createElement("button");

    dot.className =
      "dot";


    if (index === slideIndex) {

      dot.classList.add(
        "active"
      );

    }


    dot.addEventListener(
      "click",
      function () {

        slideIndex =
          index;

        renderSlide();

      }
    );


    dots.appendChild(dot);

  });

}


/* ==========================================================
   PREVIOUS / NEXT
========================================================== */

previousButton.addEventListener(
  "click",
  function () {

    if (slideIndex > 0) {

      slideIndex--;

      renderSlide();

    }

  }
);


nextButton.addEventListener(
  "click",
  function () {

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
   CLUE RELEASE TAB
========================================================== */

cluePhaseButton.addEventListener(
  "click",
  function () {

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

    if (!solutionUnlocked) {

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


  if (guess === "") {

    guessFeedback.textContent =
      "Type an answer first.";

    return;

  }


  guesses++;

  guessCounter.textContent =
    "Guesses: " + guesses;


  const correctAnswer =
    normalizeAnswer(
      activeClue.answer
    );


  if (guess === correctAnswer) {

    solved =
      true;

    guessFeedback.textContent =
      "Correct — " +
      activeClue.answer +
      "!";

    guessFeedback.classList.add(
      "correct"
    );


    setTimeout(
      revealSolution,
      400
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
  function (event) {

    if (event.key === "Enter") {

      event.preventDefault();

      submitGuess();

    }

  }
);


/* ==========================================================
   PREPARE SHARE IMAGE
========================================================== */

async function prepareShareImage() {

  shareImageFile =
    null;

  const imageUrl =
    activeClue.clueSlides[0];


  try {

    const response =
      await fetch(imageUrl);

    if (!response.ok) {

      throw new Error(
        "Share image did not load."
      );

    }


    const blob =
      await response.blob();


    shareImageFile =
      new File(
        [blob],
        "Koan-Kaon-Clue-" +
        activeClue.number +
        ".jpeg",
        {
          type:
            blob.type ||
            "image/jpeg"
        }
      );

  }

  catch (error) {

    console.log(
      "Share image error:",
      error
    );

  }

}


/* ==========================================================
   SHARE TEXT
========================================================== */

function buildShareText() {

  let result;


  if (solved) {

    result =
      "Solved in " +
      guesses +
      " " +
      (
        guesses === 1
          ? "guess"
          : "guesses"
      ) +
      "!";

  }

  else if (solutionUnlocked) {

    result =
      guesses === 0
        ? "Answer revealed"
        : "Answer revealed after " +
          guesses +
          " guesses";

  }

  else {

    result =
      guesses +
      " " +
      (
        guesses === 1
          ? "guess"
          : "guesses"
      ) +
      " so far";

  }


  return (
    "KOAN~KAON • Clue-Card #" +
    activeClue.number +
    "\n\n" +
    '"' +
    activeClue.clue +
    '" ' +
    activeClue.enumeration +
    "\n\n" +
    result +
    "\n\n" +
    "Can you collapse the clue?\n\n" +
    "PAT Learning Lab"
  );

}


/* ==========================================================
   SHARE
========================================================== */

async function shareCurrentClue() {

  const text =
    buildShareText();


  try {

    if (
      shareImageFile &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [shareImageFile]
      })
    ) {

      await navigator.share({
        title:
          "Koan~Kaon Clue-Card #" +
          activeClue.number,

        text:
          text,

        files:
          [shareImageFile]
      });

      return;

    }


    if (navigator.share) {

      await navigator.share({
        title:
          "Koan~Kaon Clue-Card #" +
          activeClue.number,

        text:
          text,

        url:
          window.location.href
      });

      return;

    }


    await navigator.clipboard.writeText(
      text +
      "\n\n" +
      window.location.href
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

  catch (error) {

    console.log(
      "Share cancelled:",
      error
    );

  }

}


shareButton.addEventListener(
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


  if (oldClues.length === 0) {

    archiveList.innerHTML =
      '<div class="empty-archive">' +
      'Clue-Card #001 is currently live.' +
      '<br><br>' +
      'When #002 is released, #001 will automatically move here.' +
      '</div>';

    return;

  }


  oldClues.forEach(function (card) {

    const box =
      document.createElement(
        "div"
      );


    box.className =
      "archive-card";


    box.innerHTML =
      '<div class="archive-top">' +

        '<span class="archive-number">' +
          'CLUE-CARD #' +
          card.number +
        '</span>' +

        '<span>' +
          card.difficulty +
        '</span>' +

      '</div>' +

      '<div class="archive-clue">' +
        '"' +
        card.clue +
        '" ' +
        card.enumeration +
      '</div>' +

      '<button class="archive-play-button">' +
        'Play Archived Clue' +
      '</button>';


    box
      .querySelector(
        ".archive-play-button"
      )
      .addEventListener(
        "click",
        function () {

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

  });

}


/* ==========================================================
   MAIN NAVIGATION
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

  }
);


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
   SWIPE
========================================================== */

let touchStartX =
  0;


imageFrame.addEventListener(
  "touchstart",
  function (event) {

    touchStartX =
      event
        .changedTouches[0]
        .screenX;

  },
  {
    passive: true
  }
);


imageFrame.addEventListener(
  "touchend",
  function (event) {

    const touchEndX =
      event
        .changedTouches[0]
        .screenX;


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
