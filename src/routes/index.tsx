import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { categories, menuItems, type MenuItem } from "@/data/menu";
import logo from "@/assets/logo.png.asset.json";
import introVideo from "@/assets/bake-n-love-intro.mp4.asset.json";
import introPoster from "@/assets/bake-n-love-intro-poster.webp.asset.json";

const introSeenKey = "bake-n-love-intro-seen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bake 'N Love — Café & Bistro Menu" },
      { name: "description", content: "Browse the complete Bake 'N Love café and bistro menu." },
      { property: "og:title", content: "Bake 'N Love — Café & Bistro Menu" },
      { property: "og:description", content: "Browse the complete Bake 'N Love café and bistro menu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Menu,
});

function Menu() {
  const navigate = useNavigate({ from: "/" });
  const [showIntro, setShowIntro] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [specialIndex, setSpecialIndex] = useState(0);
  const [detail, setDetail] = useState<MenuItem>();
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const catalogueRef = useRef<HTMLElement>(null);
  const specials = menuItems.slice(0, 6);

  useEffect(() => {
    if (window.sessionStorage.getItem(introSeenKey) === "yes") setShowIntro(false);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    videoRef.current?.play().catch(() => {
      window.sessionStorage.setItem(introSeenKey, "yes");
      setShowIntro(false);
    });
  }, [showIntro]);

  useEffect(() => {
    if (detail || showIntro) return;
    const timer = window.setInterval(() => setSpecialIndex((value) => (value + 1) % specials.length), 4000);
    return () => window.clearInterval(timer);
  }, [detail, showIntro, specials.length]);

  const finishIntro = () => {
    window.sessionStorage.setItem(introSeenKey, "yes");
    setShowIntro(false);
  };

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const categoryMatch =
        filter === "All" ||
        (filter === "Veg" && item.veg) ||
        (filter === "Non-Veg" && !item.veg) ||
        item.category === filter;
      return categoryMatch && (!search || item.name.toLowerCase().includes(search) || item.description?.toLowerCase().includes(search));
    });
  }, [filter, query]);

  const grouped = useMemo(() => categories.map((category) => ({
    ...category,
    items: results.filter((item) => item.category === category.name),
  })).filter((category) => category.items.length), [results]);

  const toggleFavourite = (id: string) => {
    setFavourites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background">
        <video ref={videoRef} className="h-full w-full object-contain" src={introVideo.url} poster={introPoster.url}
          autoPlay muted playsInline preload="auto" onEnded={finishIntro} onError={finishIntro} aria-label="Bake N Love opening video" />
      </div>
    );
  }

  const special = specials[specialIndex];
  if (!special) return null;

  return (
    <div className="min-h-screen bg-cafe-page font-cafe text-cafe-ink">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-cafe-surface shadow-cafe-shell">
        <header className="flex h-[140px] items-center gap-3 rounded-b-[35px] bg-cafe-blue px-[22px] pb-5 pt-[35px] text-cafe-on-blue">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-cafe-surface">
            <img src={logo.url} alt="Bake 'N Love" className="size-14 object-contain" />
          </div>
          <div>
            <h1 className="text-[19px] font-bold">Bake 'N Love</h1>
            <p className="mt-1 text-xs text-cafe-on-blue/70">Good food. Good mood.</p>
          </div>
        </header>

        <label className="relative z-10 mx-auto -mt-px flex h-[63px] w-[calc(100%-45px)] items-center gap-3 rounded-[23px] bg-cafe-search px-5">
          <Search className="size-6 shrink-0 text-cafe-blue" strokeWidth={2.2} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search here..."
            className="h-full w-full bg-transparent text-base outline-none placeholder:text-cafe-muted" />
        </label>

        <section className="px-[22px] pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[27px] font-bold">New Menu</h2>
            <button type="button" onClick={() => catalogueRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="text-[15px] font-semibold text-cafe-blue">View All</button>
          </div>
          <div className="-mr-[22px] flex gap-[15px] overflow-x-auto py-7 pr-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {menuItems.slice(0, 6).map((item) => (
              <article key={item.id} onClick={() => setDetail(item)} className="animate-card-in relative h-[305px] min-w-[160px] cursor-pointer rounded-[25px] bg-cafe-card p-[13px]">
                <button type="button" aria-label={`Favourite ${item.name}`} onClick={(event) => { event.stopPropagation(); toggleFavourite(item.id); }}
                  className="absolute right-[13px] top-[13px] z-10 text-cafe-heart">
                  <Heart className="size-[22px]" fill={favourites.has(item.id) ? "currentColor" : "none"} />
                </button>
                <div className="flex h-[190px] items-center justify-center overflow-hidden rounded-[18px]">
                  <img src={item.image} alt={item.name} className="h-[185px] w-[145px] object-cover drop-shadow-cafe" />
                </div>
                <h3 className="mt-2 truncate text-base font-bold">{item.name}</h3>
                <div className="mt-[7px] flex items-center justify-between">
                  <span className="text-[21px] font-bold text-cafe-blue">₹{item.price}</span>
                  <span className="grid size-11 place-items-center rounded-[13px] bg-cafe-ink text-cafe-surface"><ArrowRight className="size-5" /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-[27px] h-[475px] overflow-hidden rounded-t-[30px] bg-cafe-blue text-cafe-on-blue">
          <div className="absolute -right-[180px] top-5 size-[390px] rounded-full border-[70px] border-cafe-ring" />
          <div className="absolute left-8 bottom-[34px] z-10 max-w-[185px]">
            <small className="text-sm text-cafe-on-blue/65">Special</small>
            <h2 className="mt-[7px] text-[38px] font-bold leading-[0.98]">{special.name}</h2>
            <p className="mt-[13px] text-xl font-bold">₹{special.price}</p>
          </div>
          <button type="button" onClick={() => setDetail(special)} className="absolute -right-[65px] top-[30px] z-[3] size-[330px]">
            <img key={special.id} src={special.image} alt={special.name} className="animate-drink-float size-full rounded-[36px] object-cover drop-shadow-cafe-strong" />
          </button>
          <div className="absolute left-[38px] top-[35px] z-[6] flex flex-col gap-[15px]">
            {specials.slice(0, 3).map((item, index) => (
              <button key={item.id} type="button" onClick={() => setSpecialIndex(index)}
                className={`size-[62px] overflow-hidden rounded-full border-2 p-[5px] ${index === specialIndex ? "border-cafe-on-blue bg-cafe-on-blue/25" : "border-cafe-on-blue/70 bg-cafe-on-blue/10"} ${index === 1 ? "ml-[65px]" : index === 2 ? "ml-[55px]" : ""}`}>
                <img src={item.image} alt={item.name} className="size-full rounded-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section ref={catalogueRef} className="px-[22px] pb-[70px] pt-8">
          <h2 className="text-[27px] font-bold">Restaurant Menu</h2>
          <p className="mt-[5px] text-sm text-cafe-muted">Choose your favourite food</p>
          <div className="sticky top-0 z-20 -mx-1 flex gap-[9px] overflow-x-auto bg-cafe-surface px-1 py-[15px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["All", "Veg", "Non-Veg", ...categories.map((category) => category.name)].map((name) => (
              <button key={name} type="button" onClick={() => setFilter(name)}
                className={`shrink-0 rounded-full px-[17px] py-[11px] text-[13px] font-bold ${filter === name ? "bg-cafe-blue text-cafe-on-blue" : "bg-cafe-chip text-cafe-copy"}`}>
                {name === "Veg" ? "🥗 Veg" : name === "Non-Veg" ? "🍗 Non-Veg" : name}
              </button>
            ))}
          </div>

          {grouped.map((category) => (
            <div key={category.name} className="mt-[22px]">
              <button type="button" onClick={() => navigate({ to: "/category/$name", params: { name: category.name } })}
                className="mb-3 text-left text-[21px] font-bold">{category.icon} {category.name}</button>
              {category.items.map((item) => (
                <button key={item.id} type="button" onClick={() => setDetail(item)}
                  className="mb-3 flex min-h-[100px] w-full items-center gap-3 rounded-[20px] bg-cafe-row p-3 text-left">
                  <span className="grid size-[78px] shrink-0 place-items-center overflow-hidden rounded-[17px] bg-cafe-card">
                    <img src={item.image} alt={item.name} className="size-[72px] rounded-[14px] object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[15px]">{item.name}</strong>
                    {item.description ? <span className="mt-[5px] line-clamp-2 block text-xs leading-[1.35] text-cafe-muted">{item.description}</span> : null}
                    <span className="mt-[5px] flex items-center gap-1 text-[10px] text-cafe-copy">
                      <i className={`size-2 rounded-[2px] border-2 not-italic ${item.veg ? "border-cafe-veg" : "border-cafe-nonveg"}`} />
                      {item.veg ? "Veg" : "Non-Veg"}
                    </span>
                    <span className="mt-1 block text-[17px] font-bold text-cafe-blue">₹{item.price}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
          {!results.length ? <p className="py-12 text-center text-cafe-muted">No items found</p> : null}
        </section>

        <section aria-hidden={!detail} className={`fixed inset-0 z-50 mx-auto max-w-[430px] overflow-y-auto bg-cafe-surface transition-transform duration-500 ease-out ${detail ? "translate-x-0" : "translate-x-full"}`}>
          {detail ? <>
            <header className="flex h-[75px] items-center justify-between bg-cafe-blue px-[22px] text-cafe-on-blue">
              <button type="button" aria-label="Back" onClick={() => setDetail(undefined)}><ArrowLeft className="size-7" /></button>
              <h2 className="text-[22px] font-bold">Details</h2>
              <button type="button" aria-label="Favourite" onClick={() => toggleFavourite(detail.id)}><Heart className="size-7" fill={favourites.has(detail.id) ? "currentColor" : "none"} /></button>
            </header>
            <div className="relative min-h-[520px] overflow-hidden bg-cafe-blue text-cafe-on-blue">
              <div className="relative z-[3] w-[53%] px-6 pt-6">
                <h1 className="text-[29px] font-bold leading-[1.05]">{detail.name}</h1>
                <div className="mt-[13px] text-base text-cafe-stars">★★★★★ <span className="ml-1 text-cafe-on-blue">4.8</span></div>
                <h3 className="mt-[27px] text-lg font-bold">Description</h3>
                <p className="mt-[10px] text-sm leading-[1.55] text-cafe-detail-copy">{detail.description || `Freshly prepared ${detail.name}, served with Bake 'N Love care.`}</p>
                <div className="mt-[22px] text-[28px] font-bold">₹{detail.price}</div>
              </div>
              <img src={detail.image} alt={detail.name} className="animate-drink-float absolute -right-[55px] bottom-[-25px] h-[390px] w-[280px] rounded-[45px] object-cover drop-shadow-cafe-strong" />
            </div>
          </> : null}
        </section>
      </div>
    </div>
  );
}