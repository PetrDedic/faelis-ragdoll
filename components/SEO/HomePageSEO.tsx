import SEO from "../SEO";

const HomePageSEO = () => {
  return (
    <SEO
      title="Faelis | Chovatelská stanice koček Ragdoll"
      description="Jsme nejlepší a jediná chovatelská stanice plemene Ragdoll v České Republice. Bezpečné a útulné místo pro kočky s dlouholetou praxí a zkušeností."
      keywords="ragdoll, kočky, chovatelská stanice, Faelis, Praha, kocouři, koťata, chov koček, ragdoll česká republika"
      ogImage="/og.png"
      ogUrl="https://faelis.cz"
      ogType="website"
      twitterCard="summary_large_image"
      canonicalUrl="https://faelis.cz"
    >
      {/* Structured data for local business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Faelis - Chovatelská stanice koček Ragdoll",
          image: "https://faelis.cz/images/Logo_v2.svg",
          description:
            "Jsme nejlepší a jediná chovatelská stanice plemene Ragdoll v České Republice.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Nad Nádrží 433/16",
            addressLocality: "Praha",
            postalCode: "10300",
            addressCountry: "CZ",
          },
          telephone: "+420602278682",
          email: "marta@ragdolls.cz",
          url: "https://faelis.cz",
          sameAs: [
            "https://www.facebook.com/faelis.cz",
            "https://www.instagram.com/faelis.cz",
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        })}
      </script>
    </SEO>
  );
};

export default HomePageSEO;
