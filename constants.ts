import { UserGPSLocation } from "./types";

export default {
   headerColor: "#222",
   white: "#fff",
   black: "#000",
   lightGreyBg: "#F4F4F4",
   lightGrey: "#D0D0D0",
   grey: "#ccc",
   darkGrey: "#606060",
   button: "#03A9F4",
   red: "#ef5350",
   green: "#009688"
};

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