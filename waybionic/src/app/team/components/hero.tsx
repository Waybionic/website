"use client";

import React, { useState } from "react";

//─── TYPES ────────────────────────────────────────────────────────────────

type Person = {
  name: string;
  role?: string;
  /**
   * path to photo relative to /public  e.g. "/images/team/lina-dahou.jpg"
   * if empty, it'll default to initials instead
   */
  image?: string;
};

/** Simple laptop glyph for Software team (stroke inherits `currentColor`). */
function LaptopTeamIcon() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M2 18h20" />
    </svg>
  );
}

type Team = {
  id: string;
  name: string;
  /** symbol or small graphic in the icon square in the card header */
  icon?: string | React.ReactNode;
  /** font-weight override for the icon symbol (default 400) */
  iconWeight?: number;
  /** color used for the icon square in the card header */
  iconColor: string;
  /** lighter tint used for lead circles
   * or maybe the same color? idk yet
   */
  leadCircleColor: string;
  /** color used for regular member circles*/
  memberCircleColor: string;
  president?: Person[];
  vps?: Person[];
  leads?: Person[];
  jrLeads?: Person[];
  advisors?: Person[];
  members: Person[];
};

// ─── TEAM & MEMBER DATA ────────────────────────────────────────────────────────────────
// to add/update photos, set their 'image' field to the file path
// stored in /public  (e.g. "/images/team/lina-dahou.jpg").
// the empty field will show initials instead
const teams: Team[] = [
  {
    id: "executive",
    name: "Executive Team",
    icon: "★",
    iconColor: "#B9AFD2",
    leadCircleColor: "#b9afd2",
    memberCircleColor: "#d0c8e8",
    president: [
      { name: "Lina Dahou", role: "FOUNDER & PRESIDENT", image: "/images/team/lina-dahou.jpg" },
    ],
    vps: [
      { name: "Arwa Al Mousawi",  role: "VP MARKETING &\nSOFTWARE",        image: "" },
      { name: "Abnoor Chattha",  role: "VP INTERNAL",   image: "/images/team/abnoor-chattha.jpg" },
      { name: "Yahya Elmadhoun", role: "VP FINANCE",  image: "/images/team/yahya-elmadhoun.jpg" },
      { name: "Malik Mahdivika", role: "VP COMPETITIONS",  image: "/images/team/malik-mahdivika.jpg" },
      
    ],
    advisors: [
      { name: "Sana Wahab", role: "ADVISOR", image: "" },
    ],
    members: [],
  },

  {
    id: "mechanical",
    name: "Mechanical Team",
    icon: "⚙︎",
    iconWeight: 900,
    iconColor: "#FBB6C9",
    leadCircleColor: "#FBB6C9",
    memberCircleColor: "#B9AFD2",
    leads: [
      { name: "Noah Fischer", role: "TEAM LEAD", image: "/images/team/noah-fischer.jpg" },
      { name: "David Caranay",      role: "TEAM LEAD", image: "/images/team/david-caranay.jpg" },
    ],
    members: [
      { name: "Hailey Tran",        image: "/images/team/hailey-tran.JPG" },
      { name: "Jaspreet Dhanoa",        image: "/images/team/jaspreet-dhanoa.jpg" },
      { name: "Safaa Asif",        image: "/images/team/safaa-asif.jpg" },
      { name: "Zara Daudi",        image: "" },
      { name: "Meagan Zimmel", image: "/images/team/meagan-zimmel.jpg" },
      { name: "Shahmeen Sarmad",        image: "/images/team/shahmeen-sarmad.png" },
    ],
  },
  {
    id: "electrical",
    name: "Electrical Team",
    icon: "⚡︎",
    iconWeight: 900,
    iconColor: "#FBD896",
    leadCircleColor: "#FBD896",
    memberCircleColor: "#B9AFD2",
    leads: [
      { name: "Conrad Brabec", role: "TEAM LEAD", image: "/images/team/conrad-brabec.jpg" },
    ],
    jrLeads: [
      { name: "Haziq Munir", role: "JR. LEAD", image: "/images/team/haziq-munir.jpg" },
    ],
    members: [
      { name: "Abdul Qureshi",            image: "" },
      { name: "Aryan Al-Adani",            image: "/images/team/aryan-al-adani.jpg" },
      { name: "Ava Jones",            image: "" },
      { name: "Kristen Powell",            image: "" },
      { name: "Daniel Mogylevets",            image: "/images/team/daniel-mogylevets.jpg" },
      { name: "Luke Zenha",            image: "/images/team/luke-zenha.JPG" },
      { name: "Rashveer Sandhu, ",     image: "/images/team/rashveer-sandhu.jpg" },
      { name: "Mahavir Desai",          image: "/images/team/mahavir-desai.jpg" },
      { name: "Utsav Ojha",          image: "/images/team/utsav-ojha.jpg" },
    ],
  },
  {
    id: "biomedical",
    name: "Biomedical Team",
    icon: "☘︎",
    iconColor: "#BEDBAC",
    leadCircleColor: "#BEDBAC",
    memberCircleColor: "#B9AFD2",
    leads: [
      { name: "Ahmeel Pablo", role: "TEAM LEAD", image: "" },
    ],
    jrLeads: [
      { name: "Moumita Murshed", role: "JR. LEAD", image: "" },
    ],
    members: [
      { name: "Bridget Benedek-Koteles",  image: "/images/team/bridget-benedek-koteles.JPEG" },
      { name: "Julie Guirguis",  image: "" },
      { name: "Hannah Nguyen",           image: "/images/team/hannah-nguyen.JPG" },
      { name: "Anahat Sidhu",           image: "/images/team/anahat-sidhu.jpg" },
      { name: "Amena Katawazi",           image: "/images/team/amena-katawazi.JPG" },
    ],
  },
  {
    id: "software",
    name: "Software Team",
    icon: <LaptopTeamIcon />,
    iconColor: "#A4C5C7",
    leadCircleColor: "#A4C5C7",
    memberCircleColor: "#B9AFD2",
    leads: [
      { name: "Yassin Soliman", role: "TEAM LEAD", image: "/images/team/yassin-soliman.jpg" },
      { name: "Mujtaba Zia",   role: "TEAM LEAD", image: "/images/team/mujtaba-zia.jpeg" },
    ],
    jrLeads: [
      { name: "Gianna Kong", role: "JR. LEAD", image: "/images/team/gianna-kong.jpg" },
    ],
    members: [
      { name: "Richard Nguyen",    image: "/images/team/richard-nguyen.png" },
      { name: "Harold Kim",        image: "/images/team/harold-kim.jpeg" },
      { name: "Khuzaymah Bin Haris",             image: "/images/team/khuzaymah-haris.png" },
      { name: "Ajmal Khidri",      image: "/images/team/ajmal-khidri.jpg" },
      { name: "Abdullah Sheikh",      image: "/images/team/abdullah-sheikh.jpeg" },
      { name: "Malik Mahdivika",      image: "/images/team/malik-mahdivika.jpg" },
      { name: "Hamnah Suleman",     image: "/images/team/hamnah-suleman.jpg" },

    ],
  },
  {
    id: "finance",
    name: "Finance & Marketing Team",
    icon: "୭˚",
    iconColor: "#6E6C78",
    leadCircleColor: "#6E6C78",
    memberCircleColor: "#B9AFD2",
    leads: [
      { name: "Lina Dahou", role: "TEAM LEAD", image: "/images/team/lina-dahou.jpg" },
      { name: "Arwa Al Mousawi", role: "TEAM LEAD", image: "" },
    ],
    members: [
      { name: "Abnoor Chattha", image: "/images/team/abnoor-chattha.jpg" },
      { name: "Cris Wen", image: "/images/team/cris-wen.jpg" },
    ],
  },
];

