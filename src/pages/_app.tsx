/* eslint-disable @typescript-eslint/ban-types */
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ToastContainer } from "react-toastify";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider>
      {<Component {...pageProps} />}
      <ToastContainer />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
