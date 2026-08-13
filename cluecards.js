/* ==========================================================
   KOAN~KAON CLUE-CARDS
   PAT LEARNING LAB

   HOW THIS FILE WORKS:

   • The LAST clue in clueCards becomes the current clue.
   • Older clues automatically move into the Archive.
   • Answers stay hidden until solved or revealed.
========================================================== */


/* ==========================================================
   CLUE-CARD DATABASE

   ADD FUTURE CLUES HERE.
========================================================== */

const clueCards = [

  /* ========================================================
     CLUE-CARD #001 — HAT-TRICK
  ======================================================== */

  {
    number: "001",

    title: "Hat-Trick",

    clue:
      "Pulling a rabbit out three times is the goal.",

    enumeration:
      "(3-5)",

    type:
      "Double-Play",

    mechanism:
      "Double Definition / Superposition",

    mechanismDescription:
      "One answer satisfies two different meanings at the same time.",


    /* ------------------------------------------------------
       ORIGINAL CLUE RELEASE

       Exact order:
       IMG_0202
       IMG_0200
       IMG_0201
       IMG_0203
    ------------------------------------------------------ */

    clueSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0200.jpeg",

      "images/cluecards/001/IMG_0201.jpeg",

      "images/cluecards/001/IMG_0203.jpeg"

    ],


    /* ------------------------------------------------------
       ANSWER RELEASE

       Main clue image is deliberately shown again first.

       Exact order:
       IMG_0202
       IMG_0204
       IMG_0206
       IMG_0205
    ------------------------------------------------------ */

    solutionSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0204.jpeg",

      "images/cluecards/001/IMG_0206.jpeg",

      "images/cluecards/001/IMG_0205.jpeg"

    ],


    answer:
      "HAT-TRICK",

    senseA:
      "Magic: pulling a rabbit out of a hat.",

    senseB:
      "Sport: scoring three goals.",

    difficulty:
      "Easy"
  }


  /*
  ==========================================================
  FUTURE CLUE-CARD #002

  When #002 is ready:

  1. Create:

     images/cluecards/002/

  2. Upload its images there.

  3. Put a comma after the closing } for #001.

  4. Add another object like:

  ,

  {
    number: "002",

    title: "ANSWER",

    clue:
      "Your clue here.",

    enumeration:
      "(4)",

    type:
      "Approximation",

    mechanism:
      "Homophone",

    mechanismDescription:
      "Two sounds converge toward one answer.",

    clueSlides: [
      "images/cluecards/002/IMG_0001.jpeg",
      "images/cluecards/002/IMG_0002.jpeg"
    ],

    solutionSlides: [
      "images/cluecards/002/IMG_0001.jpeg",
      "images/cluecards/002/IMG_0003.jpeg"
    ],

    answer:
      "ANSWER",

    senseA:
      "First meaning.",

    senseB:
      "Second meaning.",

    difficulty:
      "Easy"
  }

  ==========================================================
  */

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