// count everyone on a team (president, VPs, leads, jr. leads, and members)
function countPeople(teamId: string): number {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return 0;
  return (
    (team.president?.length ?? 0) +
    (team.vps?.length ?? 0) +
    (team.leads?.length ?? 0) +
    (team.jrLeads?.length ?? 0) +
    team.members.length
  );
}

// stats shown in the hero — counts are derived from the team data above so they stay accurate
const statTeams = [
  { label: "BIOMEDICAL",          filled: false, targetId: "biomedical" },
  { label: "MECHANICAL",          filled: true,  targetId: "mechanical" },
  { label: "ELECTRICAL",          filled: true,  targetId: "electrical" },
  { label: "SOFTWARE",            filled: false, targetId: "software"   },
  { label: "MARKETING & FINANCE", filled: false, targetId: "finance"    },
];

const teamStats = statTeams.map((s) => ({
  count: String(countPeople(s.targetId)),
  label: s.label,
  filled: s.filled,
  targetId: s.targetId,
}));

// total members = unique people across the five teams above (some people,
// e.g. exec VPs who also lead Finance & Marketing, are on more than one team)
const totalMembers = countUniquePeople();

const stats = [
  ...teamStats,
  { count: String(totalMembers), label: "MEMBERS", filled: true, targetId: "" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


// some people are listed on more than one team, count each person once for the org-wide total
function countUniquePeople(): number {
  const names = new Set<string>();
  teams.forEach((t) => getAllPeople(t).forEach((p) => names.add(normalizeName(p.name))));
  return names.size;
}


// collapse a name to letters-only/lowercase 
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

function getAllPeople(team: Team): Person[] {
  return [
    ...(team.president ?? []),
    ...(team.vps ?? []),
    ...(team.leads ?? []),
    ...(team.jrLeads ?? []),
    ...(team.advisors ?? []),
    ...team.members,
  ];
}


// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function PersonCard({
  person,
  circleColor,
  large = false,
}: {
  person: Person;
  circleColor: string;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl p-3 gap-2" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: circleColor }}
      >
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="font-bold text-white text-xs"
            style={{ fontFamily: "LemonMilk, sans-serif" }}
          >
            {getInitials(person.name)}
          </span>
        )}
      </div>
      <div className="text-center w-full">
        <p className="text-[10px] font-semibold text-gray-800 leading-tight break-words">
          {person.name}
        </p>
        {person.role && (
          <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide leading-tight break-words" style={{ whiteSpace: "pre-line" }}>
            {person.role}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionRow({
  label,
  people,
  circleColor,
  large = false,
  useGrid = false,
}: {
  label: string;
  people: Person[];
  circleColor: string;
  large?: boolean;
  useGrid?: boolean;
}) {
  if (!people || people.length === 0) return null;
  return (
    <div>
      <p
        className="text-[10px] font-bold tracking-widest uppercase mb-2"
        style={{ color: "#8878a8", fontFamily: "Arimo, sans-serif" }}
      >
        {label}
      </p>
      {useGrid ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
          {people.map((p, i) => (
            <PersonCard key={i} person={p} circleColor={circleColor} large={large} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {people.map((p, i) => (
            <PersonCard key={i} person={p} circleColor={circleColor} large={large} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  const totalCount =
    (team.president?.length ?? 0) +
    (team.vps?.length ?? 0) +
    (team.leads?.length ?? 0) +
    (team.jrLeads?.length ?? 0) +
    (team.advisors?.length ?? 0) +
    team.members.length;

  const hasLeads    = (team.leads?.length ?? 0)    > 0;
  const hasJrLeads  = (team.jrLeads?.length ?? 0)  > 0;
  const hasAdvisors = (team.advisors?.length ?? 0) > 0;

  return (
    <div
      id={team.id}
      className="rounded-2xl overflow-hidden shadow-md mb-10 bg-white"
      style={{ scrollMarginTop: "calc(var(--navbar-height) + 12px)" }}
    >
      {/* ── card header ── */}
      <div
        className="flex items-center gap-3 px-4 sm:px-5"
        style={{ background: "#1D0F33", height: 84 }}
      >
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-white"
          style={{ borderRadius: 13, background: team.iconColor }}
        >
          {team.icon != null && team.icon !== "" && (
            typeof team.icon === "string" ? (
              <span
                style={{
                  fontSize: 24,
                  lineHeight: 1,
                  userSelect: "none",
                  fontWeight: team.iconWeight ?? 400,
                }}
              >
                {team.icon}
              </span>
            ) : (
              <span className="flex items-center justify-center [&_svg]:shrink-0">
                {team.icon}
              </span>
            )
          )}
        </div>
        <span
          className="text-white"
          style={{ fontFamily: "var(--font-epilogue), sans-serif", fontSize: 22, fontWeight: 600 }}
        >
          {team.name}
        </span>
        <span
          className="ml-auto text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
          style={{
            background: "#3E2F56",
            color: "#B8B2C0",
            fontFamily: "Arimo, sans-serif",
          }}
        >
          {totalCount} members
        </span>
      </div>

      {/* ── card body ── */}
      <div className="p-4 sm:p-5 flex flex-col gap-5">
        {/* pres */}
        {(team.president?.length ?? 0) > 0 && (
          <SectionRow
            label="President"
            people={team.president!}
            circleColor={team.leadCircleColor}
            large
          />
        )}

        {/* vps */}
        {(team.vps?.length ?? 0) > 0 && (
          <SectionRow
            label="Vice Presidents"
            people={team.vps!}
            circleColor={team.leadCircleColor}
            useGrid
          />
        )}

        {/* team leads, jr leads & advisors */}
        {(hasLeads || hasJrLeads || hasAdvisors) && (
          <div className="flex flex-col sm:flex-row gap-6">
            {hasLeads && (
              <div className="min-w-[260px]">
                <SectionRow
                  label="Team Leads"
                  people={team.leads!}
                  circleColor={team.leadCircleColor}
                  useGrid
                />
              </div>
            )}
            {hasJrLeads && (
              <div className="min-w-[260px]">
                <SectionRow
                  label="Jr. Leads"
                  people={team.jrLeads!}
                  circleColor={team.leadCircleColor}
                  useGrid
                />
              </div>
            )}
            {hasAdvisors && (
              <div className="min-w-[260px]">
                <SectionRow
                  label="Advisors"
                  people={team.advisors!}
                  circleColor={team.leadCircleColor}
                  useGrid
                />
              </div>
            )}
          </div>
        )}

        {/* team members */}
        {team.members.length > 0 && (
          <SectionRow
            label="Team Members"
            people={team.members}
            circleColor={team.memberCircleColor}
            useGrid
          />
        )}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function getCardTransform(i: number, hoveredIndex: number | null): string {
  if (hoveredIndex === null || i === hoveredIndex) return "scale(1)";
  const hRow = Math.floor(hoveredIndex / 2);
  const hCol = hoveredIndex % 2;
  const iRow = Math.floor(i / 2);
  const iCol = i % 2;
  let dx = 0, dy = 0;
  if (iRow === hRow) dx = iCol > hCol ? 7 : -7;
  if (iCol === hCol) dy = iRow > hRow ? 7 : -7;
  return `translate(${dx}px, ${dy}px)`;
}

export default function Hero() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* hero */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "calc(100vh - var(--navbar-height))",
          backgroundImage: "url('/images/starrybackground.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* moon (bot right) */}
        <img
          src="/Moon1.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-[180px] sm:w-[280px] lg:w-[420px] h-auto object-contain pointer-events-none select-none"
        />

        {/* sparkle decorations */}
        <span className="absolute top-[12%] left-[8%]  text-3xl select-none pointer-events-none" style={{ color: "#e0b8ff", opacity: 0.9, transform: "translate(4px, -20px)" }}>✦</span>
        <span className="absolute top-[18%] left-[38%] text-base select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.5 }}>✦</span>
        <span className="absolute top-[55%] left-[5%]  text-5xl select-none pointer-events-none" style={{ color: "#a0c8ff", opacity: 0.7 }}>✦</span>
        <span className="absolute top-[70%] left-[28%] text-sm  select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.4 }}>✦</span>
        <span className="absolute top-[8%]  right-[32%] text-xl select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.35 }}>✦</span>
        <span className="absolute top-[40%] right-[8%] text-2xl select-none pointer-events-none" style={{ color: "#ffffff", opacity: 0.3 }}>✦</span>

        <div
          className="team-hero-container relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-8"
          style={{ minHeight: "calc(100vh - var(--navbar-height))", paddingTop: "5vh", paddingBottom: "5vh" }}
        >
          {/* title + description */}
          <div className="lg:flex-1 text-white text-center lg:text-left lg:max-w-[460px]">
            {/* our people */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-6 text-[11px] font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(220,210,245,0.85)",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              <span style={{ fontSize: 9 }}>✦</span> Our People
            </div>

            <h1
              className="leading-[1.05] text-white"
              style={{ fontFamily: "var(--font-epilogue), sans-serif", fontSize: "clamp(3.2rem, 6.5vw, 5.5rem)", fontWeight: 900 }}
            >
              Meet the
            </h1>
            <h1
              className="leading-[1.05] mb-6"
              style={{
                fontFamily: "var(--font-epilogue), sans-serif",
                fontSize: "clamp(3.2rem, 6.5vw, 5.5rem)",
                fontWeight: 900,
                background: "linear-gradient(to right, #fea2be, #c996ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Team.
            </h1>

            <p
              className="text-lg leading-relaxed font-semibold"
              style={{ color: "#DAD4E3", fontFamily: "var(--font-dm-sans), sans-serif", maxWidth: 450 }}
            >
              Since 2024, WayBionic has been driven by passionate innovators
              pushing boundaries in tech and medicine. We&apos;re always looking
              for curious, driven people ready to make an impact.
            </p>
          </div>

          {/* stats grid + moon */}
          <div className="flex items-center justify-center lg:justify-end relative py-[5vh]">
            <div className="team-stats-grid">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden flex flex-col justify-end cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (!s.targetId) return;
                    const el = document.getElementById(s.targetId);
                    if (!el) return;
                    // Align the top of the team card under the fixed nav — not vertically
                    // center the whole card (tall cards would land with Jr. Leads at top).
                    const root = document.documentElement;
                    const navRaw = getComputedStyle(root).getPropertyValue("--navbar-height").trim();
                    const navPx =
                      navRaw.endsWith("px")
                        ? parseFloat(navRaw)
                        : parseFloat(navRaw) || 80;
                    const gap = 12;
                    const y = el.getBoundingClientRect().top + window.scrollY - navPx - gap;
                    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
                  }}
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    border: "3px solid rgba(255,255,255,0.38)",
                    borderRadius: 18,
                    padding: "14px 20px",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    transition: "transform 0.2s ease-out, filter 0.2s ease-out",
                    transform: hoveredIndex === i
                      ? "scale(1.04)"
                      : getCardTransform(i, hoveredIndex),
                    filter: hoveredIndex === i ? "brightness(1.25)" : "brightness(1)",
                  }}
                >
                  {/* gradient overlay (white -> transparent) */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)",
                    }}
                  />
                  <p
                    className="team-stat-number relative leading-none"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 900,
                      fontSize: "65px",
                      color: s.filled ? "rgba(255,255,255,0.4)" : "transparent",
                      WebkitTextStroke: s.filled ? "none" : "1px #CCC7D6",
                    }}
                  >
                    {s.count}
                  </p>
                  <p
                    className="team-stat-label relative uppercase mt-2"
                    style={{
                      fontSize: "21px",
                      letterSpacing: "0.04em",
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 900,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* team directory */}
      <div
        id="directory"
        className="w-full flex flex-col items-center"
        style={{ background: "#f0ebf8" }}
      >
        <div className="w-full max-w-6xl px-4 sm:px-8 py-14">

          {/* section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "#c8b8d8" }} />
            <p
              className="text-[10px] font-bold tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: "#9080c0", fontFamily: "Arimo, sans-serif" }}
            >
              Team Directory
            </p>
            <div className="flex-1 h-px" style={{ background: "#c8b8d8" }} />
          </div>

          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}

        </div>
      </div>
    </>
  );
}
