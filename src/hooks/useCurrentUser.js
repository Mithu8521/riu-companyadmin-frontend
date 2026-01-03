// src/hooks/useCurrentUser.js
import { useMemo } from "react";

export function useCurrentUser() {
  const currentUser = useMemo(() => {
    try {
      const cu = localStorage.getItem("currentUser");
      return cu ? JSON.parse(cu) : null;
    } catch {
      return null;
    }
  }, []);

  const currentUserId = currentUser?.id ?? null;
  const profilePicture = currentUser?.profile_picture ?? null;
  const firstName = currentUser?.first_name ?? "";
  const lastName = currentUser?.last_name ?? "";
  const position = currentUser?.position ?? null;

  return {
    currentUser,
    currentUserId,
    profilePicture,
    firstName,
    lastName,
    position,
  };
}
