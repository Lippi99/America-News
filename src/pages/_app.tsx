import type { AppProps } from "next/app";
import { globalStyles } from "../../styles/globals";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { Layout } from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      {globalStyles()}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextAuthProvider>
  );
}

export default MyApp;
