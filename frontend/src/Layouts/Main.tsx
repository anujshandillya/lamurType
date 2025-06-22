import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import clsx from "clsx";
import { usePreferenceContext } from "@/context/Preference/PreferenceContext";

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  const { preferences: { theme, fontFamily } } = usePreferenceContext()
  
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
