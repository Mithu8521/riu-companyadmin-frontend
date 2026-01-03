import React, { useState } from "react";
import { authenticationService } from "../_services/authentication";
export const PermissionContext = React.createContext();


export const PermissionProvider = ({ children }) => {
  let currentUser = authenticationService.currentUserSubject.getValue()

  const items = currentUser?.data?.menu || [];

  function getPermissions(items, permissionsArray = []) {
    if (items.length > 0) {
      for (const item of items) {
        if (item.permissions) {
          permissionsArray.push(...item.permissions);
        }
        if (item.sub_menu) {
          getPermissions(item?.sub_menu, permissionsArray);
        }
      }
    }
    return permissionsArray;
  }
  const permission = getPermissions(items);
  const menu = items.flatMap((item) => item?.caption);
  const [permissions] = useState(permission);
  const [menus] = useState(items);
  const [menuList] = useState(menu);


  return (
    <PermissionContext.Provider
      value={{
        permissions,
        menus,
        menuList,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