/* ==========================================================
   PAGE ELEMENTS
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


const clueText =
  document.getElementById(
    "clueText"
  );


const enumeration =
  document.getElementById(
    "enumeration"
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



/* ==========================================================
   ANSWER PLACEHOLDER

   Example:
   (3-5) → ___-_____

   (5,6) → _____,______
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
    clean.match(
      /\d+|[-,\/ ]/g
    );


  if (
    !parts
  ) {

    return "?????";
  }


  return parts
    .map(
      part => {

        if (
          /^\d+$/.test(
            part
          )
        ) {

          return "_".repeat(
            Number(
              part
            )
          );
        }


        return part;

      }
    )
    .join("");

}



/* ==========================================================
   NORMALIZE ANSWERS

   HAT-TRICK
   hat trick
   Hat Trick

   all count as the same answer.
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
   CURRENT SLIDE SET
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


  solutionUnlocked =
    false;


  guesses =
    0;


  solved =
    false;


  /* RESET GUESSING */

  guessInput.value =
    "";


  guessInput.disabled =
    false;


  guessButton.disabled =
    false;


  guessCounter.textContent =
    "Guesses: 0";


  guessFeedback.textContent =
    "";


  guessFeedback
    .classList
    .remove(
      "correct"
    );


  /* CLUE INFORMATION */

  clueNumber.textContent =
    `CLUE-CARD #${card.number}`;


  /*
    IMPORTANT:
    THE ACTUAL ANSWER IS NOT SHOWN HERE.
  */

  clueTitle.textContent =
    buildAnswerPlaceholder(
      card.enumeration
    );


  clueText.textContent =
    `"${card.clue}"`;


  enumeration.textContent =
    card.enumeration;


  /* SOLUTION INFORMATION */

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


  /* HIDE SOLUTION */

  solutionInfo
    .classList
    .remove(
      "visible"
    );


  revealBox.style.display =
    "block";


  /* RESET PHASE BUTTONS */

  cluePhaseButton
    .classList
    .add(
      "active"
    );


  solutionPhaseButton
    .classList
    .remove(
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
    `Koan~Kaon Clue-Card #${activeClue.number} slide ${slideIndex + 1}`;


  slideCounter.textContent =
    `${slideIndex + 1} / ${slides.length}`;


  phaseLabel.textContent =
    phase ===
    "clue"

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
   DOT NAVIGATION
========================================================== */

function buildDots() {

  dots.innerHTML =
    "";


  const slides =
    getSlides();


  slides.forEach(
    (
      slide,
      index
    ) => {

      const dot =
        document.createElement(
          "button"
        );


      dot.className =
        "dot";


      dot.setAttribute(
        "aria-label",
        `Go to slide ${index + 1}`
      );


      if (
        index ===
        slideIndex
      ) {

        dot
          .classList
          .add(
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

previousButton
  .addEventListener(

    "click",

    () => {

      if (
        slideIndex >
        0
      ) {

        slideIndex--;


        renderSlide();

      }

    }

  );


nextButton
  .addEventListener(

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
   CLUE PHASE
========================================================== */

cluePhaseButton
  .addEventListener(

    "click",

    () => {

      phase =
        "clue";


      slideIndex =
        0;


      cluePhaseButton
        .classList
        .add(
          "active"
        );


      solutionPhaseButton
        .classList
        .remove(
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


  /*
    ONLY NOW DOES THE ANSWER APPEAR
    AT THE TOP OF THE PAGE.
  */

  clueTitle.textContent =
    activeClue.answer;


  guessInput.disabled =
    true;


  guessButton.disabled =
    true;


  solutionPhaseButton.textContent =
    "🔓 Solution";


  solutionPhaseButton
    .classList
    .add(
      "active"
    );


  cluePhaseButton
    .classList
    .remove(
      "active"
    );


  solutionInfo
    .classList
    .add(
      "visible"
    );


  revealBox.style.display =
    "none";


  renderSlide();

}



/* ==========================================================
   SOLUTION TAB
========================================================== */

solutionPhaseButton
  .addEventListener(

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


      solutionPhaseButton
        .classList
        .add(
          "active"
        );


      cluePhaseButton
        .classList
        .remove(
          "active"
        );


      renderSlide();

    }

  );



/* ==========================================================
   BIG REVEAL BUTTON
========================================================== */

bigRevealButton
  .addEventListener(

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
    !guess
  ) {

    guessFeedback.textContent =
      "Enter an answer first.";


    return;

  }


  guesses++;


  guessCounter.textContent =
    `Guesses: ${guesses}`;


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


    guessFeedback.textContent =
      `Correct — ${activeClue.answer}!`;


    guessFeedback
      .classList
      .add(
        "correct"
      );


    revealSolution();


    return;

  }


  guessFeedback.textContent =
    "Not quite. Re-examine the clue from both senses.";


  guessInput.select();

}



/* GUESS BUTTON */

guessButton
  .addEventListener(

    "click",

    submitGuess

  );


/* ENTER KEY */

guessInput
  .addEventListener(

    "keydown",

    event => {

      if (
        event.key ===
        "Enter"
      ) {

        submitGuess();

      }

    }

  );



/* ==========================================================
   SHARE TEXT
========================================================== */

function buildShareText() {

  const guessWord =
    guesses === 1

      ? "guess"

      : "guesses";


  return `KOAN~KAON • Clue-Card #${activeClue.number}

"${activeClue.clue}" ${activeClue.enumeration}

${guesses} ${guessWord}

Can you collapse the clue?

PAT Learning Lab`;

}



/* ==========================================================
   SHARE

   Always attempts to share ONLY the first/main clue image:

   IMG_0202.jpeg for #001.

   It does NOT share an answer image.
========================================================== */

shareButton
  .addEventListener(

    "click",

    async () => {

      const text =
        buildShareText();


      const url =
        window.location.href;


      /*
        ALWAYS SHARE THE FIRST
        CLUE-RELEASE IMAGE.
      */

      const imageUrl =
        activeClue
          .clueSlides[0];


      try {

        const response =
          await fetch(
            imageUrl
          );


        if (
          !response.ok
        ) {

          throw new Error(
            "Image could not be loaded."
          );

        }


        const blob =
          await response.blob();


        const file =
          new File(

            [
              blob
            ],

            `Koan-Kaon-Clue-Card-${activeClue.number}.jpeg`,

            {
              type:
                blob.type ||
                "image/jpeg"
            }

          );


        /*
          BEST CASE:
          SHARE IMAGE + TEXT + URL
        */

        if (
          navigator.share &&
          navigator.canShare &&
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
                `Koan~Kaon Clue-Card #${activeClue.number}`,

              text:
                text,

              url:
                url,

              files:
                [
                  file
                ]
            }
          );


          return;

        }


        /*
          FALLBACK:
          SHARE TEXT + URL
        */

        if (
          navigator.share
        ) {

          await navigator.share(
            {
              title:
                `Koan~Kaon Clue-Card #${activeClue.number}`,

              text:
                text,

              url:
                url
            }
          );


          return;

        }


        /*
          FINAL FALLBACK:
          COPY TO CLIPBOARD
        */

        await navigator
          .clipboard
          .writeText(
            `${text}

${url}`
          );


        shareButton.textContent =
          "Copied!";


        setTimeout(
          () => {

            shareButton.textContent =
              "Share Clue";

          },

          1400
        );

      }


      catch (
        error
      ) {

        /*
          This includes cancelling
          the iPhone/iPad share sheet.
        */

        console.log(
          "Share cancelled or unavailable:",
          error
        );

      }

    }

  );



/* ==========================================================
   ARCHIVE
========================================================== */

function buildArchive() {

  archiveList.innerHTML =
    "";


  const archived =
    clueCards
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    archived.length ===
    0
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


  archived.forEach(
    card => {

      const archiveCard =
        document.createElement(
          "div"
        );


      archiveCard.className =
        "archive-card";


      /*
        IMPORTANT:

        WE DO NOT DISPLAY card.title HERE.

        card.title IS THE ANSWER,
        SO SHOWING IT WOULD SPOIL
        AN ARCHIVED PUZZLE.
      */

      archiveCard.innerHTML = `

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


      archiveCard
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(

          "click",

          () => {

            loadClue(
              card
            );


            playView
              .classList
              .add(
                "active"
              );


            archiveView
              .classList
              .remove(
                "active"
              );


            currentTab
              .classList
              .add(
                "active"
              );


            archiveTab
              .classList
              .remove(
                "active"
              );


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
   CURRENT CLUE TAB
========================================================== */

currentTab
  .addEventListener(

    "click",

    () => {

      loadClue(
        currentClue
      );


      playView
        .classList
        .add(
          "active"
        );


      archiveView
        .classList
        .remove(
          "active"
        );


      currentTab
        .classList
        .add(
          "active"
        );


      archiveTab
        .classList
        .remove(
          "active"
        );

    }

  );



/* ==========================================================
   ARCHIVE TAB
========================================================== */

archiveTab
  .addEventListener(

    "click",

    () => {

      buildArchive();


      playView
        .classList
        .remove(
          "active"
        );


      archiveView
        .classList
        .add(
          "active"
        );


      currentTab
        .classList
        .remove(
          "active"
        );


      archiveTab
        .classList
        .add(
          "active"
        );

    }

  );



/* ==========================================================
   SWIPE SUPPORT
   IPHONE / IPAD
========================================================== */

let touchStartX =
  0;


let touchEndX =
  0;



imageFrame
  .addEventListener(

    "touchstart",

    event => {

      touchStartX =
        event
          .changedTouches[0]
          .screenX;

    },

    {
      passive:
        true
    }

  );



imageFrame
  .addEventListener(

    "touchend",

    event => {

      touchEndX =
        event
          .changedTouches[0]
          .screenX;


      handleSwipe();

    },

    {
      passive:
        true
    }

  );



function handleSwipe() {

  const difference =
    touchEndX -
    touchStartX;


  if (
    Math.abs(
      difference
    ) <
    50
  ) {

    return;

  }


  const slides =
    getSlides();


  /*
    SWIPE LEFT
    → NEXT SLIDE
  */

  if (
    difference <
    0 &&
    slideIndex <
    slides.length - 1
  ) {

    slideIndex++;


    renderSlide();

  }


  /*
    SWIPE RIGHT
    → PREVIOUS SLIDE
  */

  if (
    difference >
    0 &&
    slideIndex >
    0
  ) {

    slideIndex--;


    renderSlide();

  }

}



/* ==========================================================
   START
========================================================== */

loadClue(
  currentClue
);
