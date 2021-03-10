import { UserGPSLocation } from "./types";

export default {
   headerColor: "#222",
   whiteText: "#fff",
   button: "#3d5afe",
   red: "#ef5350",
   green: "#26a69a"
}

export const ASYNC_STORAGE_USER_DATA_KEY: string = "userData";
export const FIREBASE_SIGNUP_URI: string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
export const FIREBASE_SIGNIN_URI: string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

export const FALLBACK_LOCATION: UserGPSLocation = {
   coords: {
         accuracy: 10,
         altitude: 80,
         altitudeAccuracy: -1,
         heading: -1,
         latitude: 45.923246, 
         longitude: 13.593676,
         speed: 0,
      },
      timestamp: Date.now(),
};