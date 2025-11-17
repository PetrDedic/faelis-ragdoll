import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { HeaderMenu } from "../components/HeaderMenu";
import { Roboto, Paytone_One } from "next/font/google";
import Footer from "../components/Footer";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "../styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";

// Initialize both fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const paytone = Paytone_One({
  subsets: ["latin"],
  weight: ["400"],
});

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <GoogleAnalytics gaId="G-H20VS0JX18" />
      <MantineProvider
        theme={{
          ...theme,
          fontFamily: roboto.style.fontFamily,
          headings: {
            // This will make headings use Paytone One by default
            fontFamily: paytone.style.fontFamily,
          },
        }}
      >
        <Head>
          <title>Faelis | Chovatelská stanice koček Ragdoll</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <HeaderMenu />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </MantineProvider>
    </>
  );
}
