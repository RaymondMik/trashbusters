import { Location, UserGPSLocation } from "../../types";

export const GET_LOCATIONS: string = "GET_LOCATIONS";
export const GET_LOCATIONS_SUCCESS: string = "GET_LOCATIONS_SUCCESS";
export const GET_LOCATIONS_FAILURE: string = "GET_LOCATIONS_FAILURE";

export const ADD_LOCATION: string = "ADD_LOCATION";
export const ADD_LOCATION_SUCCESS: string = "ADD_LOCATION_SUCCESS";
export const ADD_LOCATION_FAILURE: string = "ADD_LOCATION_FAILURE";

export const ADD_LOCATION_PHOTO: string = "ADD_LOCATION_PHOTO";
export const ADD_LOCATION_PHOTO_SUCCESS: string = "ADD_LOCATION_PHOTO_SUCCESS";
export const ADD_LOCATION_PHOTO_FAILURE: string = "ADD_LOCATION_PHOTO_FAILURE";

export const UPDATE_LOCATION: string = "UPDATE_LOCATION";
export const UPDATE_LOCATION_SUCCESS: string = "UPDATE_LOCATION_SUCCESS"; 
export const UPDATE_LOCATION_FAILURE: string = "UPDATE_LOCATION_FAILURE";

export const DELETE_LOCATION: string = "DELETE_LOCATION";
export const DELETE_LOCATION_SUCCESS: string = "DELETE_LOCATION_SUCCESS";
export const DELETE_LOCATION_FAILURE: string = "DELETE_LOCATION_FAILURE";

export const ASSIGN_LOCATION: string = "ASSIGN_LOCATION";
export const ASSIGN_LOCATION_SUCCESS: string = "ASSIGN_LOCATION_SUCCESS";
export const ASSIGN_LOCATION_FAILURE: string = "ASSIGN_LOCATION_FAILURE";

export const MARK_LOCATION_AS_DONE: string = "MARK_LOCATION_AS_DONE";
export const MARK_LOCATION_AS_DONE_SUCCESS: string = "MARK_LOCATION_AS_DONE_SUCCESS";
export const MARK_LOCATION_AS_DONE_FAILURE: string = "MARK_LOCATION_AS_DONE_FAILURE";

export const SET_USER_GPS_LOCATION: string = "SET_USER_GPS_LOCATION";

export const ADD_NOTIFICATION_TOKEN: string = "ADD_NOTIFICATION_TOKEN";

export const getLocations = (refresh?: boolean) => ({
   type: GET_LOCATIONS,
   payload: refresh
});

export const getLocationsSuccess = (payload: Location[]) => ({
   type: GET_LOCATIONS_SUCCESS,
   payload
});

export const getLocationsFailure = (payload: string) => ({
   type: GET_LOCATIONS_FAILURE,
   payload
});

export const addLocation = (location: any, image: any, navigation: any) => ({
   type: ADD_LOCATION,
   payload: {
      location,
      image,
      navigation
   }
});

export const addLocationSuccess = () => ({
   type: ADD_LOCATION_SUCCESS
});

export const addLocationFailure = (payload: string) => ({
   type: ADD_LOCATION_FAILURE,
   payload
});

export const addLocationPhoto = () => ({
   type: ADD_LOCATION_PHOTO,
});

export const addLocationPhotoFailure = (payload: string) => ({
   type: ADD_LOCATION_PHOTO_FAILURE,
   payload
});

export const updateLocation = (location: any, navigation: any) => ({
   type: UPDATE_LOCATION,
   payload: {
      location,
      navigation
   }
});

export const updateLocationSuccess = () => ({
   type: UPDATE_LOCATION_SUCCESS
});

export const updateLocationFailure = (payload: string) => ({
   type: UPDATE_LOCATION_FAILURE,
   payload
});

export const deleteLocation = (location: string, navigation: any) => ({
   type: DELETE_LOCATION,
   payload: {
      location,
      navigation
   }
});

export const deleteLocationSuccess = () => ({
   type: DELETE_LOCATION_SUCCESS
});

export const deleteLocationFailure = (payload: string) => ({
   type: DELETE_LOCATION_FAILURE,
   payload
});

export const setUserGPSLocation = (payload: UserGPSLocation) => ({
   type: SET_USER_GPS_LOCATION,
   payload
});

export const assignLocation = (location: Location, userId: string) => ({
   type: ASSIGN_LOCATION,
   payload: {
      location,
      userId
   }
});

export const assignLocationSuccess = (location: string, userId: string) => ({
   type: ASSIGN_LOCATION_SUCCESS,
   payload: {
      location,
      userId
   }
});

export const assignLocationFailure = (payload: string) => ({
   type: ASSIGN_LOCATION_FAILURE,
   payload
});

export const markLocationAsDone = (location: Location) => ({
   type: MARK_LOCATION_AS_DONE,
   payload: {
      location
   }
});

export const markLocationAsDoneSuccess = (location: string) => ({
   type: MARK_LOCATION_AS_DONE_SUCCESS,
   payload: {
      location
   }
});

export const markLocationAsDoneFailure = (payload: string) => ({
   type: MARK_LOCATION_AS_DONE_FAILURE,
   payload: {}
});

export const addNotificationToken = (payload: string) => ({
   type: ADD_NOTIFICATION_TOKEN,
   payload
});
