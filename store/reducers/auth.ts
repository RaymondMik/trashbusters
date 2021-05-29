import * as actions from "../actions/auth";
import { AuthState } from "../../types";

const initialState: AuthState = {
   userId: null,
   token: null,
   refreshToken: null,
   username: null,
   isLoading: false,
   hasError: null,
   expiryDate: null,
   didTryAutoLogin: false
}

const auth = (state = initialState, action: any) => {
   switch (action.type) {
      case actions.AUTHENTICATE:
         return {
            ...state,
            isLoading: true,
            hasError: null,
            
         }
      case actions.AUTHENTICATE_SUCCESS:
         return {
            ...state,
            userId: action.payload.userId,
            token: action.payload.token,
            refreshToken: action.payload.refreshToken,
            username: action.payload.username,
            isLoading: false,
            hasError: null,
            expiryDate: action.payload.expiryDate,
            didTryAutoLogin: true,
         }
      case actions.AUTHENTICATE_FAILURE:
         return {
            ...state,
            userId: null,
            token: null,
            refreshToken: null,
            username: null,
            isLoading: false,
            hasError: action.payload,
            didTryAutoLogin: true,
         }
      case actions.SET_DID_TRY_AUTO_LOGIN:
         return {
            ...state,
            didTryAutoLogin: true
         }
      case actions.AUTHENTICATE_LOGOUT:
         return initialState;
      default:
         return state;
   }
};

export default auth;