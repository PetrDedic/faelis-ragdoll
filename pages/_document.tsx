import { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

export default function Document(props: DocumentProps) {
  return (
    <Html lang={props.locale || "cs"} {...mantineHtmlProps}>
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
