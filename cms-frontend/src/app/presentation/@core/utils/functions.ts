import { environment } from '@environments/environment';
export const onUserLogout = () => {
  if (environment.REDIRECT_URL) {
    localStorage.clear();
    window.open(environment.REDIRECT_URL, '_self');
  }
};