import React, { createContext, useEffect, useReducer, useState } from "react";
import { reducer } from "./MenuContextReducers";

const initialState = {
  menus: JSON.parse(localStorage.getItem("menu")) || [],
  role: localStorage.getItem("role"),
};


export const PermissionMenuContext = createContext(initialState);

export default function PermissionBasedMenuProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [UserMenuList, setUserMenuList] = useState(state?.menus);
  const [userPermissionList, setUserPermissionList] = useState([]);

  useEffect(() => {
    const getPermissions = (UserMenuList) => {
      // setUserPermissionList([]);
      const permissionsArray = [];
      UserMenuList.forEach((item) => {
        permissionsArray.push(...item.permissions); // push main menu permissions
        item.sub_menu.forEach((subItem) => {
          permissionsArray.push(...subItem.permissions); // push sub-menu permissions
        });
      });
      setUserPermissionList(permissionsArray);
      dispatch({ type: "Add_Menu", payload: JSON.parse(localStorage.getItem("menu")) });
      dispatch({ type: "Add_Role", payload: localStorage.getItem("role") });
    };
    getPermissions(UserMenuList);
  }, [localStorage.getItem("menu"), localStorage.getItem("role")]);

  return (
    <PermissionMenuContext.Provider value={{ state, dispatch, userPermissionList }}>
      {children}
    </PermissionMenuContext.Provider>
  );
}
