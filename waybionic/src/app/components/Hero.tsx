import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-no-repeat bg-cover bg-top"
      style={{
        height: "calc(100dvh - var(--navbar-height))",
        minHeight: 0,
        backgroundImage: "url('/images/hero-bg2.png')",
        backgroundColor: "var(--color-deep-purple)",
      }}
      id="hero"
    >
      <div className="hero-artwork relative flex justify-center">
        <div className="relative w-full min-w-0 flex justify-center">
          {/*
            2) Paper note centered horizontally and scaled to fit container.
               height:auto preserves aspect ratio.
          */}
          <Image
            src="/images/waybionic_header.png"
            alt="WayBionic"
            width={5120}
            height={5120}
            priority
            className="relative z-10 w-full h-auto"
          />

          {/*
            3) Mascot, absolutely positioned and sized in % so it scales
               with the container. Adjust 'left', 'top', 'w-[X%]' to taste.
          */}
          <div className="astronaut-animate-container absolute z-11 left-[-6%] top-[28%] w-[25%] h-auto flex flex-col items-center">
            <Image
              src="/images/mascot.png"
              alt="Way Bionic Mascot"
              width={900}
              height={900}
              className="w-full h-auto"
              priority
            />
            <div className="astronaut-booster-flame">
              <div className="flame-inner" />
              <div className="flame-mid" />
              <div className="flame-outer" />
            </div>
          </div>
          <Image
            src="/images/hero_moon.png"
            alt="Moon"
            width={400}
            height={400}
            className="absolute z-5 left-[-14%] top-[80%] w-[50%] h-[70%]"
            priority
          />
          <Image
            src="/images/gear-temp.svg"
            alt="Gear"
            width={200}
            height={200}
            className="absolute z-1 -right-[5%] bottom-[20%] w-[18%] h-auto rotate-15 gear-rotate"
            priority
          />
        </div>
      </div>
    </section>
  );
}
