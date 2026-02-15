import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth, googleProvider } from "./firebaseConfig";

class AuthFireBaseService {
  async signUp(email: string, pass: string, name: string) {
    const newUser = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(newUser.user, { displayName: name });
    return newUser.user;
  }

  async login(email: string, pass: string) {
    const userLogin = await signInWithEmailAndPassword(auth, email, pass);
    return userLogin.user;
  }

  async loginGoogle() {
    const userGoogle = await signInWithPopup(auth, googleProvider);
    return userGoogle.user;
  }

  async logout() {
    await signOut(auth);
  }
}

export default new AuthFireBaseService();
