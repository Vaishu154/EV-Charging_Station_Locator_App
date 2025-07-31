export default {
  expo: {
    name: "ev-charging-app",
    slug: "ev-charging-app",
    version: "1.0.0",
    orientation: "portrait",
    sdkVersion: "52.0.0", 
   // icon: "./assets/icon.png", // if you have one
    splash: {
      //image: "./assets/splash.png", // optional
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      // 🔐 Firebase Keys
      FIREBASE_API_KEY: "AIzaSyD-5VSZVmsTvrHv-rvifLRWSOIzBGhkaYI",
      FIREBASE_AUTH_DOMAIN: "ev-charge-hub-4dbbb.firebaseapp.com",
      FIREBASE_PROJECT_ID: "ev-charge-hub-4dbbb",
      FIREBASE_STORAGE_BUCKET: "ev-charge-hub-4dbbb.appspot.com",
      FIREBASE_MESSAGING_SENDER_ID: "992947424173",
      FIREBASE_APP_ID: "1:992947424173:web:8b24e6c5526ad09ab22f24",
      FIREBASE_MEASUREMENT_ID: "G-0Y4RVQ2RR6",

      // 🗺️ If using Google Maps or other APIs
      GOOGLE_API_KEY: "AIzaSyD2Q6ZU376FfXEz9BREFaNOWAlvJ2ncqIY"
    }
  }
};
