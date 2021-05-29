export const AUTHENTICATE: string = "AUTHENTICATE";
export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const AUTHENTICATE_FAILURE: string = "AUTHENTICATE_FAILURE";
export const AUTHENTICATE_LOGOUT: string = "AUTHENTICATE_LOGOUT";
export const AUTHENTICATE_REFRESH_TOKEN: string = "AUTHENTICATE_REFRESH_TOKEN";
export const SET_TOKEN_TIMEOUT: string = "SET_TOKEN_TIMEOUT";
export const SET_DID_TRY_AUTO_LOGIN: string = "SET_DID_TRY_AUTO_LOGIN";

export const authenticate = (payload: any) => ({
   type: AUTHENTICATE,
   payload
});

export const authenticateSuccess = (payload: any) => {
   return {
      type: AUTHENTICATE_SUCCESS,
      payload
   };
};

export const authenticateFailure = (payload: any) => ({
   type: AUTHENTICATE_FAILURE,
   payload
});

export const authenticateLogout = () => ({
   type: AUTHENTICATE_LOGOUT
});

export const authenticateRefreshToken = (payload: string) => {
   return {
      type: AUTHENTICATE_REFRESH_TOKEN,
      payload
   };
};

export const setTokenTimeout = (payload: number) => ({
   type: SET_TOKEN_TIMEOUT,
   payload
});

export const setDidTryAutoLogin = () => ({
   type: SET_DID_TRY_AUTO_LOGIN
});
