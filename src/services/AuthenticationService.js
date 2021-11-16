import { BehaviorSubject } from "rxjs";
import axios from "axios";
import { history } from "helpers/history";
import { Config } from "config/Config";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

class AuthenticationService {
  constructor() {
    this.currentUser = currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return currentUserSubject.value;
  }

  async login(details) {
    let user = await axios.post(`${Config.API_URL}/login`, details, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (user.data && user.status === 200) {
      localStorage.setItem("currentUser", JSON.stringify(user.data));
      currentUserSubject.next(user.data);
      history.push("/devices"); //redirect to devices if status is ok
      window.location.reload();
    }
  }

  async logout() {
    // remove user from local storage
    localStorage.removeItem("currentUser");
    currentUserSubject.next(null);
  }
}

export const AuthService = new AuthenticationService();
