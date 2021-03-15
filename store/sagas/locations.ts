import { all, call, put, takeLatest, select } from "redux-saga/effects";
import * as Permissions from "expo-permissions";
import * as LocationPicker from "expo-location";
import firebase from "firebase";
import firebaseConfig from "../../firebase";
import { Location } from "../../types";
import * as actions from "../actions/locations";
import { toggleModal } from "../actions/modal"
import { FALLBACK_LOCATION } from "../../constants";
import { FIREBASE_URI } from "../../secrets";
import { fetchData } from "../../services";

const uploadAsFile = async(uri: string, userId: string) => {
   firebase.initializeApp(firebaseConfig);
   const response = await fetch(uri);
   const blob = await response.blob();

   const metadata = {
     contentType: "image/jpeg",
   };
 
   let name = new Date().getTime() + "-media.jpg"
   const ref = firebase
     .storage()
     .ref()
     .child(`${userId}/` + name)
 
   const task = ref.put(blob, metadata);
   return new Promise((resolve, reject) => {
      task.on("state_changed", 
         (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
         }, (err) => {
            reject(err)
         }, () => {
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            firebase
               .storage()
               .ref()
               .child(`${userId}/` + name).getDownloadURL()
               .then(fireBaseUrl => {
                  resolve(fireBaseUrl)
               })
         })
      });
 }

function* fetchLocationsSaga() {
   yield takeLatest(actions.GET_LOCATIONS, function* () {
      try {
         const { status } = yield Permissions.askAsync(Permissions.LOCATION);

         if (status !== "granted") {
           console.error("Permission not granted");
           yield put(actions.setUserGPSLocation(FALLBACK_LOCATION));
         } else {
            // @ts-ignore
            const location: any = yield LocationPicker.getCurrentPositionAsync({});
            yield put(actions.setUserGPSLocation(location));
         }
         // @ts-ignore
         const response: any = yield call(fetchData, { endpoint: `${FIREBASE_URI}/locations.json` });
         // @ts-ignore
         const resData: any = yield response.json();
     
         let locations: Location[] = [];

         for (let key in resData) {
            if (resData.hasOwnProperty(key)) {
               locations.push({ _id: key, ...resData[key] });
            }
         }
 
         if (!response.ok) {
            throw `A ${response.status} error occured`
         }

         yield put(actions.getLocationsSuccess(locations));
      } catch(error) {
         yield put(actions.getLocationsFailure(error));
      }
   });
}

function* addLocationSaga() {
   yield takeLatest(actions.ADD_LOCATION, function* ({ payload }: any) {
      try {
         const { token } = yield select(state => state.auth);
         const { location, image, navigation } = payload;

         // returns image URL if successfull
         // @ts-ignore
         const addImageResponse = yield uploadAsFile(image, location.createdBy);
  
         if (!addImageResponse) {
            yield put(actions.addLocationPhotoFailure("photo error"))
            return;
         }

         // @ts-ignore
         const response = yield call(fetchData, {
            endpoint: `${FIREBASE_URI}/locations.json?auth=${token}`,
            params: {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ ...location, pictures: [addImageResponse] })
            }
         });

         if (!response.ok) {
            throw `A ${response.status} error occured`
         }

         yield all([
            put(actions.getLocations()),
            put(actions.addLocationSuccess()),
         ]);
         navigation.navigate("Home");
      } catch(error) {
         yield put(actions.addLocationFailure(error));
      }
   });
}

function* updateLocationSaga() {
   yield takeLatest([
      actions.UPDATE_LOCATION,
      actions.ASSIGN_LOCATION,
      actions.MARK_LOCATION_AS_DONE
   ], function* ({ type, payload }: any) {
      try {
         const { token } = yield select(state => state.auth);
         const { location: { _id, title, description, createdBy, notificationToken }, userId } = payload;

         let body: string = JSON.stringify({});

         if (type === actions.UPDATE_LOCATION) {
            body = JSON.stringify({
               title,
               description
            })
         }

         if (type === actions.ASSIGN_LOCATION) {
            body = JSON.stringify({
               assignedTo: userId
            })
         }

         if (type === actions.MARK_LOCATION_AS_DONE) {
            body = JSON.stringify({
               isOpen: false,
               assignedTo: ""
            })
         }

         // @ts-ignore
         const response = yield call(fetchData, {
            endpoint: `${FIREBASE_URI}/locations/${_id}.json?auth=${token}`,
            params: {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json"
               },
               body
            }
         });

         if (!response.ok) {
            throw `A ${response.status} error occured`
         }

         yield put(actions.getLocations());

         if (type === actions.UPDATE_LOCATION && payload.navigation) {
            yield put(actions.updateLocationSuccess());
            payload.navigation.goBack();
         } 
         
         if (type === actions.ASSIGN_LOCATION) {
            yield all([
               put(actions.assignLocationSuccess(_id, payload.userId)),
               put(toggleModal())
            ]);
         } 
         
         if (type === actions.MARK_LOCATION_AS_DONE) {
            yield all([
               put(actions.markLocationAsDoneSuccess(_id)),
               put(toggleModal())
            ]);

            // @ts-ignore
            yield call(fetchData, {
               endpoint: "https://exp.host/--/api/v2/push/send",
               payload: {
                  method: "POST",
                  headers: {
                     "Accept": "application/json",
                     "Accept-Encoding": "gzip, deflate",
                     "Content-Type": "application/json"
                     },
                     body: JSON.stringify({
                     to: notificationToken,
                     title: "Location is done!",
                     body: `Your location ${title} was marked as done by ${createdBy}`
                  })
               }
            })
         }
         
      } catch(error) {
         if (type === actions.UPDATE_LOCATION && payload.navigation) {
            yield put(actions.updateLocationFailure(error));
         } else if (type === actions.ASSIGN_LOCATION) {
            yield put(actions.assignLocationFailure(error));
         } else {
            yield put(actions.markLocationAsDoneFailure(error));
         }
      }
   });
}

function* deleteLocationSaga() {
   yield takeLatest(actions.DELETE_LOCATION, function* ({payload}: any) {
      try {
         const { token } = yield select(state => state.auth);
         const { location, navigation } = payload;
         // @ts-ignore
         const response = yield call(fetchData, {
            endpoint: `${FIREBASE_URI}/locations/${location}.json?auth=${token}`,
            params: {
               method: "DELETE"
            }
         });

         if (!response.ok) {
            throw `A ${response.status} error occured`
         }

         yield all([
            put(toggleModal()),
            put(actions.getLocations()),
            put(actions.deleteLocationSuccess())
         ]);

         navigation.navigate("Home");
      } catch(error) {
         console.error(error)
         yield put(actions.deleteLocationFailure(error));
      }
   });
}

export default function* locationsSaga() {
   yield all([
      fetchLocationsSaga(),
      addLocationSaga(),
      updateLocationSaga(),
      deleteLocationSaga()
   ]);
}
