/* eslint-disable @typescript-eslint/ban-types */
import type { AppInitialProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import type { NextComponentType, NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import type { AppContextType } from "next/dist/shared/lib/utils";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  /* eslint-disable no-unused-vars */
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsTypeWithLayout<P> = AppInitialProps<P> & {
  Component: NextPageWithLayout;
};

type AppTypeWithLayout<P = {}> = NextComponentType<
  AppContextType,
  P,
  AppPropsTypeWithLayout<P>
>;

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
