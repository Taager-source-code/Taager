import { environment } from "src/environments/environment";
import { URLHandlerUtilityClass } from "./url-handler.utility";
export const onUserLogout = () => {
  localStorage.clear();
  if (!environment.LOCAL_ENVIRONMENT) {
    window.open(
      `${URLHandlerUtilityClass.getFullyQualifiedHostPath()}/auth/login`,
      "_self"
    );
  }
};