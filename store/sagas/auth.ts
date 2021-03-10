import { all, delay, put, takeLatest, takeEvery } from "redux-saga/effects";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from "../actions/auth";
import { FIREBASE_SIGNUP_URI, FIREBASE_SIGNIN_URI, ASYNC_STORAGE_USER_DATA_KEY } from "../../constants";
import { FIREBASE_API_KEY } from "../../secrets";
import { AuthStates } from "../../types";

const saveDataToStorage = (token: string, userId: string, username: string, expiryDate: number): void => {
   AsyncStorage.setItem(
      ASYNC_STORAGE_USER_DATA_KEY,
      JSON.stringify({
         token,
         userId,
         username,
         expiryDate: String(expiryDate)
   }));
};

function* tokenTimeoutWatcher() {
   yield takeEvery(actions.SET_TOKEN_TIMEOUT, function* ({ payload }: any) {
      yield delay(payload);
      AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
      yield put(actions.authenticateLogout());    
   });
}

function* createUserSaga() {
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
            expiryDate: parseInt(resData.expiresIn) * 1000,
         }));

         saveDataToStorage(resData.idToken, resData.localId, resData.displayName, expiryDate);

         yield put(actions.setTokenTimeout(parseInt(resData.expiresIn) * 1000));
      } catch(error) {
         yield put(actions.authenticateFailure(error));
      }
   });
}

export default function* authSaga() {
   yield all([
      createUserSaga(),
      tokenTimeoutWatcher()
   ]);
}