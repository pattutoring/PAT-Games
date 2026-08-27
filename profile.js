/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 3.1

   ONE PROFILE ACROSS THE ENTIRE LEARNING LAB

   Supports:
   - Username
   - Email
   - Avatar
   - Free / Plus / Admin plan
   - Shared XP
   - Learning Lab Level
   - Weekly overall Learning Lab streak
   - Release-based puzzle streaks
   - Completion history
   - Duplicate reward protection
   - Game progress
   - Mastery counters
   - Unlocks
   - Achievements / badges
   - Archive access
   - Future subscription integration

   CURRENT STORAGE:
   localStorage

   FUTURE:
   Real authentication
   Cloud database
   Subscription backend
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV3";


const PAT_OLD_PROFILE_KEYS = [

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
      3,


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
       SUBSCRIPTION
    ====================================================== */

    plan:
      "free",


    /* ======================================================
       PLAYER
    ====================================================== */

    xp:
      0,

    globalStreak:
      0,

    globalStreakLastWeek:
      null,

    lastActiveDate:
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

    progress:
      progress,

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
    3;


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
    year +
    "-" +
    month +
    "-" +
    day
  );

}



/* ==========================================================
   WEEK KEY

   WEEK STARTS MONDAY
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
   PREVIOUS WEEK KEY
========================================================== */

function getPATPreviousWeekKey(
  weekKey
) {

  if (
    !weekKey
  ) {

    return null;

  }


  const parts =
    weekKey
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

   EXAMPLES:

   002
   clue-002
   buzzword-004
   su1-003
   su2-015
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
    match[1]
  );

}



/* ==========================================================
   GET SORTED UNIQUE RELEASES
========================================================== */

function getPATReleaseEntries(
  completions,
  filter
) {

  if (
    !Array.isArray(
      completions
    )
  ) {

    return [];

  }


  const sequenceMap =
    new Map();


  completions
    .map(
      String
    )
    .forEach(
      function (
        activityId
      ) {

        if (
          filter
          &&
          !filter(
            activityId
          )
        ) {

          return;

        }


        const sequence =
          getPATActivitySequence(
            activityId
          );


        if (
          sequence ===
          null
        ) {

          return;

        }


        /*
          Only one activity needs to represent
          each release number.
        */

        if (
          !sequenceMap.has(
            sequence
          )
        ) {

          sequenceMap.set(
            sequence,
            activityId
          );

        }

      }
    );


  return Array
    .from(
      sequenceMap.entries()
    )
    .map(
      function (
        entry
      ) {

        return {

          sequence:
            entry[0],

          activityId:
            entry[1]

        };

      }
    )
    .sort(
      function (
        a,
        b
      ) {

        return (
          a.sequence -
          b.sequence
        );

      }
    );

}



/* ==========================================================
   REBUILD RELEASE STREAK

   EXAMPLES:

   001,002,003
   = 3

   001,002,004
   = 1

   001,003,004
   = 2

   004,005,006
   = 3

   Streak is measured from the latest completed release
   backward through consecutive release numbers.
========================================================== */

function calculatePATReleaseStreak(
  completions,
  filter
) {

  const releases =
    getPATReleaseEntries(
      completions,
      filter
    );


  if (
    releases.length ===
    0
  ) {

    return {

      streak:
        0,

      lastActivity:
        null,

      lastSequence:
        null

    };

  }


  const latest =
    releases[
      releases.length -
      1
    ];


  let streak =
    1;


  let expected =
    latest.sequence -
    1;


  for (
    let index =
      releases.length -
      2;

    index >=
      0;

    index--
  ) {

    const release =
      releases[
        index
      ];


    if (
      release.sequence ===
      expected
    ) {

      streak++;


      expected--;


      continue;

    }


    if (
      release.sequence <
      expected
    ) {

      break;

    }

  }


  return {

    streak:
      streak,

    lastActivity:
      latest.activityId,

    lastSequence:
      latest.sequence

  };

}



/* ==========================================================
   REBUILD ALL V1 / V2 RELEASE STREAKS

   THIS IS THE IMPORTANT MIGRATION FIX.
========================================================== */

