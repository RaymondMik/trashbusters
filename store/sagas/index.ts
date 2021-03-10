import { all } from "redux-saga/effects";
import locationsSaga from "./locations";
import authSaga from "./auth";

// Sagas that will be called when the store is initialised
export default function* rootSaga() {
   yield all([
      locationsSaga(),
      authSaga()
   ]);
}