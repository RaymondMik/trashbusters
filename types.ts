export interface RootState {
   locations: LocationsState;
   auth: AuthState;
   modal: ModalState;
}

export interface Location {
   _id: string;
   createdBy: string,
   title: string;
   description: string;
   pictureBefore: string;
   pictureAfter: string;
   latitude: string;
   longitude: string;
   assignedTo: string | null;
   isOpen: boolean;
   notificationToken: string | null;
};

export interface UserGPSLocation {
   coords: {
      accuracy: number | null;
      altitude: number | null;
      altitudeAccuracy: number | null;
      heading: number | null;
      latitude: number;
      longitude: number;
      speed: number | null;
    };
    timestamp: number | null;
}

export interface LocationsState {
   items: Location[];
   isLoading: boolean;
   isRefreshing: boolean;
   hasError: string | null;
   hasPhotoError: string | null;
   userGPSLocation: UserGPSLocation | null;
   notificationToken: string | null;
   image: string | null;
};

export interface AuthState {
   userId: string;
   token: string | null;
   username: string | null;
   isLoading: boolean;
   hasError: string | null;
   expiryDate: number | null;
   didTryAutoLogin: boolean;
};

export interface ModalState {
   show: boolean;
}

export interface Navigation {
   route: any,
   navigation: {
      navigate: (route: string, params?: any) => void,
      setOptions: (params: any) => void,
      setParams: (params: any) => void,
      addListener: (type: string, params: () => void) => void,
      toggleDrawer: () => void
   }
}

export enum LocationScreenStatus {
   View = "view",
   Create = "create",
   CreateAndAssign = "create-and-assign",
   Edit = "edit"
}

export enum AuthStates {
   SignUp = "signup",
   SignIn = "signin"
}

export enum ImageLabels {
   Before = "before",
   After = "after"
}

export enum LocationsListFilters {
   All = "all",
   Assigned = "assigned",
   Done = "done"
}
