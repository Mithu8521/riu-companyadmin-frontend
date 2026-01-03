// src/hooks/useAuthGuard.js
import { useEffect } from "react";
import { checkIsAuthenticated } from "../utils/UniversalFunction";
import { history } from "../_helpers/history";

export function useAuthGuard() {
  useEffect(() => {
    const run = async () => {
      try {
        const data = await checkIsAuthenticated();
        if (data.status === false) {
          localStorage.clear();
          history.push("/");
          return;
        }

        const currentRole = localStorage.getItem("role");
        if (!currentRole) {
          history.push("/");
          return;
        }

        if (currentRole === "super_admin" || currentRole === "sub_admin") {
          history.push("/");
          return;
        }
      } catch {
        localStorage.clear();
        history.push("/");
      }
    };

    run();
  }, []);
}