function rebuildPATReleaseStreaksFromCompletions(
  profile
) {


  /* CONTRONYM */

  const contronym =
    calculatePATReleaseStreak(

      profile.completed.contronym

    );


  profile.streaks.contronym =
    contronym.streak;


  profile.streakLastActivity.contronym =
    contronym.lastActivity;



  /* CLUE-CARDS */

  const cluecards =
    calculatePATReleaseStreak(

      profile.completed.cluecards

    );


  profile.streaks.cluecards =
    cluecards.streak;


  profile.streakLastActivity.cluecards =
    cluecards.lastActivity;



  /* BUZZWORD */

  const buzzword =
    calculatePATReleaseStreak(

      profile.completed.molecular_bee,

      function (
        activity
      ) {

        return /buzzword/i.test(
          activity
        );

      }

    );


  profile.streaks.buzzword =
    buzzword.streak;


  profile.streakLastActivity.buzzword =
    buzzword.lastActivity;



  /* KOAN SU(1) */

  const koanOne =
    calculatePATReleaseStreak(

      profile.completed.koan_kaon,

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


  profile.streaks.koan_one =
    koanOne.streak;


  profile.streakLastActivity.koan_one =
    koanOne.lastActivity;



  /* KOAN SU(2) */

  const koanTwo =
    calculatePATReleaseStreak(

      profile.completed.koan_kaon,

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


  profile.streaks.koan_two =
    koanTwo.streak;


  profile.streakLastActivity.koan_two =
    koanTwo.lastActivity;

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


  const oldVersion =
    Number(
      oldProfile.version
      ||
      1
    );



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
     XP
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



  /* ========================================================
     GLOBAL WEEKLY STREAK

     V3 uses WEEKLY completion streaks.

     V1/V2 used different streak behavior, so those values
     are intentionally NOT imported as weekly streaks.
  ======================================================== */

  if (
    oldVersion >=
    3
  ) {

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

  }

  else {

    fresh.globalStreak =
      0;


    fresh.globalStreakLastWeek =
      null;

  }


  fresh.lastActiveDate =
    oldProfile.lastActiveDate
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
     COMPATIBILITY:
     OLD CLUE_CARD / CLUE_CARDS KEYS

     In case an earlier build ever stored completions under
     a mismatched clue-card key, recover them.
  ======================================================== */

  if (
    oldProfile.completed
    &&
    Array.isArray(
      oldProfile.completed.clue_cards
    )
  ) {

    fresh.completed.cluecards =
      [
        ...new Set(
          [

            ...fresh.completed.cluecards,

            ...oldProfile.completed
              .clue_cards
              .map(
                String
              )

          ]
        )
      ];

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

            const copy =
              {

                ...entry

              };


            /*
              Repair old mismatched game ID.
            */

            if (
              copy.gameId ===
              "clue_cards"
            ) {

              copy.gameId =
                "cluecards";

            }


            return copy;

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

          &&
          !Array.isArray(
            oldProfile.mastery[
              gameId
            ]
          )
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
     V3 STREAK DATA

     TRUST IT ONLY IF IT ALREADY CAME FROM V3.
  ======================================================== */

  if (
    oldVersion >=
    3
  ) {

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

    }



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

  }



  /* ========================================================
     V1 / V2 STREAK MIGRATION

     DO NOT COPY OLD DAILY STREAK NUMBERS.

     Reconstruct from actual completed releases.
  ======================================================== */

  else {

    rebuildPATReleaseStreaksFromCompletions(
      fresh
    );

  }



  /* ========================================================
     SAFETY REPAIR FOR V3

     If a V3 profile somehow has completed releases but
     missing release-streak metadata, reconstruct only those
     missing series.
  ======================================================== */

  if (
    oldVersion >=
    3
  ) {

    const reconstructed =
      createDefaultPATProfile();


    reconstructed.completed =
      JSON.parse(
        JSON.stringify(
          fresh.completed
        )
      );


    rebuildPATReleaseStreaksFromCompletions(
      reconstructed
    );


    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        if (
          !fresh.streakLastActivity[
            streakId
          ]

          &&
          reconstructed
            .streakLastActivity[
              streakId
            ]
        ) {

          fresh.streakLastActivity[
            streakId
          ] =
            reconstructed
              .streakLastActivity[
                streakId
              ];


          fresh.streaks[
            streakId
          ] =
            reconstructed
              .streaks[
                streakId
              ];

        }

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

   READING DOES NOT DISPATCH AN UPDATE EVENT.
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


      const normalized =
        migratePATProfile(
          parsed
        );


      /*
        Persist normalized V3 silently.

        Useful when new fields are added later.
      */

      persistPATProfile(
        normalized,
        false
      );


      return normalized;

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
   WEEKLY GLOBAL LEARNING LAB STREAK

   ADVANCES ONLY ON A NEW COMPLETION.
========================================================== */

function updatePATGlobalStreak(
  profile
) {

  const thisWeek =
    getPATWeekKey();


  const previousWeek =
    getPATPreviousWeekKey(
      thisWeek
    );


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
    lastWeek ===
    previousWeek
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



  /* SAME RELEASE */

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
     FALLBACK FOR NON-NUMBERED IDs
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
   MARK GAME PLAYED

   DOES NOT AWARD:
   XP
   GLOBAL STREAK
   RELEASE STREAK
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


  profile.lastPlayed[
    gameId
  ] =
    getPATDateString();


  savePATProfile(
    profile
  );


  return profile;

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


  profile.lastPlayed[
    gameId
  ] =
    getPATDateString();


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
     UNIQUE COMPLETION
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



    /* XP */

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



    /* GLOBAL WEEKLY STREAK */

    globalStreakAdvanced =
      updatePATGlobalStreak(
        profile
      );



    /* RELEASE STREAK */

    if (
      streakKey
    ) {

      streakAdvanced =
        updatePATSeriesStreak(

          profile,

          streakKey,

          completionId

        );

    }



    /* MASTERY */

    if (
      options.mastery
    ) {

      applyPATMasteryChanges(

        profile,

        gameId,

        options.mastery

      );

    }



    /* ACHIEVEMENTS */

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



    /* HISTORY */

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

    return {

      ...profile.progress[
        gameId
      ]

    };

  }


  return profile.progress[
    gameId
  ][
    key
  ];

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
    current +
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



  /* USERNAME */

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



  /* EMAIL */

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



  /* AVATAR */

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



  /* PROFILE CREATED */

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
   PLAN / SUBSCRIPTION

   PROTOTYPE ONLY
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
    level *
    PAT_XP_PER_LEVEL;


  const xpIntoLevel =
    safeXP -
    currentLevelStart;


  const xpNeeded =
    nextLevelXP -
    safeXP;


  const percent =
    Math.min(

      100,

      Math.max(

        0,

        (
          xpIntoLevel /
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

          return (

            new Date(
              b.completedAt
            )

            -

            new Date(
              a.completedAt
            )

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

    plan:
      profile.plan,


    /* XP / LEVEL */

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


    /* STREAKS */

    globalStreak:
      profile.globalStreak,

    globalStreakLastWeek:
      profile.globalStreakLastWeek,

    streaks:
      {

        ...profile.streaks

      },

    streakLastActivity:
      {

        ...profile.streakLastActivity

      },


    /* COMPLETIONS */

    totalCompleted:
      totalCompleted,

    completedByGame:
      completedByGame,

    recentCompletions:
      recentCompletions,


    /* MASTERY */

    mastery:
      JSON.parse(
        JSON.stringify(
          profile.mastery
        )
      ),


    /* CONTENT */

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

    return profile
      .completionHistory
      .slice();

  }


  return profile
    .completionHistory
    .filter(
      function (
        entry
      ) {

        return (
          entry.gameId ===
          gameId
        );

      }
    );

}



/* ==========================================================
   SIGNED IN
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
   SIGN OUT

   KEEPS LOCAL PROGRESS.
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

  isSignedIn:
    PATIsSignedIn,

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

  getProgress:
    getPATGameProgress,


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
     DEV
  ======================================================== */

  reset:
    resetPATProfile

};



/* ==========================================================
   INITIALIZE
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
