import Head from "next/head";
import { FC } from "react";
import type { WithContext, Thing } from "schema-dts";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: WithContext<Thing> | Array<WithContext<Thing>>;
  children?: React.ReactNode;
}

const SEO: FC<SEOProps> = ({
  title = "Faelis | Chovatelská stanice koček Ragdoll Praha",
  description = "Chovatelská stanice Faelis z Prahy nabízí zdravá koťata Ragdoll se 100% originálním rodokmenem. Prohlédněte si naše kočky, kocoury a aktuální vrhy.",
  keywords = "ragdoll koťata na prodej, koťata ragdoll, chovatelská stanice ragdoll, ragdoll praha, ragdoll s rodokmenem, ragdoll česká republika, zdravá koťata ragdoll, ragdoll chov",
  ogImage = "/og.png",
  ogUrl,
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  structuredData,
  children,
}) => {
  // Build robots value
  const robotsContent = [];
  if (noIndex) robotsContent.push("noindex");
  if (noFollow) robotsContent.push("nofollow");

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots Control */}
      {robotsContent.length > 0 && (
        <meta name="robots" content={robotsContent.join(", ")} />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Viewport (ensuring it's configurable per page if needed) */}
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />

      {/* Favicon */}
      <link rel="shortcut icon" href="/favicon.svg" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              Array.isArray(structuredData) ? structuredData : [structuredData]
            ),
          }}
        />
      )}

      {/* Additional head elements passed as children */}
      {children}
    </Head>
  );
};

export default SEO;
