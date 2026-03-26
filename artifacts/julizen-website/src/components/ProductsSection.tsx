import { useState } from "react";
  import { motion } from "framer-motion";
  import { products } from "@/data/products";
  import { generateWhatsAppLink } from "@/lib/utils";
  import { getImageUrl } from "@/lib/imageUrl";
  import { ShoppingBag, Package } from "lucide-react";
  import type { ProductVariant } from "@/data/products";

  export function ProductsSection() {
    return (
      <section id="products" aria-label="Julizen Seasoning Products" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
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
              Turn Every Meal Into a Masterpiece.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl space-y-3 text-base leading-7 text-muted-foreground sm:text-lg"
            >
              <p>
                Julizen Seasoning is the real &ldquo;Baba&rdquo; in cooking &mdash; crafted to deliver rich, mouth-watering flavor in every spoonful. Whether it&apos;s your everyday meal or a special dish, Julizen brings out the deep, authentic taste that keeps people asking for more.
              </p>
              <p>
                From quick home cooking to full family feasts, one thing stays the same &mdash; bold flavor, perfect balance, and a taste you can trust every time.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
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
    const [activeVariant, setActiveVariant] = useState<ProductVariant>(product.variants[1] || product.variants[0]);
    const [showBack, setShowBack] = useState(false);

    const whatsappLink = generateWhatsAppLink(activeVariant.whatsappMessage);

    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Image Area */}
        <div
          className="relative flex cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-b from-[#fef9ee] to-[#f9f5ed] px-6 pt-8 pb-6"
          onClick={() => setShowBack((v) => !v)}
          title="Click to see back label"
        >
          <div className="relative w-full max-w-[200px]">
            {/* Front Image */}
            <img
              src={getImageUrl(activeVariant.frontImage)}
              alt={`${product.name} ${activeVariant.size} — front view`}
              className={`absolute inset-0 h-full w-full object-contain transition-all duration-500 ${showBack ? "opacity-0 rotate-y-180 scale-95" : "opacity-100 rotate-y-0 scale-100"}`}
              style={{ aspectRatio: "3/4", position: "relative", visibility: showBack ? "hidden" : "visible" }}
              width={200}
              height={267}
              fetchPriority={index < 2 ? "high" : "auto"}
              decoding="sync"
              itemProp="image"
            />
            {/* Back Image */}
            <img
              src={getImageUrl(activeVariant.backImage)}
              alt={`${product.name} ${activeVariant.size} — back label`}
              className={`h-auto w-full object-contain transition-all duration-500 ${showBack ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{ aspectRatio: "3/4", display: showBack ? "block" : "none" }}
              width={200}
              height={267}
              decoding="async"
            />
          </div>

          {/* Flip hint badge */}
          <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-gray-500 shadow-sm backdrop-blur-sm">
            {showBack ? "← Front" : "Back →"}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col border-t border-gray-100 px-5 pb-6 pt-5">
          {/* Category + Name */}
          <div className="mb-2">
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {product.category}
            </span>
            <h3 className="mt-2 text-[15px] font-display font-bold leading-snug text-secondary" itemProp="name">
              {product.name}
            </h3>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-6 text-muted-foreground" itemProp="description">
            {product.description}
          </p>

          {/* Size Variants */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Available Sizes</span>
            </div>
            <div className="space-y-1.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => { setActiveVariant(variant); setShowBack(false); }}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-all duration-150 ${
                    activeVariant.size === variant.size
                      ? "border-primary bg-primary/5 font-semibold text-primary"
                      : "border-gray-200 text-gray-600 hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-bold">{variant.size}</span>
                  <span className="mx-1 text-gray-400">&times;</span>
                  <span>{variant.quantity} &mdash; {variant.packFormat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} ${activeVariant.size} via WhatsApp`}
            className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
            Order Now — {activeVariant.size}
          </a>
        </div>
      </motion.article>
    );
  }
  