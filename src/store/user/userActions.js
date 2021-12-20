/**User ile alakali state'i degistirecek methodlar tanimlanir */

import { types } from "../types";

/**Userin basarili bir sekilde giris yapmasi durumunda cagirilir */
export const loginSuccess = (user) => ({
  type: types.LOGIN_SUCCESS,
  payload: user,
});

/**Userin basarisiz login girisimlerinde cagirilir */
export const loginFailed = () => ({
  type: types.LOGIN_FAILED,
});

/**Userin logout isleminde cagirilir */
export const logout = () => ({
  type: types.LOGOUT,
});
