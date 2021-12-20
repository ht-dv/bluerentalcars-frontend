import React, { useReducer } from "react";
import { userReducer } from "./user/userReducer";
import { userInitialState } from "./user/userInitialState";
import { reservationReducer } from "./reservation/reservationReducer";
import { reservationInitialState } from "./reservation/reservationInitialState";
import { vehiclesInitialState } from "./vehicles/vehiclesInitialState";
import { vehiclesReducer } from "./vehicles/vehiclesReducer";

/**Merkezi state olusturuldu */
const Store = React.createContext();
Store.displayName = "Store";

/**Merkezi state'in diger componentlerde kullanilmasini kolaylastirmak icin tanimladik */
export const useStore = () => React.useContext(Store);

export const StoreProvider = ({ children }) => {
  const [userState, dispatchUser] = useReducer(userReducer, userInitialState);

  const [reservationState, dispatchReservation] = useReducer(
    reservationReducer,
    reservationInitialState
  );

  const [vehiclesState, dispatchVehicles] = useReducer(
    vehiclesReducer,
    vehiclesInitialState
  );

  return (
    <Store.Provider
      value={{
        userState,
        dispatchUser,
        reservationState,
        dispatchReservation,
        vehiclesState,
        dispatchVehicles,
      }}
    >
      {children}
    </Store.Provider>
  );
};
