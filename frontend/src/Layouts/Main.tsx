import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <Header className="fixed top-0" />
      <div className="flex w-full max-w-3xl flex-col items-center justify-center pt-12">
        {children}
      </div>
      <Footer className="" />
    </main>
  );
};

export default Main;
