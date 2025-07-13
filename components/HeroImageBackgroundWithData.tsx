import React from "react";
import { HeroImageBackground } from "./HeroImageBackground";

interface HeroImageBackgroundWithDataProps {
  heading: string;
  highlightedText?: string;
  subtext?: string;
  buttons?: {
    label: string;
    variant?: string;
    onClick?: () => void;
  }[];
  backgroundPosition?: string;
  backgroundImage?: string;
}

export function HeroImageBackgroundWithData({
  heading,
  highlightedText,
  subtext,
  buttons,
  backgroundPosition,
  backgroundImage,
}: HeroImageBackgroundWithDataProps) {
  return (
    <HeroImageBackground
      heading={heading}
      highlightedText={highlightedText}
      subtext={subtext}
      buttons={buttons}
      backgroundImage={backgroundImage}
      backgroundPosition={backgroundPosition}
    />
  );
}
