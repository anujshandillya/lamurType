import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import clsx from "clsx";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";
import {useAuth} from "@/api/use-auth";
import { useRouter } from "@/hooks/use-router";
import { useAuthContext } from "@/context/User/UserAuthContext";

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  const { preferences: { theme, fontFamily } } = usePreferenceContext()
  const { user, isLoading, error } = useAuth()
  const { router } = useRouter()
  const { dispatch } = useAuthContext()

  useEffect(() => {
    if (user?.isAuthenticated) {
      dispatch({ type: 'SET_USER', payload: user })
    }
  }, [user])
  
  return (
    <main 
      className={clsx(`font-${fontFamily} bg-${theme}-bg text-${theme}-font flex h-screen w-full flex-col items-center justify-center`)}
    >
      <Header className="fixed top-0" />
      <div className={clsx("flex w-full max-w-3xl flex-col items-center justify-center pt-12")}>
        {children}
      </div>
      <Footer className="absolute bottom-0" theme={theme} />
    </main>
  );
};

export default Main;
