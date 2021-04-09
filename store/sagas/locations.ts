import { all, call, put, takeLatest, select } from "redux-saga/effects";
import * as Permissions from "expo-permissions";
import * as LocationPicker from "expo-location";
import firebaseInit from "../../firebase";
import { Location } from "../../types";
import * as actions from "../actions/locations";
import { toggleModal } from "../actions/modal"
import { FALLBACK_LOCATION } from "../../constants";
import { FIREBASE_URI } from "../../secrets";
import { fetchData } from "../../services";
import { LocationScreenStatus } from "../../types";
import { getImagePath } from "../../utils";

const uploadImage = async(uri: string, userId: string) => {
   const response = await fetch(uri);
   const blob = await response.blob();

   const metadata = {
     contentType: "image/jpeg",
   };
 
   let name = new Date().getTime() + "-media.jpg"
   const ref = firebaseInit
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
         firebaseInit
            .storage()
            .ref()
            .child(`${userId}/` + name).getDownloadURL()
            .then(fireBaseUrl => {
               resolve(fireBaseUrl)
            })
      })
   });
}

const deleteImage = async (filePath: string) => {
   await firebaseInit
      .storage()
      .ref()
      .child(filePath)
      .delete()
}

function* uploadImageSaga() {
   yield takeLatest(actions.ADD_LOCATION_PHOTO, function* ({ payload }: any) {
      try {
         const { image } = yield select(state => state.locations);
         const { uri, userId } = payload;

         if (image) {
            const imagePath = getImagePath(image, userId);
            yield put(actions.deleteLocationPhoto(imagePath));
         }

         // @ts-ignore
         const addImageResponse = yield uploadImage(uri, userId);
  
         yield put(actions.addLocationPhotoSuccess(addImageResponse))
      } catch (e) {
         yield put(actions.addLocationPhotoFailure(e))
      }
   });
}

function* deleteImageSaga() {
   yield takeLatest(actions.DELETE_LOCATION_PHOTO, function* ({ payload }: any) {
      try {
         // @ts-ignore
         const deleteImageResponse = yield deleteImage(payload);
  
         yield put(actions.deleteLocationPhotoSuccess(deleteImageResponse))
      } catch (e) {
         yield put(actions.deleteLocationPhotoFailure(e))
      }
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

         // @ts-ignore
         const response = yield call(fetchData, {
            endpoint: `${FIREBASE_URI}/locations.json?auth=${token}`,
            params: {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ ...location, pictureBefore: image })
            }
         });

         if (!response.ok) {
            throw `A ${response.status} error occured`
         }

         // @ts-ignore
         const newItem: any = yield response.json();

         yield all([
            put(actions.getLocations()),
            put(actions.addLocationSuccess()),
         ]);

         // navigate to home only for report location
         if (!location.assignedTo) {
            navigation.navigate("Home");
         } else {
            const _id = newItem.name

            // @ts-ignore
            const locationResponse: any = yield call(fetchData, { endpoint: `${FIREBASE_URI}/locations/${_id}.json` });
            // @ts-ignore
            const resData = yield locationResponse.json();
            const location = { ...resData, _id }

            navigation.navigate("Location", {
               title: location.title,
               data: location,
               status: LocationScreenStatus.View 
            })
         }
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
 
         let body: string = JSON.stringify({});

         if (type === actions.UPDATE_LOCATION) {
            body = JSON.stringify({
               title: payload.location.title,
               description: payload.location.description
            })
         }

         if (type === actions.ASSIGN_LOCATION) {
            body = JSON.stringify({
               assignedTo: payload.userId
            })
         }

         if (type === actions.MARK_LOCATION_AS_DONE) {
            // returns image URL if successfull
            // @ts-ignore
            const addImageResponse = yield uploadImage(payload.location.image, payload.location._id);

            if (!addImageResponse) {
               yield put(actions.addLocationPhotoFailure("photo error"))
               return;
            }

            body = JSON.stringify({
               isOpen: false,
               assignedTo: "",
               pictureAfter: addImageResponse
            })
         }

         // @ts-ignore
         const response = yield call(fetchData, {
            endpoint: `${FIREBASE_URI}/locations/${payload.location._id}.json?auth=${token}`,
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
               put(actions.assignLocationSuccess(payload.location._id, payload.userId)),
               put(toggleModal())
            ]);
         } 
         
         if (type === actions.MARK_LOCATION_AS_DONE) {
            yield all([
               put(actions.markLocationAsDoneSuccess(payload.location._id)),
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
                     to: payload.location.notificationToken,
                     title: "Location is done!",
                     body: `Your location ${payload.location.title} was marked as done by ${payload.location.createdBy}`
                  })
               }
            })
         }
         
      } catch(error) {
         if (type === actions.UPDATE_LOCATION && payload.navigation) {
            yield put(actions.updateLocationFailure(error));
         } else if (type === actions.ASSIGN_LOCATION) {
            yield put(actions.assignLocationFailure(error));
         } else if (type === actions.MARK_LOCATION_AS_DONE) {
            yield put(actions.markLocationAsDoneFailure(error));
         }
      }
   });
}

function* deleteLocationSaga() {
   yield takeLatest(actions.DELETE_LOCATION, function* ({payload}: any) {
      try {
         const { token, userId } = yield select(state => state.auth);
         const { items } = yield select(state => state.locations);
         const { location, navigation } = payload;

         const locationData = items.find((item: Location) => item._id === location);

         if (locationData.pictureAfter) {
            const pictureBeforePath = getImagePath(locationData.pictureBefore, userId);
            const pictureAfterPath = getImagePath(locationData.pictureAfter, userId);

            yield all([
               put(actions.deleteLocationPhoto(pictureBeforePath)),
               put(actions.deleteLocationPhoto(pictureAfterPath))
            ]);
         } else {
            const pictureBeforePath = getImagePath(locationData.pictureBefore, userId);

            yield put(actions.deleteLocationPhoto(pictureBeforePath));
         }

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
      deleteLocationSaga(),
      uploadImageSaga(),
      deleteImageSaga()
   ]);
}
