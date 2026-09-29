import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Search } from "lucide-react";

import { getItem } from "@/data/menu";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const item = getItem(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.item.name ?? "Menu Item"} — Bake 'N Love` },
      { name: "description", content: `${loaderData?.item.name ?? "Menu item"} at Bake 'N Love — ₹${loaderData?.item.price ?? ""}.` },
      { property: "og:title", content: `${loaderData?.item.name ?? "Menu Item"} — Bake 'N Love` },
      { property: "og:description", content: `View this Bake 'N Love dish and its price.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ItemDetail,
  notFoundComponent: ItemNotFound,
});

function ItemDetail() {
  const { item } = Route.useLoaderData();
  return (
    <main className="min-h-screen bg-cafe-page font-cafe text-cafe-ink">
      <article className="mx-auto min-h-screen max-w-[430px] overflow-hidden bg-cafe-surface">
        <header className="flex h-[75px] items-center justify-between bg-cafe-blue px-[22px] text-cafe-on-blue">
          <Link to="/" aria-label="Back to menu"><ArrowLeft className="size-7" /></Link>
          <h2 className="text-[22px] font-bold">Details</h2>
          <button type="button" aria-label="Favourite"><Heart className="size-7" /></button>
        </header>
        <div className="relative min-h-[520px] overflow-hidden bg-cafe-blue text-cafe-on-blue">
          {item.image ? <img src={item.image} alt={item.name} className="absolute right-2 top-[90px] h-[260px] w-[47%] object-contain" /> : null}
          <div className={`relative z-[3] px-6 pt-6 ${item.image ? "w-[53%]" : ""}`}>
            <h1 className="text-[29px] font-bold leading-[1.05]">{item.name}</h1>
            <div className="mt-[13px] text-base text-cafe-stars">★★★★★ <span className="ml-1 text-cafe-on-blue">4.8</span></div>
            <h3 className="mt-[27px] text-lg font-bold">Description</h3>
            <p className="mt-[10px] text-sm leading-[1.55] text-cafe-detail-copy">{item.description || `Freshly prepared ${item.name}, served with Bake 'N Love care.`}</p>
            <p className="mt-[22px] text-[28px] font-bold">₹{item.price}</p>
            <Link to="/category/$name" params={{ name: item.category }} className="mt-5 inline-block rounded-full bg-cafe-surface/15 px-4 py-2 text-xs font-bold">{item.category}</Link>
          </div>
        </div>
      </article>
    </main>
  );
}

function ItemNotFound() {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cafe-surface font-cafe"><Search className="size-8 text-cafe-muted" /><p className="text-xl font-bold">Item not found</p><Link to="/" className="rounded-full bg-cafe-blue px-5 py-3 font-bold text-cafe-on-blue">Back to Menu</Link></div>;
}