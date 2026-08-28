/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 4

   ONE PROFILE ACROSS THE ENTIRE LEARNING LAB

   NEW IN V4:
   - Daily Learning Lab activity streak
   - Weekly meaningful-completion streak
   - Release-based puzzle streaks
   - Cloud-ready account identity fields
   - Cloud sync metadata
   - Persistent game progress
   - Molecular Farm-ready progress storage
   - Migration from V1 / V2 / V3

   CURRENT STORAGE:
   localStorage

   STEP 2:
   Real authentication + cloud database

   IMPORTANT:
   localStorage is still the source of truth in V4 Step 1.
   Cloud fields are being prepared here so the games
   do not need another architectural rewrite later.
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV4";


const PAT_OLD_PROFILE_KEYS = [

  "patLearningLabProfileV3",

  "patLearningLabProfileV2",

  "patLearningLabProfileV1"

];



/* ==========================================================
   LEVEL SYSTEM
========================================================== */

const PAT_XP_PER_LEVEL =
  100;



/* ==========================================================
   LEARNING LAB WORLDS
========================================================== */

const PAT_GAMES = {


  /* ========================================================
     CHEMISTRY
  ======================================================== */

  molecular_farm: {

    id:
      "molecular_farm",

    name:
      "Molecular Farm",

    icon:
      "🌾",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },


  molecular_bee: {

    id:
      "molecular_bee",

    name:
      "Molecular Bee",

    icon:
      "🐝",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },



  /* ========================================================
     LANGUAGE / WORDPLAY
  ======================================================== */

  contronym: {

    id:
      "contronym",

    name:
      "Contronym",

    icon:
      "±",

    xpPerCompletion:
      25,

    usesStreak:
      true,

    defaultStreakKey:
      "contronym"

  },


  cluecards: {

    id:
      "cluecards",

    name:
      "Cryptic Clue-Cards",

    icon:
      "🧩",

    xpPerCompletion:
      25,

    usesStreak:
      true,

    defaultStreakKey:
      "cluecards"

  },


  koan_kaon: {

    id:
      "koan_kaon",

    name:
      "KOAN~KAON",

    icon:
      "✣",

    xpPerCompletion:
      30,

    usesStreak:
      false

  },


  cryptic_calculus: {

    id:
      "cryptic_calculus",

    name:
      "Cryptic-Calculus",

    icon:
      "∫",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },



  /* ========================================================
     MATHEMATICS
  ======================================================== */

  candy_calculus: {

    id:
      "candy_calculus",

    name:
      "Oberlander! Candy-Calculus",

    icon:
      "🍬",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },



  /* ========================================================
     MEANING / NARRATIVE
  ======================================================== */

  meaning_graphs: {

    id:
      "meaning_graphs",

    name:
      "Meaning Graphs",

    icon:
      "📈",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  mythopoetic_diagrams: {

    id:
      "mythopoetic_diagrams",

    name:
      "Mythopoetic Diagrams",

    icon:
      "📖",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  wordsmith: {

    id:
      "wordsmith",

    name:
      "Wordsmith",

    icon:
      "✒️",

    xpPerCompletion:
      15,

    usesStreak:
      false

  },


  sentence_standard_model: {

    id:
      "sentence_standard_model",

    name:
      "Sentence Standard Model",

    icon:
      "⚛️",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  twain_editor: {

    id:
      "twain_editor",

    name:
      "Twain Editor",

    icon:
      "⌨️",

    xpPerCompletion:
      10,

    usesStreak:
      false

  }

};



/* ==========================================================
   RELEASE-BASED STREAK SERIES

   THESE FOLLOW PUZZLE RELEASE ORDER.

   Example:

   #001 → #002 → #003
   streak = 3

   #001 → #002 → #004
   streak resets to 1

   Replaying an older archive puzzle
   does not damage the current streak.
========================================================== */

const PAT_STREAK_SERIES = {


  contronym: {

    id:
      "contronym",

    name:
      "Contronym",

    icon:
      "±",

    parentGame:
      "contronym"

  },


  cluecards: {

    id:
      "cluecards",

    name:
      "Clue-Cards",

    icon:
      "🧩",

    parentGame:
      "cluecards"

  },


  koan_one: {

    id:
      "koan_one",

    name:
      "KOAN~KAON SU(1)",

    icon:
      "✣",

    parentGame:
      "koan_kaon"

  },


  koan_two: {

    id:
      "koan_two",

    name:
      "KOAN~KAON SU(2)",

    icon:
      "◈",

    parentGame:
      "koan_kaon"

  },


  buzzword: {

    id:
      "buzzword",

    name:
      "Buzzword",

    icon:
      "🐝",

    parentGame:
      "molecular_bee"

  }

};



/* ==========================================================
   CREATE EMPTY GAME STRUCTURES
========================================================== */

function createPATGameObject(
  defaultValueFactory
) {

  const object =
    {};


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      object[
        gameId
      ] =
        defaultValueFactory();

    }
  );


  return object;

}



/* ==========================================================
   DEFAULT PROFILE
========================================================== */

function createDefaultPATProfile() {

  const completed =
    createPATGameObject(
      function () {

        return [];

      }
    );


  const progress =
    createPATGameObject(
      function () {

        return {};

      }
    );


  const mastery =
    createPATGameObject(
      function () {

        return {};

      }
    );


  const lastPlayed =
    createPATGameObject(
      function () {

        return null;

      }
    );


  const streaks =
    {};


  const streakLastPlayed =
    {};


  const streakLastActivity =
    {};


  Object.keys(
    PAT_STREAK_SERIES
  )
  .forEach(
    function (
      streakId
    ) {

      streaks[
        streakId
      ] =
        0;


      streakLastPlayed[
        streakId
      ] =
        null;


      streakLastActivity[
        streakId
      ] =
        null;

    }
  );


  return {

    version:
      4,



    /* ======================================================
       ACCOUNT
    ====================================================== */

    username:
      "Guest",

    email:
      "",

    avatar:
      "🧪",

    profileCreated:
      false,



    /* ======================================================
       CLOUD ACCOUNT

       STEP 2 WILL POPULATE THESE.

       userId becomes the permanent account identifier.
    ====================================================== */

    userId:
      null,

    authProvider:
      "local",

    cloudEnabled:
      false,

    cloudLastSyncedAt:
      null,

    cloudUpdatedAt:
      null,



    /* ======================================================
       SUBSCRIPTION
    ====================================================== */

    plan:
      "free",



    /* ======================================================
       PLAYER
    ====================================================== */

    xp:
      0,



    /* ======================================================
       DAILY LAB STREAK

       Advances when the player actually enters / uses
       ANY Learning Lab world on a new calendar day.

       Example:

       Monday: Molecular Farm
       Tuesday: Contronym
       Wednesday: Molecular Bee

       Daily Lab streak = 3
    ====================================================== */

    dailyStreak:
      0,

    dailyStreakLastDate:
      null,



    /* ======================================================
       WEEKLY LAB STREAK

       Advances only from a meaningful UNIQUE completion.

       Simply opening a world does NOT advance this streak.
    ====================================================== */

    globalStreak:
      0,

    globalStreakLastWeek:
      null,



    /* ======================================================
       ACTIVITY
    ====================================================== */

    lastActiveDate:
      null,

    lastActivityAt:
      null,



    /* ======================================================
       RELEASE STREAKS
    ====================================================== */

    streaks:
      streaks,

    streakLastPlayed:
      streakLastPlayed,

    streakLastActivity:
      streakLastActivity,



    /* ======================================================
       GAME ACTIVITY
    ====================================================== */

    lastPlayed:
      lastPlayed,

    completed:
      completed,

    completionHistory:
      [],



    /* ======================================================
       GAME PROGRESS

       This will hold things such as:

       progress.molecular_farm = {
         discoveredSpecies: [],
         unlockedFamilies: [],
         currentRegion: null
       }
    ====================================================== */

    progress:
      progress,



    /* ======================================================
       MASTERY
    ====================================================== */

    mastery:
      mastery,



    /* ======================================================
       CONTENT
    ====================================================== */

    unlocks:
      [],

    achievements:
      [],



    /* ======================================================
       ACCOUNT DATES
    ====================================================== */

    createdAt:
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString()

  };

}



/* ==========================================================
   INTERNAL STORAGE SAVE
========================================================== */

function persistPATProfile(
  profile,
  dispatchEvent =
    true
) {

  profile.version =
    4;


  profile.updatedAt =
    new Date()
      .toISOString();


  localStorage.setItem(

    PAT_PROFILE_STORAGE_KEY,

    JSON.stringify(
      profile
    )

  );


  if (
    dispatchEvent
  ) {

    window.dispatchEvent(

      new CustomEvent(
        "pat-profile-updated",
        {

          detail:
            profile

        }
      )

    );

  }


  return profile;

}



/* ==========================================================
   PUBLIC SAVE
========================================================== */

function savePATProfile(
  profile
) {

  return persistPATProfile(
    profile,
    true
  );

}



/* ==========================================================
   DATE HELPERS
========================================================== */

function getPATDateString(
  date =
    new Date()
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() +
      1
    )
    .padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    )
    .padStart(
      2,
      "0"
    );


  return (
    year
    +
    "-"
    +
    month
    +
    "-"
    +
    day
  );

}



