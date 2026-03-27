import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { generateWhatsAppLink } from "@/lib/utils";

const sizeOrder: Record<string, number> = { "10g": 1, "100g": 2, "400g": 3 };

export function ProductsSection() {
  const { products } = useApp();
  const featuredProducts = products
    .filter((product) => (product.size ?? "").toLowerCase() === "100g")
    .sort((a, b) => (sizeOrder[a.size ?? "100g"] ?? 2) - (sizeOrder[b.size ?? "100g"] ?? 2));

  return (
    <section id="products" className="relative scroll-mt-36 overflow-hidden bg-white py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,59,46,0.10),_transparent_42%),radial-gradient(circle_at_bottom,_rgba(249,208,35,0.16),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold tracking-tight text-secondary sm:text-5xl"
          >
            Explore the Julizen Seasoning Powder Range
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Discover Julizen Seasoning Powder options prepared to support everyday cooking with the right flavor for different meals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} index={index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index
}: {
  product: (ReturnType<typeof useApp>["products"])[number];
  index: number;
}) {
  const whatsappLink = generateWhatsAppLink(`Hello, I want to order ${product.name}. Please send me the details.`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-secondary/8 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_65px_rgba(15,23,42,0.12)]"
    >
      <div className="relative border-b border-secondary/6 bg-[linear-gradient(180deg,#fff9df_0%,#fff_100%)] px-6 pb-6 pt-8 sm:px-7">
        <div className="absolute left-6 top-6 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary shadow-sm">
          {product.category}
        </div>
        <div className="mx-auto flex aspect-[4/5] max-w-[240px] items-center justify-center rounded-[24px] bg-white/85 p-4 shadow-[0_26px_40px_rgba(255,197,0,0.15)] ring-1 ring-black/5">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain drop-shadow-[0_22px_20px_rgba(15,23,42,0.20)] transition-transform duration-300 group-hover:scale-[1.03]"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            width={420}
            height={520}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-display font-bold leading-tight text-secondary">{product.name}</h3>
          <span className="shrink-0 rounded-full bg-secondary/5 px-3 py-1 text-sm font-semibold text-secondary">100G</span>
        </div>

        <p className="text-sm leading-6 text-muted-foreground sm:text-[15px]">{product.description}</p>

        <div className="mt-6 rounded-2xl bg-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">Pack Format</p>
          <p className="mt-1 text-sm font-medium text-secondary">100G seasoning powder for convenient everyday cooking.</p>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-primary active:scale-[0.99] sm:text-base"
        >
          <ShoppingBag className="h-4 w-4" />
          Order via WhatsApp
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
}
