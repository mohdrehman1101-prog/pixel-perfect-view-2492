import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

import { getCategory, getCategoryItems } from "@/data/menu";
import logo from "@/assets/logo.png.asset.json";

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
      { name: "description", content: `Browse ${loaderData?.category.name ?? "this category"} at Bake 'N Love.` },
      { property: "og:title", content: `${loaderData?.category.name ?? "Category"} — Bake 'N Love Menu` },
      { property: "og:description", content: `Browse this Bake 'N Love menu category.` },
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
    <main className="min-h-screen bg-cafe-page font-cafe text-cafe-ink">
      <div className="mx-auto min-h-screen max-w-[430px] bg-cafe-surface pb-12">
        <header className="flex h-[140px] items-center gap-3 rounded-b-[35px] bg-cafe-blue px-[22px] pb-5 pt-[35px] text-cafe-on-blue">
          <Link to="/" aria-label="Back to menu" className="grid size-12 place-items-center rounded-full bg-cafe-surface/15"><ArrowLeft className="size-6" /></Link>
          <img src={logo.url} alt="Bake 'N Love" className="size-12 rounded-full bg-cafe-surface object-contain" />
          <div><h1 className="text-[19px] font-bold">{category.icon} {category.name}</h1><p className="mt-1 text-xs text-cafe-on-blue/70">{items.length} items</p></div>
        </header>
        <section className="px-[22px] pt-8">
          <h2 className="text-[27px] font-bold">{category.name}</h2>
          {category.note ? <p className="mt-1 text-sm text-cafe-muted">{category.note}</p> : null}
          <div className="mt-6">
            {items.map((item) => (
              <Link key={item.id} to="/item/$id" params={{ id: item.id }} className="mb-3 flex min-h-[100px] items-center gap-3 rounded-[20px] bg-cafe-row p-3">
                <span className="grid size-[78px] shrink-0 place-items-center overflow-hidden rounded-[17px] bg-cafe-card"><img src={item.image} alt={item.name} className="size-[72px] rounded-[14px] object-cover" /></span>
                <span className="min-w-0 flex-1"><strong className="block text-[15px]">{item.name}</strong>{item.description ? <span className="mt-1 line-clamp-2 block text-xs text-cafe-muted">{item.description}</span> : null}<span className="mt-1 block text-[17px] font-bold text-cafe-blue">₹{item.price}</span></span>
                <ArrowRight className="size-5 shrink-0 text-cafe-blue" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function CategoryNotFound() {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cafe-surface font-cafe"><Search className="size-8 text-cafe-muted" /><p className="text-xl font-bold">Category not found</p><Link to="/" className="rounded-full bg-cafe-blue px-5 py-3 font-bold text-cafe-on-blue">Back to Menu</Link></div>;
}