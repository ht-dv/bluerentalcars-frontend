import { reservationInitialState } from "./reservationInitialState";
import { types } from "../types";

export const reservationReducer = (state = reservationInitialState, action) => {
  if (action.type === types.SET_RESERVATION) {
    return {
      ...state,
      reservation: action.payload,
    };
  }
};
