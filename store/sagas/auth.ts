import { all, delay, put, takeLatest, takeEvery, select } from "redux-saga/effects";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from "../actions/auth";
import { FIREBASE_SIGNUP_URI, FIREBASE_SIGNIN_URI, FIREBASE_REFRESH_TOKEN_URI, ASYNC_STORAGE_USER_DATA_KEY } from "../../constants";
import { FIREBASE_API_KEY } from "../../secrets";
import { AuthStates } from "../../types";

const saveDataToStorage = (token: string, refreshToken: string, userId: string, username: string, expiryDate: number): void => {
   console.log(444555, refreshToken)
   AsyncStorage.setItem(
      ASYNC_STORAGE_USER_DATA_KEY,
      JSON.stringify({
         token,
         refreshToken,
         userId,
         username,
         expiryDate: String(expiryDate)
   }));
   AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA_KEY).then(data => { console.log(999, data) });
};

function* tokenTimeoutWatcher() {
   yield takeEvery(actions.SET_TOKEN_TIMEOUT, function* ({ payload }: any) {
      yield delay(payload);
      AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
      yield put(actions.authenticateLogout());    
   });
}

function* authUserSaga() {
   yield takeLatest(actions.AUTHENTICATE, function* ({ payload }: any) {
      try {
         const { username, email, password, type } = payload;
         const uri: string = type === AuthStates.SignUp ? FIREBASE_SIGNUP_URI+FIREBASE_API_KEY : FIREBASE_SIGNIN_URI+FIREBASE_API_KEY;

         const apiPayload = type === AuthStates.SignUp ? {
            displayName: username,
            email,
            password,
            returnSecureToken: true
         } : {
            email,
            password,
            returnSecureToken: true
         };

         // @ts-ignore
         const response = yield fetch(uri, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(apiPayload)
         });

         if (!response.ok) {
            const errorResData = yield response.json();
            const errorId = errorResData.error.message;
            let message = "Something went wrong!";

            if (errorId === "EMAIL_EXISTS") {
               message = "This email exists already!";
            } else if (errorId === "EMAIL_NOT_FOUND") {
               message = "This email could not be found!";
            } else if (errorId === "INVALID_PASSWORD") {
               message = "This password is not valid!";
            }

            throw message;
         }

         const resData = yield response.json();
         
         const expiryDate: number = new Date().getTime() + parseInt(resData.expiresIn) * 1000;

         yield put(actions.authenticateSuccess({ 
            userId: resData.localId,
            token: resData.idToken,
            username: resData.displayName,
            refreshToken: resData.refreshToken,
            // expiryDate: parseInt(resData.expiresIn) * 1000,
            expiryDate: 5000
         }));

         saveDataToStorage(resData.idToken, resData.refreshToken, resData.localId, resData.displayName, expiryDate);

         yield put(actions.setTokenTimeout(parseInt(resData.expiresIn) * 1000));
      } catch(error) {
         yield put(actions.authenticateFailure(error));
      }
   });

   yield takeLatest(actions.AUTHENTICATE_REFRESH_TOKEN, function* ({ payload }: any) {
      try {
         const apiPayload = { 
            grant_type: "refresh_token",
            refresh_token: payload
         }

         // console.log(9999, payload)

         // @ts-ignore
         const response = yield fetch(FIREBASE_REFRESH_TOKEN_URI+FIREBASE_API_KEY, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(apiPayload)
         });

         if (!response.ok) {
            // @ts-ignore
            const errorResData = yield response.json();
            const errorId = errorResData.error.message;
            let message = "Something went wrong!";

            if (errorId === "EMAIL_EXISTS") {
               message = "This email exists already!";
            } else if (errorId === "EMAIL_NOT_FOUND") {
               message = "This email could not be found!";
            } else if (errorId === "INVALID_PASSWORD") {
               message = "This password is not valid!";
            }

            throw message;
         }

         // @ts-ignore
         const resData = yield response.json();
         const expiryDate: number = parseInt(resData.expires_in) * 1000;

         console.log(999, resData);

         yield put(actions.authenticateSuccess({ 
            userId: resData.user_id,
            token: resData.id_token,
            username: resData.displayName,
            refreshToken: resData.refresh_token,
            expiryDate
         }));

         saveDataToStorage(resData.id_token, resData.refresh_token, resData.user_id, resData.displayName, expiryDate);

         yield put(actions.setTokenTimeout(parseInt(resData.expiresIn) * 1000));
      } catch(error) {
         yield put(actions.authenticateFailure(error));
      }
   });
}

export default function* authSaga() {
   yield all([
      authUserSaga(),
      tokenTimeoutWatcher()
   ]);
}