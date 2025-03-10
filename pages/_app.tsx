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
        <title>Mantine Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
        <style>body</style>
      </Head>
      <HeaderMenu />
      <Component {...pageProps} />
      <Footer />
    </MantineProvider>
  );
}
