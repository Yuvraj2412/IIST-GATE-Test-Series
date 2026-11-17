"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import { setUID, fetchUserDetails, clearAuth } from "@/libs/features/auth/authSlice";
import store from "@/libs/store";
import { getAuth, onAuthStateChanged } from "@/libs/supabase/authClient";
import { useEffect } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en" className={`custom-scrollbar`}>
        <body>
          <ProgressBar
            height="3px"
            color="#674cee"
            options={{ showSpinner: false }}
            shallowRouting
          />
          <LoadAuth />
          <Toaster />
          {children}
        </body>
      </html>
    </Provider>
  );
}

function LoadAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUID(user.uid));
        dispatch(fetchUserDetails(user.uid));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
