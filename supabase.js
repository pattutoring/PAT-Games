/* ==========================================================
   PAT LEARNING LAB
   SUPABASE CONNECTION

   Shared cloud client for:
   - Authentication
   - Player profiles
   - Cloud progress
   - XP
   - Streaks
   - Game saves
========================================================== */


/* ==========================================================
   PROJECT SETTINGS
========================================================== */

const PAT_SUPABASE_URL =
  "https://qeajnvqnkrvhpywkvcsa.supabase.co";


const PAT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_M4X5KkoNWlgZn9k_4yM4Ww_w1Sh4cvu";



/* ==========================================================
   CREATE CLIENT

   Requires this script BEFORE supabase.js:

   https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
========================================================== */

if (
  !window.supabase
  ||
  typeof window.supabase.createClient !==
  "function"
) {

  console.error(
    "Supabase library did not load."
  );

}


const PATCloud =
  window.supabase.createClient(

    PAT_SUPABASE_URL,

    PAT_SUPABASE_PUBLISHABLE_KEY,

    {

      auth: {

        persistSession:
          true,

        autoRefreshToken:
          true,

        detectSessionInUrl:
          true

      }

    }

  );



/* ==========================================================
   GET CURRENT USER
========================================================== */

async function getPATCloudUser() {

  const {
    data,
    error
  } =
    await PATCloud.auth.getUser();


  if (
    error
  ) {

    return null;

  }


  return data.user || null;

}



/* ==========================================================
   GET CURRENT SESSION
========================================================== */

async function getPATCloudSession() {

  const {
    data,
    error
  } =
    await PATCloud.auth.getSession();


  if (
    error
  ) {

    return null;

  }


  return data.session || null;

}



/* ==========================================================
   SIGN UP
========================================================== */

async function signUpPATCloud(
  email,
  password,
  username
) {

  const {
    data,
    error
  } =
    await PATCloud.auth.signUp(
      {

        email:
          email,

        password:
          password,

        options: {

          data: {

            username:
              username

          }

        }

      }
    );


  if (
    error
  ) {

    throw error;

  }


  return data;

}



/* ==========================================================
   SIGN IN
========================================================== */

async function signInPATCloud(
  email,
  password
) {

  const {
    data,
    error
  } =
    await PATCloud.auth.signInWithPassword(
      {

        email:
          email,

        password:
          password

      }
    );


  if (
    error
  ) {

    throw error;

  }


  return data;

}



/* ==========================================================
   SIGN OUT
========================================================== */

async function signOutPATCloud() {

  const {
    error
  } =
    await PATCloud.auth.signOut();


  if (
    error
  ) {

    throw error;

  }


  return true;

}



/* ==========================================================
   AUTH CHANGE EVENT
========================================================== */

PATCloud.auth.onAuthStateChange(
  function (
    event,
    session
  ) {

    window.dispatchEvent(

      new CustomEvent(
        "pat-cloud-auth-changed",
        {

          detail: {

            event:
              event,

            session:
              session,

            user:
              session
              ?
                session.user
              :
                null

          }

        }
      )

    );

  }
);



/* ==========================================================
   PUBLIC CLOUD API
========================================================== */

window.PATCloud = {

  client:
    PATCloud,

  getUser:
    getPATCloudUser,

  getSession:
    getPATCloudSession,

  signUp:
    signUpPATCloud,

  signIn:
    signInPATCloud,

  signOut:
    signOutPATCloud

};



/* ==========================================================
   READY EVENT
========================================================== */

window.dispatchEvent(

  new CustomEvent(
    "pat-cloud-ready"
  )

);
