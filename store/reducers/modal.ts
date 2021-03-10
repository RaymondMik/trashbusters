import { ModalState } from "../../types";

import { TOGGLE_MODAL } from "../actions/modal";

const initialState: ModalState = {
   show: false
};

const modalReducer = (state: ModalState = initialState, action: any) => {
   switch (action.type) {
      case TOGGLE_MODAL:
         return {...state, show: !state.show};
      default:
         return {...state};
   }
}

export default modalReducer;