import { authenticationService } from './authentication';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && localStorage.getItem("token")) {
        return { Authorization: `Bearer ${localStorage.getItem("token")}` };
    } else {
        return {};
    }
}