import React, { useState } from "react";

export const ProfilePicContext = React.createContext();

export const ProfileProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(null);

  return (
    <ProfilePicContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </ProfilePicContext.Provider>
  );
};
