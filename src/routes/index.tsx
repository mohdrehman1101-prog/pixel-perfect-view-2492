import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { categories, menuItems } from "@/data/menu";
import logo from "@/assets/logo.png.asset.json";
import headerLeft from "@/assets/header_left.jpg.asset.json";
import headerRight from "@/assets/header_right.jpg.asset.json";
import leaf from "@/assets/leaf.png.asset.json";
import introVideo from "@/assets/bake-n-love-intro.mp4.asset.json";
import introPoster from "@/assets/bake-n-love-intro-poster.webp.asset.json";

const introSeenKey = "bake-n-love-intro-seen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bake 'N Love — Café & Bistro Digital Menu" },
      {
        name: "description",
        content:
          "Freshly baked, just for you. Browse the Bake 'N Love café & bistro menu — pizzas, pastas, shakes, coffees, waffles and more.",
      },
      { property: "og:title", content: "Bake 'N Love — Café & Bistro Digital Menu" },
      {
        property: "og:description",
        content:
          "Freshly baked, just for you. Browse the Bake 'N Love café & bistro menu — pizzas, pastas, shakes, coffees, waffles and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Menu,
});

function Menu() {
  const navigate = useNavigate({ from: "/" });
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    // Returning from an item or category should go straight back to the menu.
    if (window.sessionStorage.getItem(introSeenKey) === "yes") {
      setShowIntro(false);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    // Muted inline playback is supported by mobile autoplay policies.
    const play = videoRef.current?.play();
    play?.catch(() => {
      // If playback is blocked or unsupported, do not trap visitors on the intro.
      window.sessionStorage.setItem(introSeenKey, "yes");
      setShowIntro(false);
    });
  }, [showIntro]);

  const finishIntro = () => {
    window.sessionStorage.setItem(introSeenKey, "yes");
    setShowIntro(false);
  };

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (active !== "All" && item.category !== active) return false;
      if (vegOnly && !item.veg) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, active, vegOnly]);

  const activeNote =
    active === "All" ? undefined : categories.find((c) => c.name === active)?.note;

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background" aria-label="Bake N Love introduction">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src={introVideo.url}
          poster={introPoster.url}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finishIntro}
          onError={finishIntro}
          aria-label="Bake N Love opening video"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-menu-bg pb-10">
      {/* Header */}
      <header className="relative h-[100px] overflow-hidden bg-menu-sky">
        <img
          src={headerLeft.url}
          alt=""
          className="pointer-events-none absolute left-0 top-0 h-full w-[46%] object-cover [mask-image:linear-gradient(to_right,black_62%,transparent)]"
        />
        <img
          src={headerRight.url}
          alt=""
          className="pointer-events-none absolute right-0 top-0 h-full w-[26%] object-cover [mask-image:linear-gradient(to_left,black_55%,transparent)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent,var(--menu-sky)_38%,var(--menu-sky)_62%,transparent)] opacity-60" />
        <img
          src={logo.url}
          alt="Bake 'N Love Café & Bistro"
          className="absolute left-1/2 top-1/2 h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-sm"
        />
        <p className="font-script absolute right-[13%] top-1/2 -translate-y-1/2 text-right text-[15px] leading-[1.15] text-menu-ink">
          Good Food
          <br />
          Good Mood <span className="text-[13px]">♡</span>
        </p>
      </header>

      <main className="relative z-10 -mt-3 rounded-t-[18px] bg-menu-bg px-4 pt-4">
        {/* Search */}
        <div className="flex h-[52px] items-center gap-3 rounded-full bg-menu-card px-5 shadow-[0_2px_10px_rgba(120,90,60,0.08)]">
          <Search className="size-[18px] shrink-0 text-menu-ink/70" strokeWidth={2.4} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your favourite food..."
            className="font-body h-full w-full bg-transparent text-[15px] text-menu-ink placeholder:text-menu-ink/55 focus:outline-none"
          />
        </div>

        {/* Menu heading + Veg Only */}
        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="relative">
            <img src={leaf.url} alt="" className="absolute -left-2 top-1 h-6 w-7 opacity-70 mix-blend-multiply" />
            <h1 className="font-display pl-6 text-[38px] leading-[1] tracking-tight text-menu-ink">
              Menu
            </h1>
            <p className="font-script mt-1 w-fit border-b border-menu-ink/40 pb-[3px] pl-6 text-[14px] text-menu-ink/90">
              Freshly Baked, Just for You <span className="text-[12px]">♥</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVegOnly((v) => !v)}
            aria-pressed={vegOnly}
            className="flex shrink-0 items-center gap-2 rounded-full bg-menu-card px-3 py-2 shadow-[0_2px_8px_rgba(120,90,60,0.1)]"
          >
            <span className="font-body text-[13px] font-semibold text-menu-ink">Veg Only</span>
            <span
              className={`relative h-[22px] w-[40px] rounded-full transition-colors ${
                vegOnly ? "bg-menu-blue" : "bg-menu-ink/20"
              }`}
            >
              <span
                className={`absolute top-[2px] size-[18px] rounded-full bg-white shadow transition-all ${
                  vegOnly ? "left-[20px]" : "left-[2px]"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Categories */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2 rounded-full bg-menu-card/80 p-[6px] shadow-[0_2px_8px_rgba(120,90,60,0.08)]">
            {[{ name: "All", icon: "" }, ...categories].map((c) => {
              const isActive = active === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setActive(c.name);
                    if (c.name !== "All") {
                      navigate({ to: "/category/$name", params: { name: c.name } });
                    }
                  }}
                  className={`font-body flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-[9px] text-[14px] font-medium transition-colors ${
                    isActive
                      ? "bg-menu-blue text-white shadow-[0_2px_6px_rgba(90,160,200,0.45)]"
                      : "bg-menu-card text-menu-ink"
                  }`}
                >
                  {c.icon ? <span className="text-[15px]">{c.icon}</span> : null}
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {activeNote ? (
          <p className="font-body mt-3 text-[12px] italic text-menu-ink/70">{activeNote}</p>
        ) : null}

        {/* Cards */}
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to="/item/$id"
              params={{ id: item.id }}
              className="relative flex flex-col overflow-hidden rounded-[14px] bg-menu-card shadow-[0_3px_12px_rgba(120,90,60,0.1)] transition-transform hover:scale-[1.02]"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[362/150] w-full rounded-[14px] object-cover"
                />
                <span
                  className={`font-body absolute right-[6px] top-[6px] flex items-center gap-1 rounded-[7px] bg-white px-[7px] py-[3px] text-[10px] font-medium shadow-sm ${
                    item.veg ? "text-[#2f7a34]" : "text-[#8c2020]"
                  }`}
                >
                  <span
                    className={`inline-block size-[8px] rounded-[2px] ${
                      item.veg ? "bg-[#3a8c3f]" : "bg-[#9c2626]"
                    }`}
                  />
                  {item.veg ? "Veg" : "Non Veg"}
                </span>
                {item.label ? (
                  <span className="font-body absolute left-[6px] top-[6px] rounded-[7px] bg-menu-blue px-[7px] py-[3px] text-[9px] font-semibold tracking-wide text-white shadow-sm">
                    {item.label}
                  </span>
                ) : null}
              </div>

              <div className="relative flex flex-1 flex-col px-3 pb-3 pt-2">
                <h2 className="font-display text-[15px] leading-tight text-menu-ink">
                  {item.name}
                </h2>
                {item.description ? (
                  <p className="font-body mt-1 text-[11.5px] leading-[1.35] text-menu-ink/65">
                    {item.description}
                  </p>
                ) : null}
                <p className="font-body mt-2 text-[15px] font-semibold text-menu-ink">
                  ₹ {item.price}
                </p>
                <img
                  src={leaf.url}
                  alt=""
                  className="pointer-events-none absolute bottom-2 right-2 h-5 w-[22px] opacity-70 mix-blend-multiply"
                />
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="font-body py-10 text-center text-[14px] text-menu-ink/70">
            No items found.
          </p>
        ) : null}
      </main>
    </div>
  );
}
