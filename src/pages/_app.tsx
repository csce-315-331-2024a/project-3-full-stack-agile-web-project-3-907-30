import "@/styles/globals.css";
import App, { AppContext, AppInitialProps } from "next/app";
import { AuthProvider, getGoogleAccountFromSession } from "../context/authContext";
import Layout from "./layout";
import { ElementType } from "react";
import { GoogleAccount } from "@/lib/types";

interface MyAppProps {
  Component: ElementType;
  pageProps: any;
  account: GoogleAccount;
}

/**
 * The MyApp component
 * 
 * @component
 * @param {MyAppProps} props The props of the component
 * @returns {JSX.Element} The JSX element
 */
export default function MyApp({ Component, pageProps, account }: MyAppProps) {
  return (
    <AuthProvider ssrAccount={account}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

/**
 * Get the initial props
 * 
 * @param {AppContext} appContext The app context
 * @returns {Promise<AppInitialProps>} The app initial props
 */
MyApp.getInitialProps = async (appContext: AppContext) => {
  if (appContext.router.isSsr === undefined) {
    const appProps: AppInitialProps = await App.getInitialProps(appContext);
    const ctx: any = appContext.ctx;
    const account = await getGoogleAccountFromSession(ctx);
    return { ...appProps, account: account };
  } else {
    const appProps: AppInitialProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }
};
