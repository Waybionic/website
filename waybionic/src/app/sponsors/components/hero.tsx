export default function Hero() {
  return (
    <section
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: "calc(100dvh - var(--navbar-height))",
        backgroundImage: "url('/images/starrybackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* left: moon + rocket */}
      <img
        src="/images/MoonLeft.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute bottom-0 left-0 pointer-events-none select-none"
        style={{
          width: "330px",
          transform: "translate(-15%, 50%)",
          zIndex: 10,
        }}
      />
      <img
        src="/images/rocket.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute bottom-0 left-0 pointer-events-none select-none"
        style={{
          width: "416px",
          transform: "translate(5%, calc(40% - 10px)) rotate(10deg)",
          transformOrigin: "bottom center",
          zIndex: 11,
        }}
      />

      {/* right: moon + pencilbionic */}
      <img
        src="/images/MoonRight.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute bottom-0 right-0 pointer-events-none select-none"
        style={{
          width: "260px",
          transform: "translate(15%, 50%)",
          zIndex: 10,
        }}
      />
      <img
        src="/images/pencilbionic.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute bottom-0 right-0 pointer-events-none select-none"
        style={{
          width: "329px",
          transform: "translate(-15%, 15%) rotate(-15deg)",
          zIndex: 11,
        }}
      />

      {/* sparkle decorations */}
      <span className="absolute top-[12%] left-[8%]  text-3xl select-none pointer-events-none" style={{ color: "#e0b8ff", opacity: 0.9 }}>✦</span>
      <span className="absolute top-[20%] left-[40%] text-base select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.5 }}>✦</span>
      <span className="hidden sm:block absolute top-[60%] left-[5%]  text-5xl select-none pointer-events-none" style={{ color: "#a0c8ff", opacity: 0.7 }}>✦</span>
      <span className="absolute top-[75%] left-[30%] text-sm  select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.4 }}>✦</span>
      <span className="absolute top-[8%]  right-[32%] text-xl select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.35 }}>✦</span>
      <span className="absolute top-[45%] right-[8%] text-2xl select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.3 }}>✦</span>

      {/* content */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center"
        style={{ paddingTop: "7vh", paddingBottom: "12vh" }}
      >
        {/* badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-6 text-[11px] font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(220,210,245,0.85)",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          <span style={{ fontSize: 9 }}>✦</span> Sponsors
        </div>

        {/* heading */}
        <h1
          className="text-white leading-[1.08] mb-6"
          style={{
            fontFamily: "var(--font-epilogue), sans-serif",
            fontSize: "clamp(2rem, 8vw, 90px)",
            fontWeight: 900,
          }}
        >
          Shaping the Future of<br className="hidden sm:block" /> Healthcare Beyond Earth
        </h1>

        {/* subtext */}
        <p
          className="text-lg leading-relaxed font-semibold max-w-[700px]"
          style={{ color: "#DAD4E3", fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          Here at WayBionic, we&apos;re committed to expanding access to{" "}
          <span style={{ color: "#fc92b0" }}>life-saving care</span> through
          precise, reliable technology and tools. If you&apos;re as passionate
          about <span style={{ color: "#fc92b0" }}>space tech</span> as we are,
          we&apos;d love to have your support!
        </p>
      </div>
    </section>
  );
}
