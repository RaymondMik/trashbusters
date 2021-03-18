import { LocationsState, UserGPSLocation } from "../../types";
import * as actions from "../actions/locations";
import { Location } from "../../types";

const initialState: LocationsState = {
   items: [],
   isLoading: false,
   isRefreshing: false,
   hasError: null,
   hasPhotoError: null,
   userGPSLocation: null,
   notificationToken: null
};

const locationsReducer = (state: LocationsState = initialState, action: any) => {
   switch (action.type) {
      case actions.GET_LOCATIONS: {
         return {
            ...state, 
            isLoading: !action.payload,
            isRefreshing: action.payload,
            hasError: null
         };
      }
      case actions.GET_LOCATIONS_SUCCESS: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: null,
            items: action.payload
         };
      }
      case actions.GET_LOCATIONS_FAILURE: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: action.payload
         };
      }
      case actions.ADD_LOCATION: {
         return {
            ...state, 
            isLoading: true,
            isRefreshing: false,
            hasError: null,
            hasPhotoError: null
         };
      }
      case actions.ADD_LOCATION_SUCCESS: {
         return { 
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: null
         };
      }
      case actions.ADD_LOCATION_FAILURE: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: true
         };
      }
      case actions.ADD_LOCATION_PHOTO_FAILURE: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: false,
            hasPhotoError: true
         };
      }
      case actions.UPDATE_LOCATION: {
         return {
            ...state, 
            isLoading: true,
            isRefreshing: false,
            hasError: null
         };
      }
      case actions.UPDATE_LOCATION_SUCCESS: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: null
         };
      }
      case actions.UPDATE_LOCATION_FAILURE: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: action.payload
         };
      }
      case actions.DELETE_LOCATION: {
         return {
            ...state, 
            isLoading: true,
            isRefreshing: false,
            hasError: null
         };
      }
      case actions.DELETE_LOCATION_SUCCESS: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: null
         };
      }
      case actions.DELETE_LOCATION_FAILURE: {
         return {
            ...state, 
            isLoading: false,
            isRefreshing: false,
            hasError: action.payload
         };
      }
      case actions.SET_USER_GPS_LOCATION: {
         return {
            ...state,
            userGPSLocation: action.payload
         }
      }
      case actions.ASSIGN_LOCATION_SUCCESS: {
         const { location, userId } = action.payload;
         console.log(333, location);

         const mappedItems = state.items.map((item: Location) => {
            if (item._id === location) {
               item.assignedTo = userId;
            }

            return item
         })
         return {
            ...state,
            items: mappedItems
         }
      }
      case actions.MARK_LOCATION_AS_DONE: {
         return {
            ...state,
            isLoading: true
         }
      }
      case actions.MARK_LOCATION_AS_DONE_SUCCESS: {
         const { location } = action.payload;
         
         const mappedItems = state.items.map((item: Location) => {
            if (item._id === location) {
               item.isOpen = false;
               item.assignedTo = "";
            }

            return item
         })
         return {
            ...state,
            items: mappedItems,
            isLoading: false
         }
      }
      case actions.MARK_LOCATION_AS_DONE_FAILURE: {
         return {
            ...state,
            isLoading: false,
            hasError: action.payload
         }
      }
      case actions.ADD_NOTIFICATION_TOKEN: {
         return {
            ...state,
            notificationToken: action.payload
         }
      }
      default:
         return state;
   }
}

export default locationsReducer;