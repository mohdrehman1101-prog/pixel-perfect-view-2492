import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";

import { getCategory, getCategoryItems } from "@/data/menu";
import logo from "@/assets/logo.png.asset.json";
import headerLeft from "@/assets/header_left.jpg.asset.json";
import headerRight from "@/assets/header_right.jpg.asset.json";
import leaf from "@/assets/leaf.png.asset.json";

export const Route = createFileRoute("/category/$name")({
  loader: ({ params }) => {
    const name = decodeURIComponent(params.name);
    const category = getCategory(name);
    if (!category) throw notFound();
    return { category, items: getCategoryItems(name) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name ?? "Category"} — Bake 'N Love Menu` },
      {
        name: "description",
        content: `Browse ${loaderData?.category.name ?? "this category"} at Bake 'N Love Café & Bistro.`,
      },
      { property: "og:title", content: `${loaderData?.category.name ?? "Category"} — Bake 'N Love Menu` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();

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

        <div className="relative mt-4">
          <img src={leaf.url} alt="" className="absolute -left-2 top-1 h-6 w-7 opacity-70 mix-blend-multiply" />
          <h1 className="font-display pl-6 text-[32px] leading-[1.1] tracking-tight text-menu-ink">
            {category.icon ? <span className="mr-2 text-[26px]">{category.icon}</span> : null}
            {category.name}
          </h1>
          {category.note ? (
            <p className="font-body mt-1 pl-6 text-[12px] italic text-menu-ink/70">{category.note}</p>
          ) : null}
          <p className="font-body mt-1 pl-6 text-[12px] text-menu-ink/60">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>

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
                <h2 className="font-display text-[15px] leading-tight text-menu-ink">{item.name}</h2>
                {item.description ? (
                  <p className="font-body mt-1 text-[11.5px] leading-[1.35] text-menu-ink/65">
                    {item.description}
                  </p>
                ) : null}
                <p className="font-body mt-2 text-[15px] font-semibold text-menu-ink">₹ {item.price}</p>
                <img
                  src={leaf.url}
                  alt=""
                  className="pointer-events-none absolute bottom-2 right-2 h-5 w-[22px] opacity-70 mix-blend-multiply"
                />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function CategoryNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-menu-bg px-6 text-center">
      <Search className="size-8 text-menu-ink/50" />
      <p className="font-display text-[22px] text-menu-ink">Category not found</p>
      <Link
        to="/"
        className="font-body rounded-full bg-menu-blue px-5 py-2 text-[14px] font-semibold text-white shadow"
      >
        Back to Menu
      </Link>
    </div>
  );
}
