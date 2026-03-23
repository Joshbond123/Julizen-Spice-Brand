import { motion } from "framer-motion";
import { products } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";
import { ShoppingBag } from "lucide-react";

export function ProductsSection() {
  return (
    <section id="products" className="scroll-mt-24 bg-[#f9f9f7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary"
          >
            Our Products
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-3xl font-display font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl"
          >
            Bold Flavor. Every Meal. Every Time.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Julizen Seasoning Powders are crafted to bring out the full, natural flavor in every dish — from everyday home cooking to your most special meals. Choose the perfect blend and taste the difference.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} index={index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) {
  const whatsappLink = generateWhatsAppLink(product.whatsappMessage);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.07, duration: 0.42 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
    >
      <div className="relative flex items-center justify-center bg-gradient-to-b from-[#fef9ee] to-white px-6 pt-8 pb-6">
        <div className="w-full max-w-[220px] overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            width={440}
            height={540}
            style={{ aspectRatio: "4/5", objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-gray-100 px-5 pb-6 pt-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-display font-bold leading-snug text-secondary">
            {product.name}
          </h3>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {product.category}
          </span>
          <span className="inline-block rounded-full bg-secondary/8 px-2.5 py-0.5 text-xs font-semibold text-secondary">
            {product.weight}
          </span>
        </div>

        <p className="flex-1 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          Order via WhatsApp
        </a>
      </div>
    </motion.article>
  );
}
