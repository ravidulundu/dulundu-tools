import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ALL_TOOLS } from "../constants";
import { SEO } from "./SEO";

export const SeoManager: React.FC = () => {
  const location = useLocation();

  const currentTool = useMemo(() => {
    return ALL_TOOLS.find((tool) => tool.path === location.pathname);
  }, [location.pathname]);

  const jsonLd = useMemo(() => {
    if (currentTool) {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: currentTool.name,
        description: currentTool.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        keywords: [
          "Developer Tools",
          "Web Development",
          "Online Utilities",
          ...(currentTool.tags || []),
          currentTool.category,
        ].join(", "),
      };
    }

    if (location.pathname === "/") {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Dulundu Tools",
        description:
          "The ultimate suite of developer utilities. Beautify, convert, generate, and debug with our collection of 100+ free tools.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        keywords:
          "Developer Tools, Web Development, Online Utilities, JSON Formatter, Base64 Converter, SQL Formatter",
      };
    }

    return null;
  }, [currentTool, location.pathname]);

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
      {currentTool ? (
        <SEO
          title={currentTool.name}
          description={currentTool.description}
          keywords={
            currentTool.tags?.join(", ") ||
            `${currentTool.name}, ${currentTool.category}, developer tools, online utility`
          }
        />
      ) : location.pathname === "/" ? (
        <SEO />
      ) : (
        <SEO title="Page Not Found" />
      )}
    </>
  );
};
