document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   CLUE-CARD DATABASE

   LAST CLUE = CURRENT CLUE
   EVERYTHING BEFORE IT = ARCHIVE
========================================================== */

const clueCards = [


  /* ========================================================
     CLUE-CARD #001
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

    clueSlides: [

      "/PAT-Games/images/cluecards/001/IMG_0202.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0200.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0201.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0203.jpeg"

    ],

    solutionSlides: [

      "/PAT-Games/images/cluecards/001/IMG_0204.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0206.jpeg",

      "/PAT-Games/images/cluecards/001/IMG_0205.jpeg"

    ]
  },



  /* ========================================================
     CLUE-CARD #002
     CURRENT
  ======================================================== */

  {
    number:
      "002",

    clue:
      "Sounds like baseball has a pair of these for their uniforms.",

    enumeration:
      "(3)",

    /*
       ONLY SOX IS ACCEPTED AS CORRECT.
       SOCKS IS A NEAR-MISS.
    */

    answer:
      "SOX",

    type:
      "Homophone / Approximation",

    mechanism:
      "Double-Play / Superposition",

    mechanismDescription:
      "The clue primarily uses a sound-alike move: SOCKS ≈ SOX. The literal uniform meaning points toward SOCKS, while the baseball reference points toward SOX.",

    senseA:
      "SOCKS: a pair of socks can be worn as part of a uniform.",

    senseB:
      "SOX: the baseball name found in Red Sox and White Sox.",

    difficulty:
      "Easy",


    /* CLUE RELEASE */

    clueSlides: [

      "/PAT-Games/IMG_0270.jpeg",

      "/PAT-Games/IMG_0269.jpeg",

      "/PAT-Games/IMG_0265.jpeg",

      "/PAT-Games/IMG_0268.jpeg",

      "/PAT-Games/IMG_0266.jpeg"

    ],


    /* SOLUTION RELEASE */

    solutionSlides: [

      "/PAT-Games/IMG_0273.jpeg",

      "/PAT-Games/IMG_0272.jpeg",

      "/PAT-Games/IMG_0271.jpeg",

      "/PAT-Games/IMG_0267.jpeg"

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


/*
  Prevent the same clue from trying to report
  profile completion repeatedly during one load.
*/

let profileCompletionHandled =
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

      /*
        Analytics may keep its existing
        public-facing identifier.

        PATProfile uses "cluecards".
      */

      game_name:
        "clue_cards",

      mode:
        "cryptic_clue_card",

      puzzle_number:
        activeClue.number,

      archived:
        activeClue !==
        currentClue,

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
   SHARED PROFILE HELPERS
========================================================== */

function profileAvailable() {

  return Boolean(

    window.PATProfile

    &&
    typeof PATProfile.get ===
    "function"

  );

}



function refreshClueProfile() {

  if (
    typeof window.renderClueCardProfile ===
    "function"
  ) {

    window.renderClueCardProfile();

  }

}



function archiveUnlocked() {

  if (
    !profileAvailable()

    ||
    typeof PATProfile.canAccessArchive !==
    "function"
  ) {

    return false;

  }


  return PATProfile
    .canAccessArchive();

}



/* ==========================================================
   COMPLETE CLUE-CARD

   ONLY AN ACTUAL CORRECT SOLVE REACHES THIS.

   Manual reveal:
   - no completion
   - no XP
   - no mastery
   - no Lab streak
   - no Clue-Card streak

   PROFILE GAME ID:
   cluecards
========================================================== */

function completeClueCardProfile() {

  if (
    profileCompletionHandled
  ) {

    return null;

  }


  profileCompletionHandled =
    true;


  if (
    !profileAvailable()

    ||
    typeof PATProfile.complete !==
    "function"
  ) {

    return null;

  }


  const result =
    PATProfile.complete(

      "cluecards",

      "clue-" +
      activeClue.number,

      {

        /*
          V3 uses release-based streaks.

          clue-001 → clue-002 → clue-003

          increases the Clue-Card streak.

          Replaying an older archive puzzle
          will not damage the current streak.
        */

        streakKey:
          "cluecards",


        /*
          Every unique correct Clue-Card
          also adds to Clues Solved mastery.
        */

        mastery: {

          cluesSolved:
            1

        }

      }

    );


  refreshClueProfile();


  return result;

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


const cluePlusPanel =
  document.getElementById(
    "cluePlusPanel"
  );



/* ==========================================================
   PLUS PANEL
========================================================== */

function showPlusPanel() {

  if (
    !cluePlusPanel
  ) {

    return;

  }


  cluePlusPanel
    .classList
    .add(
      "visible"
    );


  cluePlusPanel
    .scrollIntoView(
      {

        behavior:
          "smooth",

        block:
          "nearest"

      }
    );

}



/* ==========================================================
   ANSWER PLACEHOLDER
========================================================== */

function buildAnswerPlaceholder(
  enumerationText
) {

  const clean =
    enumerationText.replace(
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
   NORMALIZE ANSWER
========================================================== */

function normalizeAnswer(
  text
) {

  return String(
    text ||
    ""
  )
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

    return activeClue
      .solutionSlides;

  }


  return activeClue
    .clueSlides;

}



/* ==========================================================
   LOAD CLUE
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


  profileCompletionHandled =
    false;



  /* ========================================================
     CLUE INFORMATION
  ======================================================== */

  clueNumber.textContent =
    "CLUE-CARD #"
    +
    card.number;


  clueTitle.textContent =
    buildAnswerPlaceholder(
      card.enumeration
    );


  enumeration.textContent =
    card.enumeration;


  clueText.textContent =
    "“"
    +
    card.clue
    +
    "”";



  /* ========================================================
     GUESSING
  ======================================================== */

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


  guessFeedback
    .classList
    .remove(
      "correct"
    );



  /* ========================================================
     SOLUTION DATA
  ======================================================== */

  answerTitle.textContent =
    card.answer;


  senseA.textContent =
    card.senseA;


  senseB.textContent =
    card.senseB;


  mechanism.textContent =
    card.type
    +
    " • "
    +
    card.mechanism;


  mechanismDescription.textContent =
    card.mechanismDescription;



  /* ========================================================
     HIDE SOLUTION
  ======================================================== */

  solutionInfo
    .classList
    .remove(
      "visible"
    );


  revealBox.style.display =
    "block";


  shareButton.textContent =
    "📤 Share Clue";



  /* ========================================================
     PHASE
  ======================================================== */

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
   RENDER SLIDE
========================================================== */

function renderSlide() {

  const slides =
    getSlides();


  if (
    !slides

    ||
    slides.length ===
    0
  ) {

    clueImage.removeAttribute(
      "src"
    );


    slideCounter.textContent =
      "0 / 0";


    dots.innerHTML =
      "";


    previousButton.disabled =
      true;


    nextButton.disabled =
      true;


    return;

  }


  if (
    slideIndex <
    0
  ) {

    slideIndex =
      0;

  }


  if (
    slideIndex >=
    slides.length
  ) {

    slideIndex =
      slides.length -
      1;

  }


  clueImage.src =
    slides[
      slideIndex
    ];


  clueImage.alt =
    "Koan~Kaon Clue-Card #"
    +
    activeClue.number
    +
    " slide "
    +
    (
      slideIndex +
      1
    );


  slideCounter.textContent =
    (
      slideIndex +
      1
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
    slides.length -
    1;


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


  if (
    !slides
  ) {

    return;

  }


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
        "Go to slide "
        +
        (
          index +
          1
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

previousButton
  .addEventListener(
    "click",
    function () {

      trackPuzzleStart();


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
    function () {

      trackPuzzleStart();


      const slides =
        getSlides();


      if (
        slides

        &&
        slideIndex <
        slides.length -
        1
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
    function () {

      trackPuzzleStart();


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

   wasSolved = true:
   player solved correctly

   wasSolved = false:
   manual reveal
========================================================== */

function revealSolution(
  wasSolved
) {

  trackPuzzleStart();



  /* ========================================================
     MANUAL REVEAL ANALYTICS

     DOES NOT TOUCH PATProfile.
  ======================================================== */

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



  /* ========================================================
     SHOW ANSWER
  ======================================================== */

  clueTitle.textContent =
    activeClue.answer;



  /* ========================================================
     LOCK GUESSING
  ======================================================== */

  guessInput.disabled =
    true;


  guessButton.disabled =
    true;



  /* ========================================================
     PHASE BUTTONS
  ======================================================== */

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



  /* ========================================================
     SOLUTION INFO
  ======================================================== */

  solutionInfo
    .classList
    .add(
      "visible"
    );


  revealBox.style.display =
    "none";


  shareButton.textContent =
    "📤 Share Result";


  renderSlide();

}



/* ==========================================================
   SOLUTION BUTTON
========================================================== */

solutionPhaseButton
  .addEventListener(
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



bigRevealButton
  .addEventListener(
    "click",
    function () {

      revealSolution(
        false
      );

    }
  );



/* ==========================================================
   GUESSING
========================================================== */

function submitGuess() {

  if (
    solved

    ||
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
    "Guesses: "
    +
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



  /* ========================================================
     CORRECT
  ======================================================== */

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



    /*
      THIS IS THE ONLY PLACE
      CLUE-CARD PROFILE COMPLETION OCCURS.
    */

    const profileResult =
      completeClueCardProfile();



    let feedback =
      "Correct — "
      +
      activeClue.answer
      +
      "!";



    /* ======================================================
       XP
    ====================================================== */

    if (
      profileResult

      &&
      profileResult.xpEarned >
      0
    ) {

      feedback +=
        " +"
        +
        profileResult.xpEarned
        +
        " XP";

    }



    /* ======================================================
       DUPLICATE COMPLETION
    ====================================================== */

    else if (
      profileResult

      &&
      profileResult.alreadyCompleted
    ) {

      feedback +=
        " This Clue-Card is already in your solved collection.";

    }



    /* ======================================================
       RELEASE STREAK
    ====================================================== */

    if (
      profileResult

      &&
      profileResult.streakAdvanced

      &&
      profileResult.profile

      &&
      profileResult.profile.streaks
    ) {

      feedback +=
        " 🧩 Streak "
        +
        (
          profileResult
            .profile
            .streaks
            .cluecards
          ||
          0
        )
        +
        "!";

    }



    /* ======================================================
       WEEKLY LEARNING LAB STREAK
    ====================================================== */

    if (
      profileResult

      &&
      profileResult.globalStreakAdvanced

      &&
      profileResult.profile
    ) {

      feedback +=
        " 🔥 Lab "
        +
        (
          profileResult
            .profile
            .globalStreak
          ||
          1
        )
        +
        "!";

    }



    guessFeedback.textContent =
      feedback;


    guessFeedback
      .classList
      .add(
        "correct"
      );


    revealSolution(
      true
    );


    return;

  }



  /* ========================================================
     INCORRECT
  ======================================================== */

  guessFeedback
    .classList
    .remove(
      "correct"
    );



  /* ========================================================
     SPECIAL #002 NEAR-MISS

     SOCKS gets useful feedback,
     but DOES NOT count as correct.
  ======================================================== */

  if (
    activeClue.number ===
    "002"

    &&
    guess ===
    "SOCKS"
  ) {

    guessFeedback.textContent =
      "Very close — you found one side of the sound-alike. The official answer is 3 letters.";

  }

  else {

    guessFeedback.textContent =
      "Not quite. Re-examine the clue from both senses.";

  }


  guessInput.select();

}



/* ==========================================================
   GUESS CONTROLS
========================================================== */

guessButton
  .addEventListener(
    "click",
    submitGuess
  );



guessInput
  .addEventListener(
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
            blob.type
            ||
            "image/jpeg"

        }

      );



    /* ======================================================
       NATIVE SHARE WITH IMAGE
    ====================================================== */

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



    /* ======================================================
       NORMAL NATIVE SHARE
    ====================================================== */

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



    /* ======================================================
       CLIPBOARD FALLBACK
    ====================================================== */

    await navigator
      .clipboard
      .writeText(

        text

        +
        "\n\n"

        +
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

  }


  catch (
    error
  ) {


    /*
      If image sharing failed,
      retry with simple native share
      or clipboard.
    */

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

        await navigator
          .clipboard
          .writeText(

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
              "clipboard_fallback"

          }
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



shareButton
  .addEventListener(
    "click",
    shareClue
  );



/* ==========================================================
   ARCHIVE
========================================================== */

function buildArchive() {

  archiveList.innerHTML =
    "";


  if (
    cluePlusPanel
  ) {

    cluePlusPanel
      .classList
      .remove(
        "visible"
      );

  }


  refreshClueProfile();


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


  const hasAccess =
    archiveUnlocked();



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


      if (
        !hasAccess
      ) {

        archiveCard
          .classList
          .add(
            "locked"
          );

      }



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

          (
            hasAccess
            ?
              'Play Archived Clue'
            :
              '🔒 Unlock with Learning Lab+'
          )

        +

        '</button>';



      const playButton =
        archiveCard
          .querySelector(
            ".archive-play-button"
          );



      /* ====================================================
         UNLOCKED ARCHIVE
      ==================================================== */

      if (
        hasAccess
      ) {

        playButton
          .addEventListener(
            "click",
            function () {

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


              /*
                Neither top tab stays active because
                this is an archived puzzle rather than
                the current weekly clue.
              */

              currentTab
                .classList
                .remove(
                  "active"
                );


              archiveTab
                .classList
                .remove(
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

      }



      /* ====================================================
         LOCKED ARCHIVE
      ==================================================== */

      else {

        playButton
          .addEventListener(
            "click",
            function () {

              showPlusPanel();


              trackEvent(
                "archive_locked_clicked",
                {

                  archive_puzzle:
                    card.number

                }
              );

            }
          );

      }


      archiveList.appendChild(
        archiveCard
      );

    }
  );

}



/* ==========================================================
   CURRENT CLUE
========================================================== */

currentTab
  .addEventListener(
    "click",
    function () {

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


      trackPuzzleStart();

    }
  );



/* ==========================================================
   ARCHIVE TAB
========================================================== */

archiveTab
  .addEventListener(
    "click",
    function () {

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
========================================================== */

let touchStartX =
  0;



imageFrame
  .addEventListener(
    "touchstart",
    function (
      event
    ) {

      if (
        !event.changedTouches

        ||
        !event.changedTouches[
          0
        ]
      ) {

        return;

      }


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



imageFrame
  .addEventListener(
    "touchend",
    function (
      event
    ) {

      if (
        !event.changedTouches

        ||
        !event.changedTouches[
          0
        ]
      ) {

        return;

      }


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
        ) <
        50
      ) {

        return;

      }


      trackPuzzleStart();


      const slides =
        getSlides();


      if (
        !slides
      ) {

        return;

      }



      /* ====================================================
         SWIPE LEFT
      ==================================================== */

      if (
        difference <
        0

        &&
        slideIndex <
        slides.length -
        1
      ) {

        slideIndex++;


        renderSlide();

      }



      /* ====================================================
         SWIPE RIGHT
      ==================================================== */

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
   PROFILE CHANGED

   Refresh:
   - XP
   - Weekly Lab streak
   - Clue-Card streak
   - plan / archive state

   If Learning Lab+ status changes while archive
   is visible, rebuild immediately.
========================================================== */

window.addEventListener(
  "pat-profile-updated",
  function () {

    refreshClueProfile();


    if (
      archiveView
        .classList
        .contains(
          "active"
        )
    ) {

      buildArchive();

    }

  }
);



/* ==========================================================
   PROFILE READY
========================================================== */

window.addEventListener(
  "pat-profile-ready",
  function () {

    refreshClueProfile();

  }
);



/* ==========================================================
   START

   #002 = CURRENT
   #001 = ARCHIVE

   When you add #003 to the END of clueCards:

   #003 automatically becomes current.
   #002 automatically moves to archive.

   V3 progression will then recognize:

   clue-001
   clue-002
   clue-003

   as consecutive Clue-Card releases.
========================================================== */

loadClue(
  currentClue
);


refreshClueProfile();


  }
);
