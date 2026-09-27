import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";

import { getCategoryItems, getItem } from "@/data/menu";
import logo from "@/assets/logo.png.asset.json";
import headerLeft from "@/assets/header_left.jpg.asset.json";
import headerRight from "@/assets/header_right.jpg.asset.json";
import leaf from "@/assets/leaf.png.asset.json";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const item = getItem(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.item.name ?? "Menu Item"} — Bake 'N Love` },
      {
        name: "description",
        content: `${loaderData?.item.name ?? "Menu item"} at Bake 'N Love Café & Bistro — ₹ ${loaderData?.item.price ?? ""}.`,
      },
      { property: "og:title", content: `${loaderData?.item.name ?? "Menu Item"} — Bake 'N Love` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ItemDetail,
  notFoundComponent: ItemNotFound,
});

function ItemDetail() {
  const { item } = Route.useLoaderData();
  const related = getCategoryItems(item.category).filter((i) => i.id !== item.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-menu-bg pb-10">
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
      </header>

      <main className="relative z-10 -mt-3 animate-fade-in rounded-t-[18px] bg-menu-bg px-4 pt-4">
        <Link
          to="/"
          className="font-body inline-flex items-center gap-2 rounded-full bg-menu-card px-4 py-2 text-[13px] font-semibold text-menu-ink shadow-[0_2px_8px_rgba(120,90,60,0.1)] transition-transform hover:scale-105"
        >
          <ArrowLeft className="size-[15px]" strokeWidth={2.4} />
          Back to Menu
        </Link>

        <article className="mt-4 animate-scale-in overflow-hidden rounded-[18px] bg-menu-card shadow-[0_3px_14px_rgba(120,90,60,0.12)]">
          <div className="relative">
            <img src={item.image} alt={item.name} className="aspect-[362/200] w-full object-cover" />
            <span
              className={`font-body absolute right-[10px] top-[10px] flex items-center gap-1 rounded-[7px] bg-white px-[9px] py-[4px] text-[11px] font-medium shadow-sm ${
                item.veg ? "text-[#2f7a34]" : "text-[#8c2020]"
              }`}
            >
              <span
                className={`inline-block size-[9px] rounded-[2px] ${
                  item.veg ? "bg-[#3a8c3f]" : "bg-[#9c2626]"
                }`}
              />
              {item.veg ? "Veg" : "Non Veg"}
            </span>
            {item.label ? (
              <span className="font-body absolute left-[10px] top-[10px] rounded-[7px] bg-menu-blue px-[9px] py-[4px] text-[10px] font-semibold tracking-wide text-white shadow-sm">
                {item.label}
              </span>
            ) : null}
          </div>

          <div className="relative px-5 pb-6 pt-4">
            <h1 className="font-display text-[26px] leading-tight text-menu-ink">{item.name}</h1>
            <Link
              to="/category/$name"
              params={{ name: item.category }}
              className="font-body mt-1 inline-block text-[13px] font-medium text-menu-blue underline-offset-2 hover:underline"
            >
              {item.category}
            </Link>
            {item.description ? (
              <p className="font-body mt-3 text-[14px] leading-[1.5] text-menu-ink/70">
                {item.description}
              </p>
            ) : null}
            <p className="font-body mt-4 text-[22px] font-semibold text-menu-ink">₹ {item.price}</p>
            <img
              src={leaf.url}
              alt=""
              className="pointer-events-none absolute bottom-4 right-4 h-6 w-7 opacity-70 mix-blend-multiply"
            />
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-6">
            <h2 className="font-display text-[20px] text-menu-ink">You may also like</h2>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/item/$id"
                  params={{ id: r.id }}
                  className="relative flex flex-col overflow-hidden rounded-[14px] bg-menu-card shadow-[0_3px_12px_rgba(120,90,60,0.1)] transition-transform hover:scale-[1.02]"
                >
                  <img src={r.image} alt={r.name} className="aspect-[362/150] w-full object-cover" />
                  <div className="px-3 pb-3 pt-2">
                    <h3 className="font-display text-[14px] leading-tight text-menu-ink">{r.name}</h3>
                    <p className="font-body mt-1 text-[13px] font-semibold text-menu-ink">₹ {r.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function ItemNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-menu-bg px-6 text-center">
      <Search className="size-8 text-menu-ink/50" />
      <p className="font-display text-[22px] text-menu-ink">Item not found</p>
      <Link
        to="/"
        className="font-body rounded-full bg-menu-blue px-5 py-2 text-[14px] font-semibold text-white shadow"
      >
        Back to Menu
      </Link>
    </div>
  );
}
