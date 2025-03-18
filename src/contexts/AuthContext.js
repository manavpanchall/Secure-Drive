import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  console.log("AuthProvider rendered"); // Debugging
  console.log("Current User in AuthProvider:", currentUser); // Debugging

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed. User:", user); // Debugging
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login: (email, password) => auth.signInWithEmailAndPassword(email, password),
    signup: (email, password, username) =>
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          return userCredential.user.updateProfile({
            displayName: username,
          });
        }),
    logout: () => auth.signOut(),
    resetPassword: (email) => auth.sendPasswordResetEmail(email),
    updateEmail: (email) => currentUser.updateEmail(email),
    updatePassword: (password) => currentUser.updatePassword(password),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}