/* ==========================================================
   DATE FROM YYYY-MM-DD
========================================================== */

function parsePATDateString(
  dateString
) {

  if (
    !dateString
  ) {

    return null;

  }


  const parts =
    String(
      dateString
    )
    .split(
      "-"
    )
    .map(
      Number
    );


  if (
    parts.length !==
    3
  ) {

    return null;

  }


  const date =
    new Date(

      parts[0],

      parts[1] -
      1,

      parts[2]

    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date;

}



/* ==========================================================
   PREVIOUS CALENDAR DAY
========================================================== */

function getPATPreviousDateString(
  dateString =
    getPATDateString()
) {

  const date =
    parsePATDateString(
      dateString
    );


  if (
    !date
  ) {

    return null;

  }


  date.setDate(
    date.getDate() -
    1
  );


  return getPATDateString(
    date
  );

}



/* ==========================================================
   WEEK KEY

   WEEK BEGINS MONDAY
========================================================== */

function getPATWeekKey(
  date =
    new Date()
) {

  const copy =
    new Date(

      date.getFullYear(),

      date.getMonth(),

      date.getDate()

    );


  const day =
    copy.getDay();


  const distanceFromMonday =
    day ===
    0
    ?
      6
    :
      day -
      1;


  copy.setDate(
    copy.getDate() -
    distanceFromMonday
  );


  return getPATDateString(
    copy
  );

}



/* ==========================================================
   PREVIOUS WEEK
========================================================== */

function getPATPreviousWeekKey(
  weekKey
) {

  const date =
    parsePATDateString(
      weekKey
    );


  if (
    !date
  ) {

    return null;

  }


  date.setDate(
    date.getDate() -
    7
  );


  return getPATDateString(
    date
  );

}



/* ==========================================================
   ACTIVITY SEQUENCE NUMBER
========================================================== */

function getPATActivitySequence(
  activityId
) {

  const text =
    String(
      activityId
    );


  const match =
    text.match(
      /(\d+)(?!.*\d)/
    );


  if (
    !match
  ) {

    return null;

  }


  return Number(
    match[
      1
    ]
  );

}



/* ==========================================================
   FIND HIGHEST COMPLETION
========================================================== */

function findHighestPATCompletion(
  completions,
  filter
) {

  if (
    !Array.isArray(
      completions
    )
  ) {

    return null;

  }


  let best =
    null;


  let bestSequence =
    -1;


  completions.forEach(
    function (
      activityId
    ) {

      const text =
        String(
          activityId
        );


      if (
        filter
        &&
        !filter(
          text
        )
      ) {

        return;

      }


      const sequence =
        getPATActivitySequence(
          text
        );


      if (
        sequence !==
        null
        &&
        sequence >
        bestSequence
      ) {

        best =
          text;


        bestSequence =
          sequence;

      }

    }
  );


  return best;

}



/* ==========================================================
   NORMALIZE / MIGRATE PROFILE
========================================================== */

function migratePATProfile(
  oldProfile
) {

  const fresh =
    createDefaultPATProfile();


  if (
    !oldProfile
    ||
    typeof oldProfile !==
    "object"
  ) {

    return fresh;

  }



  /* ========================================================
     ACCOUNT
  ======================================================== */

  fresh.username =
    oldProfile.username
    ||
    fresh.username;


  fresh.email =
    oldProfile.email
    ||
    "";


  fresh.avatar =
    oldProfile.avatar
    ||
    fresh.avatar;


  fresh.profileCreated =
    Boolean(

      oldProfile.profileCreated

      ||

      oldProfile.email

      ||

      (
        oldProfile.username
        &&
        oldProfile.username !==
        "Guest"
      )

    );



  /* ========================================================
     CLOUD FIELDS
  ======================================================== */

  fresh.userId =
    oldProfile.userId
    ||
    null;


  fresh.authProvider =
    oldProfile.authProvider
    ||
    (
      fresh.userId
      ?
        "cloud"
      :
        "local"
    );


  fresh.cloudEnabled =
    Boolean(
      oldProfile.cloudEnabled
    );


  fresh.cloudLastSyncedAt =
    oldProfile.cloudLastSyncedAt
    ||
    null;


  fresh.cloudUpdatedAt =
    oldProfile.cloudUpdatedAt
    ||
    null;



  /* ========================================================
     PLAN
  ======================================================== */

  if (
    [
      "free",
      "plus",
      "admin"
    ]
    .includes(
      oldProfile.plan
    )
  ) {

    fresh.plan =
      oldProfile.plan;

  }



  /* ========================================================
     PLAYER STATS
  ======================================================== */

  fresh.xp =
    Math.max(
      0,
      Number(
        oldProfile.xp
        ||
        0
      )
    );


  fresh.globalStreak =
    Math.max(
      0,
      Number(
        oldProfile.globalStreak
        ||
        0
      )
    );


  fresh.globalStreakLastWeek =
    oldProfile.globalStreakLastWeek
    ||
    null;


  fresh.dailyStreak =
    Math.max(
      0,
      Number(
        oldProfile.dailyStreak
        ||
        0
      )
    );


  fresh.dailyStreakLastDate =
    oldProfile.dailyStreakLastDate
    ||
    oldProfile.lastActiveDate
    ||
    null;


  fresh.lastActiveDate =
    oldProfile.lastActiveDate
    ||
    null;


  fresh.lastActivityAt =
    oldProfile.lastActivityAt
    ||
    null;


  fresh.createdAt =
    oldProfile.createdAt
    ||
    fresh.createdAt;



  /* ========================================================
     COMPLETIONS
  ======================================================== */

  if (
    oldProfile.completed
    &&
    typeof oldProfile.completed ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        const oldArray =
          oldProfile.completed[
            gameId
          ];


        if (
          Array.isArray(
            oldArray
          )
        ) {

          fresh.completed[
            gameId
          ] =
            [
              ...new Set(
                oldArray.map(
                  String
                )
              )
            ];

        }

      }
    );

  }



  /* ========================================================
     COMPLETION HISTORY
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.completionHistory
    )
  ) {

    fresh.completionHistory =
      oldProfile
        .completionHistory
        .filter(
          function (
            entry
          ) {

            return (

              entry

              &&
              typeof entry ===
              "object"

            );

          }
        )
        .map(
          function (
            entry
          ) {

            return {

              ...entry

            };

          }
        );

  }



  /* ========================================================
     PROGRESS
  ======================================================== */

  if (
    oldProfile.progress
    &&
    typeof oldProfile.progress ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          oldProfile.progress[
            gameId
          ]

          &&
          typeof oldProfile.progress[
            gameId
          ] ===
          "object"

          &&
          !Array.isArray(
            oldProfile.progress[
              gameId
            ]
          )
        ) {

          fresh.progress[
            gameId
          ] =
            {

              ...oldProfile.progress[
                gameId
              ]

            };

        }

      }
    );

  }



  /* ========================================================
     MASTERY
  ======================================================== */

  if (
    oldProfile.mastery
    &&
    typeof oldProfile.mastery ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          oldProfile.mastery[
            gameId
          ]

          &&
          typeof oldProfile.mastery[
            gameId
          ] ===
          "object"
        ) {

          fresh.mastery[
            gameId
          ] =
            {

              ...oldProfile.mastery[
                gameId
              ]

            };

        }

      }
    );

  }



  /* ========================================================
     LAST PLAYED
  ======================================================== */

  if (
    oldProfile.lastPlayed
    &&
    typeof oldProfile.lastPlayed ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        fresh.lastPlayed[
          gameId
        ] =
          oldProfile.lastPlayed[
            gameId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     RELEASE STREAK COUNTS
  ======================================================== */

  if (
    oldProfile.streaks
    &&
    typeof oldProfile.streaks ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        if (
          oldProfile.streaks[
            streakId
          ] !==
          undefined
        ) {

          fresh.streaks[
            streakId
          ] =
            Math.max(
              0,
              Number(
                oldProfile.streaks[
                  streakId
                ]
                ||
                0
              )
            );

        }

      }
    );



    /* OLD KOAN NAMES */

    if (
      oldProfile.streaks.koan_crossword !==
      undefined
    ) {

      fresh.streaks.koan_one =
        Number(
          oldProfile.streaks.koan_crossword
          ||
          0
        );

    }


    if (
      oldProfile.streaks.koan_cryptic !==
      undefined
    ) {

      fresh.streaks.koan_two =
        Number(
          oldProfile.streaks.koan_cryptic
          ||
          0
        );

    }

  }



  /* ========================================================
     STREAK LAST PLAYED
  ======================================================== */

  if (
    oldProfile.streakLastPlayed
    &&
    typeof oldProfile.streakLastPlayed ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        fresh.streakLastPlayed[
          streakId
        ] =
          oldProfile.streakLastPlayed[
            streakId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     STREAK LAST ACTIVITY
  ======================================================== */

  if (
    oldProfile.streakLastActivity
    &&
    typeof oldProfile.streakLastActivity ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        fresh.streakLastActivity[
          streakId
        ] =
          oldProfile.streakLastActivity[
            streakId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     RECONSTRUCT STREAK STATE
  ======================================================== */

  if (
    !fresh.streakLastActivity.contronym
  ) {

    fresh.streakLastActivity.contronym =
      findHighestPATCompletion(
        fresh.completed.contronym
      );

  }


  if (
    !fresh.streakLastActivity.cluecards
  ) {

    fresh.streakLastActivity.cluecards =
      findHighestPATCompletion(
        fresh.completed.cluecards
      );

  }


  if (
    !fresh.streakLastActivity.buzzword
  ) {

    fresh.streakLastActivity.buzzword =
      findHighestPATCompletion(

        fresh.completed.molecular_bee,

        function (
          activity
        ) {

          return /buzzword/i.test(
            activity
          );

        }

      );

  }


  if (
    !fresh.streakLastActivity.koan_one
  ) {

    fresh.streakLastActivity.koan_one =
      findHighestPATCompletion(

        fresh.completed.koan_kaon,

        function (
          activity
        ) {

          return (

            /su1/i.test(
              activity
            )

            ||

            /koan[_-]?one/i.test(
              activity
            )

          );

        }

      );

  }


  if (
    !fresh.streakLastActivity.koan_two
  ) {

    fresh.streakLastActivity.koan_two =
      findHighestPATCompletion(

        fresh.completed.koan_kaon,

        function (
          activity
        ) {

          return (

            /su2/i.test(
              activity
            )

            ||

            /mini/i.test(
              activity
            )

            ||

            /koan[_-]?two/i.test(
              activity
            )

          );

        }

      );

  }



  /* ========================================================
     UNLOCKS
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.unlocks
    )
  ) {

    fresh.unlocks =
      [
        ...new Set(
          oldProfile.unlocks.map(
            String
          )
        )
      ];

  }



  /* ========================================================
     ACHIEVEMENTS
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.achievements
    )
  ) {

    fresh.achievements =
      [
        ...new Set(
          oldProfile.achievements.map(
            String
          )
        )
      ];

  }


  return fresh;

}



/* ==========================================================
   FIND OLD PROFILE
========================================================== */

function findOldPATProfile() {

  for (
    const key
    of
    PAT_OLD_PROFILE_KEYS
  ) {

    const saved =
      localStorage.getItem(
        key
      );


    if (
      !saved
    ) {

      continue;

    }


    try {

      return {

        key:
          key,

        profile:
          JSON.parse(
            saved
          )

      };

    }

    catch (
      error
    ) {

      console.warn(
        "Could not read old PAT profile:",
        key
      );

    }

  }


  return null;

}



/* ==========================================================
   LOAD PROFILE
========================================================== */

function loadPATProfile() {

  const current =
    localStorage.getItem(
      PAT_PROFILE_STORAGE_KEY
    );


  if (
    current
  ) {

    try {

      const parsed =
        JSON.parse(
          current
        );


      return migratePATProfile(
        parsed
      );

    }

    catch (
      error
    ) {

      console.warn(
        "PAT profile could not be read.",
        error
      );

    }

  }



  const old =
    findOldPATProfile();


  if (
    old
  ) {

    const migrated =
      migratePATProfile(
        old.profile
      );


    persistPATProfile(
      migrated,
      false
    );


    return migrated;

  }



  const fresh =
    createDefaultPATProfile();


  persistPATProfile(
    fresh,
    false
  );


  return fresh;

}



/* ==========================================================
   DAILY LEARNING LAB STREAK

   Advances on the first real game activity
   of each calendar day.

   ANY Learning Lab world can continue it.

   Same day:
   no additional streak increase.

   Consecutive day:
   +1.

   Missed day:
   reset to 1.
========================================================== */

function updatePATDailyStreak(
  profile
) {

  const today =
    getPATDateString();


  const previous =
    profile.dailyStreakLastDate;


  if (
    previous ===
    today
  ) {

    return false;

  }


  const yesterday =
    getPATPreviousDateString(
      today
    );


  if (
    previous ===
    yesterday
  ) {

    profile.dailyStreak =
      Math.max(
        0,
        Number(
          profile.dailyStreak
          ||
          0
        )
      )
      +
      1;

  }

  else {

    profile.dailyStreak =
      1;

  }


  profile.dailyStreakLastDate =
    today;


  profile.lastActiveDate =
    today;


  profile.lastActivityAt =
    new Date()
      .toISOString();


  return true;

}



/* ==========================================================
   WEEKLY GLOBAL LEARNING LAB STREAK

   Advances ONLY from a unique meaningful completion.
========================================================== */

function updatePATGlobalStreak(
  profile
) {

  const thisWeek =
    getPATWeekKey();


  const lastWeek =
    profile.globalStreakLastWeek;


  if (
    lastWeek ===
    thisWeek
  ) {

    return false;

  }


  if (
    lastWeek

    &&
    getPATPreviousWeekKey(
      thisWeek
    ) ===
    lastWeek
  ) {

    profile.globalStreak =
      Math.max(
        0,
        Number(
          profile.globalStreak
          ||
          0
        )
      )
      +
      1;

  }

  else {

    profile.globalStreak =
      1;

  }


  profile.globalStreakLastWeek =
    thisWeek;


  profile.lastActiveDate =
    getPATDateString();


  profile.lastActivityAt =
    new Date()
      .toISOString();


  return true;

}



/* ==========================================================
   RELEASE-BASED SERIES STREAK
========================================================== */

function updatePATSeriesStreak(
  profile,
  streakKey,
  activityId
) {

  if (
    !PAT_STREAK_SERIES[
      streakKey
    ]
  ) {

    return false;

  }


  const currentActivity =
    String(
      activityId
    );


  const previousActivity =
    profile.streakLastActivity[
      streakKey
    ];


  if (
    previousActivity ===
    currentActivity
  ) {

    return false;

  }


  const currentSequence =
    getPATActivitySequence(
      currentActivity
    );


  const previousSequence =
    previousActivity
    ?
      getPATActivitySequence(
        previousActivity
      )
    :
      null;



  /* ========================================================
     FIRST RELEASE
  ======================================================== */

  if (
    previousActivity ===
    null
  ) {

    profile.streaks[
      streakKey
    ] =
      Math.max(
        1,
        Number(
          profile.streaks[
            streakKey
          ]
          ||
          0
        )
      );


    profile.streakLastActivity[
      streakKey
    ] =
      currentActivity;


    profile.streakLastPlayed[
      streakKey
    ] =
      getPATDateString();


    return true;

  }



  /* ========================================================
     NUMBERED RELEASE SERIES
  ======================================================== */

  if (
    currentSequence !==
    null

    &&
    previousSequence !==
    null
  ) {


    /* NEXT RELEASE */

    if (
      currentSequence ===
      previousSequence +
      1
    ) {

      profile.streaks[
        streakKey
      ] =
        Math.max(
          0,
          Number(
            profile.streaks[
              streakKey
            ]
            ||
            0
          )
        )
        +
        1;


      profile.streakLastActivity[
        streakKey
      ] =
        currentActivity;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



    /* SKIPPED RELEASE */

    if (
      currentSequence >
      previousSequence +
      1
    ) {

      profile.streaks[
        streakKey
      ] =
        1;


      profile.streakLastActivity[
        streakKey
      ] =
        currentActivity;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



    /* ARCHIVE REPLAY */

    if (
      currentSequence <
      previousSequence
    ) {

      return false;

    }

  }



  /* ========================================================
     NON-NUMBERED FALLBACK
  ======================================================== */

  profile.streaks[
    streakKey
  ] =
    Math.max(
      1,
      Number(
        profile.streaks[
          streakKey
        ]
        ||
        0
      )
      +
      1
    );


  profile.streakLastActivity[
    streakKey
  ] =
    currentActivity;


  profile.streakLastPlayed[
    streakKey
  ] =
    getPATDateString();


  return true;

}



/* ==========================================================
   RECORD GENERAL LAB ACTIVITY

   Used internally whenever the player actually
   enters or meaningfully uses a game.
========================================================== */

function recordPATActivity(
  profile,
  gameId
) {

  if (
    gameId
    &&
    PAT_GAMES[
      gameId
    ]
  ) {

    profile.lastPlayed[
      gameId
    ] =
      getPATDateString();

  }


  profile.lastActiveDate =
    getPATDateString();


  profile.lastActivityAt =
    new Date()
      .toISOString();


  const dailyStreakAdvanced =
    updatePATDailyStreak(
      profile
    );


  return {

    dailyStreakAdvanced:
      dailyStreakAdvanced

  };

}



/* ==========================================================
   MARK GAME PLAYED

   THIS NOW POWERS THE DAILY LAB STREAK.

   Opening / entering any real Learning Lab world:

   YES:
   - records activity
   - advances daily streak once per day

   NO:
   - XP
   - weekly meaningful-completion streak
   - release puzzle streak
========================================================== */

function markPATGamePlayed(
  gameId,
  options =
    {}
) {

  const game =
    PAT_GAMES[
      gameId
    ];


  if (
    !game
  ) {

    console.warn(
      "Unknown PAT game:",
      gameId
    );


    return null;

  }


  const profile =
    loadPATProfile();


  const activityResult =
    recordPATActivity(
      profile,
      gameId
    );


  savePATProfile(
    profile
  );


  return {

    profile:
      profile,

    game:
      game,

    dailyStreakAdvanced:
      activityResult.dailyStreakAdvanced

  };

}



/* ==========================================================
   APPLY MASTERY CHANGES
========================================================== */

function applyPATMasteryChanges(
  profile,
  gameId,
  masteryChanges
) {

  if (
    !masteryChanges

    ||
    typeof masteryChanges !==
    "object"
  ) {

    return;

  }


  if (
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  Object.keys(
    masteryChanges
  )
  .forEach(
    function (
      key
    ) {

      const amount =
        Number(
          masteryChanges[
            key
          ]
          ||
          0
        );


      const current =
        Number(
          profile.mastery[
            gameId
          ][
            key
          ]
          ||
          0
        );


      profile.mastery[
        gameId
      ][
        key
      ] =
        current +
        amount;

    }
  );

}



/* ==========================================================
   COMPLETE ACTIVITY

   UNIQUE COMPLETION MAY:

   - award XP
   - advance Daily Lab streak if needed
   - advance Weekly Lab streak
   - advance release streak
   - increment mastery
   - award achievements
   - save completion history

   REPLAYING SAME ACTIVITY:

   - no duplicate XP
   - no duplicate completion
   - no duplicate weekly/release streak
   - still counts as daily Lab activity
========================================================== */

function completePATActivity(
  gameId,
  activityId,
  options =
    {}
) {

  const game =
    PAT_GAMES[
      gameId
    ];


  if (
    !game
  ) {

    console.warn(
      "Unknown PAT Learning Lab game:",
      gameId
    );


    return null;

  }


  const profile =
    loadPATProfile();


  const completionId =
    String(
      activityId
    );


  const activityResult =
    recordPATActivity(
      profile,
      gameId
    );


  if (
    !profile.completed[
      gameId
    ]
  ) {

    profile.completed[
      gameId
    ] =
      [];

  }


  const alreadyCompleted =
    profile.completed[
      gameId
    ]
    .includes(
      completionId
    );


  let xpEarned =
    0;


  let globalStreakAdvanced =
    false;


  let streakAdvanced =
    false;


  let streakKey =
    options.streakKey
    ||
    null;



  /* ========================================================
     DEFAULT GAME STREAK
  ======================================================== */

  if (
    !streakKey

    &&
    game.usesStreak

    &&
    game.defaultStreakKey
  ) {

    streakKey =
      game.defaultStreakKey;

  }



  /* ========================================================
     UNIQUE COMPLETION ONLY
  ======================================================== */

  if (
    !alreadyCompleted
  ) {

    profile.completed[
      gameId
    ]
    .push(
      completionId
    );



    /* ======================================================
       XP
    ====================================================== */

    if (
      options.xp ===
      0
    ) {

      xpEarned =
        0;

    }

    else {

      xpEarned =
        Number(
          options.xp
        );


      if (
        !Number.isFinite(
          xpEarned
        )
      ) {

        xpEarned =
          Number(
            game.xpPerCompletion
            ||
            0
          );

      }

    }


    xpEarned =
      Math.max(
        0,
        xpEarned
      );


    profile.xp +=
      xpEarned;



    /* ======================================================
       WEEKLY LAB STREAK
    ====================================================== */

    globalStreakAdvanced =
      updatePATGlobalStreak(
        profile
      );



    /* ======================================================
       RELEASE STREAK
    ====================================================== */

    if (
      streakKey

      &&
      PAT_STREAK_SERIES[
        streakKey
      ]
    ) {

      streakAdvanced =
        updatePATSeriesStreak(

          profile,

          streakKey,

          completionId

        );

    }



    /* ======================================================
       MASTERY
    ====================================================== */

    if (
      options.mastery
    ) {

      applyPATMasteryChanges(

        profile,

        gameId,

        options.mastery

      );

    }



    /* ======================================================
       ACHIEVEMENTS
    ====================================================== */

    if (
      Array.isArray(
        options.achievements
      )
    ) {

      options.achievements
        .forEach(
          function (
            achievement
          ) {

            const id =
              String(
                achievement
              );


            if (
              !profile.achievements
                .includes(
                  id
                )
            ) {

              profile.achievements
                .push(
                  id
                );

            }

          }
        );

    }



    /* ======================================================
       HISTORY
    ====================================================== */

    profile.completionHistory
      .push(
        {

          gameId:
            gameId,

          gameName:
            game.name,

          activityId:
            completionId,

          xpEarned:
            xpEarned,

          streakKey:
            streakKey,

          completedAt:
            new Date()
              .toISOString(),

          date:
            getPATDateString(),

          weekKey:
            getPATWeekKey()

        }
      );

  }



  savePATProfile(
    profile
  );


  return {

    profile:
      profile,

    game:
      game,

    activityId:
      completionId,

    alreadyCompleted:
      alreadyCompleted,

    xpEarned:
      xpEarned,

    dailyStreakAdvanced:
      activityResult.dailyStreakAdvanced,

    streakKey:
      streakKey,

    streakAdvanced:
      streakAdvanced,

    globalStreakAdvanced:
      globalStreakAdvanced

  };

}



/* ==========================================================
   SET GAME PROGRESS

   THIS IS THE IMPORTANT MOLECULAR FARM FOUNDATION.

   Example:

   PATProfile.setProgress(
     "molecular_farm",
     "discoveredSpecies",
     ["hydrogen_hippo","helium_hyena"]
   );
========================================================== */

function setPATGameProgress(
  gameId,
  key,
  value
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    console.warn(
      "Unknown PAT game:",
      gameId
    );


    return null;

  }


  const profile =
    loadPATProfile();


  recordPATActivity(
    profile,
    gameId
  );


  if (
    !profile.progress[
      gameId
    ]
  ) {

    profile.progress[
      gameId
    ] =
      {};

  }


  profile.progress[
    gameId
  ][
    key
  ] =
    value;


  savePATProfile(
    profile
  );


  return profile.progress[
    gameId
  ];

}



/* ==========================================================
   SET MULTIPLE PROGRESS VALUES AT ONCE
========================================================== */

function mergePATGameProgress(
  gameId,
  values
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return null;

  }


  if (
    !values

    ||
    typeof values !==
    "object"

    ||
    Array.isArray(
      values
    )
  ) {

    return null;

  }


  const profile =
    loadPATProfile();


  recordPATActivity(
    profile,
    gameId
  );


  profile.progress[
    gameId
  ] =
    {

      ...profile.progress[
        gameId
      ],

      ...values

    };


  savePATProfile(
    profile
  );


  return {

    ...profile.progress[
      gameId
    ]

  };

}



/* ==========================================================
   GET GAME PROGRESS
========================================================== */

function getPATGameProgress(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  if (
    !profile.progress[
      gameId
    ]
  ) {

    return undefined;

  }


  if (
    key ===
    undefined
  ) {

    return JSON.parse(
      JSON.stringify(
        profile.progress[
          gameId
        ]
      )
    );

  }


  return profile.progress[
    gameId
  ][
    key
  ];

}



/* ==========================================================
   CLEAR GAME PROGRESS
========================================================== */

function clearPATGameProgress(
  gameId
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return false;

  }


  const profile =
    loadPATProfile();


  profile.progress[
    gameId
  ] =
    {};


  savePATProfile(
    profile
  );


  return true;

}



/* ==========================================================
   INCREMENT MASTERY
========================================================== */

function incrementPATMastery(
  gameId,
  key,
  amount =
    1
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return null;

  }


  const profile =
    loadPATProfile();


  recordPATActivity(
    profile,
    gameId
  );


  if (
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  const current =
    Number(
      profile.mastery[
        gameId
      ][
        key
      ]
      ||
      0
    );


  profile.mastery[
    gameId
  ][
    key
  ] =
    current
    +
    Number(
      amount
      ||
      0
    );


  savePATProfile(
    profile
  );


  return profile.mastery[
    gameId
  ][
    key
  ];

}



/* ==========================================================
   SET MASTERY
========================================================== */

function setPATMastery(
  gameId,
  key,
  value
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return null;

  }


  const profile =
    loadPATProfile();


  recordPATActivity(
    profile,
    gameId
  );


  if (
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  profile.mastery[
    gameId
  ][
    key
  ] =
    value;


  savePATProfile(
    profile
  );


  return value;

}



/* ==========================================================
   GET MASTERY
========================================================== */

function getPATMastery(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  const gameMastery =
    profile.mastery[
      gameId
    ]
    ||
    {};


  if (
    key ===
    undefined
  ) {

    return {

      ...gameMastery

    };

  }


  return gameMastery[
    key
  ];

}



/* ==========================================================
   UNLOCK CONTENT
========================================================== */

function unlockPATContent(
  unlockId
) {

  const profile =
    loadPATProfile();


  const id =
    String(
      unlockId
    );


  if (
    !profile.unlocks
      .includes(
        id
      )
  ) {

    profile.unlocks
      .push(
        id
      );


    savePATProfile(
      profile
    );

  }


  return profile;

}



/* ==========================================================
   CHECK UNLOCK
========================================================== */

function hasPATUnlock(
  unlockId
) {

  const profile =
    loadPATProfile();


  return profile.unlocks
    .includes(
      String(
        unlockId
      )
    );

}



/* ==========================================================
   ACHIEVEMENTS
========================================================== */

function awardPATAchievement(
  achievementId
) {

  const profile =
    loadPATProfile();


  const id =
    String(
      achievementId
    );


  if (
    profile.achievements
      .includes(
        id
      )
  ) {

    return false;

  }


  profile.achievements
    .push(
      id
    );


  savePATProfile(
    profile
  );


  return true;

}



/* ==========================================================
   CHECK ACHIEVEMENT
========================================================== */

function hasPATAchievement(
  achievementId
) {

  const profile =
    loadPATProfile();


  return profile.achievements
    .includes(
      String(
        achievementId
      )
    );

}



/* ==========================================================
   UPDATE ACCOUNT
========================================================== */

function updatePATAccount(
  data =
    {}
) {

  const profile =
    loadPATProfile();



  /* ========================================================
     USERNAME
  ======================================================== */

  if (
    data.username !==
    undefined
  ) {

    const username =
      String(
        data.username
        ||
        ""
      )
      .trim()
      .replace(
        /^@+/,
        ""
      )
      .slice(
        0,
        30
      );


    profile.username =
      username
      ||
      "Guest";

  }



  /* ========================================================
     EMAIL
  ======================================================== */

  if (
    data.email !==
    undefined
  ) {

    profile.email =
      String(
        data.email
        ||
        ""
      )
      .trim()
      .toLowerCase()
      .slice(
        0,
        150
      );

  }



  /* ========================================================
     AVATAR
  ======================================================== */

  if (
    data.avatar !==
    undefined
  ) {

    profile.avatar =
      String(
        data.avatar
        ||
        "🧪"
      );

  }



  /* ========================================================
     USER ID

     Normally Step 2 authentication will set this.
  ======================================================== */

  if (
    data.userId !==
    undefined
  ) {

    profile.userId =
      data.userId
      ?
        String(
          data.userId
        )
      :
        null;

  }



  /* ========================================================
     AUTH PROVIDER
  ======================================================== */

  if (
    data.authProvider !==
    undefined
  ) {

    profile.authProvider =
      String(
        data.authProvider
        ||
        "local"
      );

  }



  /* ========================================================
     PROFILE CREATED
  ======================================================== */

  profile.profileCreated =
    Boolean(

      profile.email

      &&
      profile.username

      &&
      profile.username !==
      "Guest"

    );


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   USERNAME
========================================================== */

function setPATUsername(
  username
) {

  return updatePATAccount(
    {

      username:
        username

    }
  );

}



/* ==========================================================
   EMAIL
========================================================== */

function setPATEmail(
  email
) {

  return updatePATAccount(
    {

      email:
        email

    }
  );

}



/* ==========================================================
   AVATAR
========================================================== */

function setPATAvatar(
  avatar
) {

  return updatePATAccount(
    {

      avatar:
        avatar

    }
  );

}



/* ==========================================================
   CLOUD ACCOUNT METADATA

   STEP 2 WILL USE THIS.
========================================================== */

function setPATCloudAccount(
  data =
    {}
) {

  const profile =
    loadPATProfile();


  if (
    data.userId !==
    undefined
  ) {

    profile.userId =
      data.userId
      ?
        String(
          data.userId
        )
      :
        null;

  }


  if (
    data.authProvider !==
    undefined
  ) {

    profile.authProvider =
      String(
        data.authProvider
        ||
        "local"
      );

  }


  if (
    data.cloudEnabled !==
    undefined
  ) {

    profile.cloudEnabled =
      Boolean(
        data.cloudEnabled
      );

  }


  if (
    data.cloudLastSyncedAt !==
    undefined
  ) {

    profile.cloudLastSyncedAt =
      data.cloudLastSyncedAt;

  }


  if (
    data.cloudUpdatedAt !==
    undefined
  ) {

    profile.cloudUpdatedAt =
      data.cloudUpdatedAt;

  }


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   PLAN / SUBSCRIPTION
========================================================== */

function setPATPlan(
  plan
) {

  const allowed = [

    "free",

    "plus",

    "admin"

  ];


  if (
    !allowed.includes(
      plan
    )
  ) {

    console.warn(
      "Invalid PAT plan:",
      plan
    );


    return false;

  }


  const profile =
    loadPATProfile();


  profile.plan =
    plan;


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   ARCHIVE ACCESS
========================================================== */

function PATCanAccessArchive() {

  const profile =
    loadPATProfile();


  return (

    profile.plan ===
    "plus"

    ||

    profile.plan ===
    "admin"

  );

}



/* ==========================================================
   PLAN CHECK
========================================================== */

function PATHasPlan(
  plan
) {

  const profile =
    loadPATProfile();


  if (
    plan ===
    "free"
  ) {

    return true;

  }


  if (
    plan ===
    "plus"
  ) {

    return (

      profile.plan ===
      "plus"

      ||

      profile.plan ===
      "admin"

    );

  }


  if (
    plan ===
    "admin"
  ) {

    return (
      profile.plan ===
      "admin"
    );

  }


  return false;

}



/* ==========================================================
   LEVEL CALCULATION
========================================================== */

function getPATLevelData(
  xp
) {

  const safeXP =
    Math.max(
      0,
      Number(
        xp
        ||
        0
      )
    );


  const level =
    Math.floor(
      safeXP /
      PAT_XP_PER_LEVEL
    )
    +
    1;


  const currentLevelStart =
    (
      level -
      1
    )
    *
    PAT_XP_PER_LEVEL;


  const nextLevelXP =
    level
    *
    PAT_XP_PER_LEVEL;


  const xpIntoLevel =
    safeXP
    -
    currentLevelStart;


  const xpNeeded =
    nextLevelXP
    -
    safeXP;


  const percent =
    Math.min(
      100,
      Math.max(
        0,
        (
          xpIntoLevel
          /
          PAT_XP_PER_LEVEL
        )
        *
        100
      )
    );


  return {

    level:
      level,

    xp:
      safeXP,

    xpIntoLevel:
      xpIntoLevel,

    xpPerLevel:
      PAT_XP_PER_LEVEL,

    nextLevelXP:
      nextLevelXP,

    xpNeeded:
      xpNeeded,

    levelPercent:
      percent

  };

}



/* ==========================================================
   PROFILE STATS
========================================================== */

function getPATProfileStats() {

  const profile =
    loadPATProfile();


  let totalCompleted =
    0;


  const completedByGame =
    {};


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      const count =
        Array.isArray(
          profile.completed[
            gameId
          ]
        )
        ?
          profile.completed[
            gameId
          ].length
        :
          0;


      completedByGame[
        gameId
      ] =
        count;


      totalCompleted +=
        count;

    }
  );


  const levelData =
    getPATLevelData(
      profile.xp
    );


  const recentCompletions =
    profile.completionHistory
      .slice()
      .sort(
        function (
          a,
          b
        ) {

          return new Date(
            b.completedAt
          )
          -
          new Date(
            a.completedAt
          );

        }
      )
      .slice(
        0,
        10
      );


  return {

    username:
      profile.username,

    email:
      profile.email,

    avatar:
      profile.avatar,

    profileCreated:
      profile.profileCreated,

    userId:
      profile.userId,

    authProvider:
      profile.authProvider,

    cloudEnabled:
      profile.cloudEnabled,

    cloudLastSyncedAt:
      profile.cloudLastSyncedAt,

    plan:
      profile.plan,



    /* ======================================================
       XP / LEVEL
    ====================================================== */

    xp:
      profile.xp,

    level:
      levelData.level,

    xpIntoLevel:
      levelData.xpIntoLevel,

    xpPerLevel:
      levelData.xpPerLevel,

    xpNeeded:
      levelData.xpNeeded,

    nextLevelXP:
      levelData.nextLevelXP,

    levelPercent:
      levelData.levelPercent,



    /* ======================================================
       DAILY / WEEKLY LAB STREAKS
    ====================================================== */

    dailyStreak:
      profile.dailyStreak,

    dailyStreakLastDate:
      profile.dailyStreakLastDate,

    globalStreak:
      profile.globalStreak,

    globalStreakLastWeek:
      profile.globalStreakLastWeek,



    /* ======================================================
       RELEASE STREAKS
    ====================================================== */

    streaks:
      {

        ...profile.streaks

      },

    streakLastActivity:
      {

        ...profile.streakLastActivity

      },



    /* ======================================================
       ACTIVITY
    ====================================================== */

    lastActiveDate:
      profile.lastActiveDate,

    lastActivityAt:
      profile.lastActivityAt,

    lastPlayed:
      {

        ...profile.lastPlayed

      },



    /* ======================================================
       COMPLETIONS
    ====================================================== */

    totalCompleted:
      totalCompleted,

    completedByGame:
      completedByGame,

    recentCompletions:
      recentCompletions,



    /* ======================================================
       PROGRESS
    ====================================================== */

    progress:
      JSON.parse(
        JSON.stringify(
          profile.progress
        )
      ),



    /* ======================================================
       MASTERY
    ====================================================== */

    mastery:
      JSON.parse(
        JSON.stringify(
          profile.mastery
        )
      ),



    /* ======================================================
       CONTENT
    ====================================================== */

    achievements:
      [
        ...profile.achievements
      ],

    unlocks:
      [
        ...profile.unlocks
      ]

  };

}



/* ==========================================================
   COMPLETION CHECK
========================================================== */

function hasPATCompleted(
  gameId,
  activityId
) {

  const profile =
    loadPATProfile();


  if (
    !profile.completed[
      gameId
    ]
  ) {

    return false;

  }


  return profile.completed[
    gameId
  ]
  .includes(
    String(
      activityId
    )
  );

}



/* ==========================================================
   COMPLETION HISTORY
========================================================== */

function getPATCompletionHistory(
  gameId
) {

  const profile =
    loadPATProfile();


  if (
    !gameId
  ) {

    return profile.completionHistory
      .slice();

  }


  return profile.completionHistory
    .filter(
      function (
        entry
      ) {

        return entry.gameId ===
          gameId;

      }
    );

}



/* ==========================================================
   LOCAL SIGN-IN STATE

   STILL PROTOTYPE IN STEP 1.

   STEP 2 replaces this with real authentication.
========================================================== */

function PATIsSignedIn() {

  const profile =
    loadPATProfile();


  return Boolean(

    profile.profileCreated

    &&
    profile.username

    &&
    profile.username !==
    "Guest"

    &&
    profile.email

  );

}



/* ==========================================================
   CLOUD SIGN-IN STATE

   Step 2 will return true when a verified
   cloud account exists.
========================================================== */

function PATIsCloudSignedIn() {

  const profile =
    loadPATProfile();


  return Boolean(

    profile.userId

    &&
    profile.cloudEnabled

    &&
    profile.authProvider !==
    "local"

  );

}



/* ==========================================================
   SIGN OUT

   STEP 1:
   removes local identity but leaves progress.

   STEP 2:
   this will also sign out of authentication.
========================================================== */

function PATSignOut() {

  const profile =
    loadPATProfile();


  profile.username =
    "Guest";


  profile.email =
    "";


  profile.profileCreated =
    false;


  profile.userId =
    null;


  profile.authProvider =
    "local";


  profile.cloudEnabled =
    false;


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   RESET

   DEVELOPMENT / TESTING ONLY
========================================================== */

function resetPATProfile() {

  const fresh =
    createDefaultPATProfile();


  savePATProfile(
    fresh
  );


  return fresh;

}



/* ==========================================================
   PUBLIC API
========================================================== */

window.PATProfile = {


  /* ========================================================
     ACCOUNT
  ======================================================== */

  get:
    loadPATProfile,

  save:
    savePATProfile,

  updateAccount:
    updatePATAccount,

  setUsername:
    setPATUsername,

  setEmail:
    setPATEmail,

  setAvatar:
    setPATAvatar,

  setCloudAccount:
    setPATCloudAccount,

  isSignedIn:
    PATIsSignedIn,

  isCloudSignedIn:
    PATIsCloudSignedIn,

  signOut:
    PATSignOut,



  /* ========================================================
     SUBSCRIPTION
  ======================================================== */

  setPlan:
    setPATPlan,

  hasPlan:
    PATHasPlan,

  canAccessArchive:
    PATCanAccessArchive,



  /* ========================================================
     GAME ACTIVITY
  ======================================================== */

  complete:
    completePATActivity,

  hasCompleted:
    hasPATCompleted,

  history:
    getPATCompletionHistory,

  markPlayed:
    markPATGamePlayed,

  setProgress:
    setPATGameProgress,

  mergeProgress:
    mergePATGameProgress,

  getProgress:
    getPATGameProgress,

  clearProgress:
    clearPATGameProgress,



  /* ========================================================
     MASTERY
  ======================================================== */

  incrementMastery:
    incrementPATMastery,

  setMastery:
    setPATMastery,

  getMastery:
    getPATMastery,



  /* ========================================================
     CONTENT
  ======================================================== */

  unlock:
    unlockPATContent,

  hasUnlock:
    hasPATUnlock,

  awardAchievement:
    awardPATAchievement,

  hasAchievement:
    hasPATAchievement,



  /* ========================================================
     STATS
  ======================================================== */

  stats:
    getPATProfileStats,

  getLevel:
    function () {

      const profile =
        loadPATProfile();


      return getPATLevelData(
        profile.xp
      );

    },



  /* ========================================================
     DATE HELPERS
  ======================================================== */

  date:
    getPATDateString,

  week:
    getPATWeekKey,



  /* ========================================================
     CONFIG
  ======================================================== */

  games:
    PAT_GAMES,

  streakSeries:
    PAT_STREAK_SERIES,

  xpPerLevel:
    PAT_XP_PER_LEVEL,



  /* ========================================================
     VERSION
  ======================================================== */

  version:
    4,



  /* ========================================================
     DEV
  ======================================================== */

  reset:
    resetPATProfile

};



/* ==========================================================
   INITIALIZE

   Automatically migrates V1 / V2 / V3 → V4.

   Merely loading profile.js does NOT advance
   the Daily Lab streak.

   A player must actually enter/use a Learning Lab world
   through markPlayed(), complete(), setProgress(),
   incrementMastery(), etc.
========================================================== */

const initializedPATProfile =
  loadPATProfile();



/* ==========================================================
   READY EVENT
========================================================== */

window.dispatchEvent(

  new CustomEvent(
    "pat-profile-ready",
    {

      detail:
        initializedPATProfile

    }
  )

);
