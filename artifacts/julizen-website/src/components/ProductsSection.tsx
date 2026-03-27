import { useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/imageUrl";
import { generateWhatsAppLink } from "@/lib/utils";
import { ShoppingBag, Info, X, ChefHat, Package2, Flame } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { AdminProduct, SizeKey } from "@/lib/productStorage";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type ProductEntry = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  fullDescription: string;
  cookingTips: string[];
  foodImage: string;
  foodCaption: string;
  accentColor: string;
  size: SizeKey;
  packLabel: string;
  packDetail: string;
  frontImage: string;
  backImage: string;
  whatsappMessage: string;
};

const SIZES: SizeKey[] = ["10g", "100g", "400g"];

const SIZE_LABELS: Record<string, string> = {
  "10g": "Perfect for everyday cooking & catering packs",
  "100g": "Ideal for households & regular family cooking",
  "400g": "Best value for large families, caterers & resellers",
};

function adminProductsToEntries(products: AdminProduct[]): ProductEntry[] {
  const entries: ProductEntry[] = [];
  for (const sz of SIZES) {
    for (const p of products) {
      if (!p.enabled) continue;
      const sizeData = p.sizes[sz];
      if (!sizeData) continue;
      if (sizeData.sizeEnabled === false) continue;
      entries.push({
        id: p.id,
        name: p.name,
        category: p.name,
        tagline: p.tagline,
        fullDescription: p.fullDescription,
        cookingTips: p.cookingTips,
        foodImage: p.foodImage,
        foodCaption: p.foodCaption,
        accentColor: p.accentColor,
        size: sz,
        packLabel: sizeData.packLabel,
        packDetail: sizeData.packDetail,
        frontImage: sizeData.frontImage,
        backImage: sizeData.backImage,
        whatsappMessage: sizeData.whatsappMessage,
      });
    }
  }
  return entries;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
}: {
  product: ProductEntry;
  onClose: () => void;
}) {
  const whatsappLink = generateWhatsAppLink(product.whatsappMessage);

  const frontSrc = product.frontImage.startsWith("/")
    ? getImageUrl(product.frontImage)
    : product.frontImage;
  const backSrc = product.backImage.startsWith("/")
    ? getImageUrl(product.backImage)
    : product.backImage;
  const foodSrc = product.foodImage.startsWith("/")
    ? getImageUrl(product.foodImage)
    : product.foodImage;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Product details: Julizen ${product.name} ${product.size}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className="relative z-10 w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative h-52 w-full overflow-hidden rounded-t-3xl sm:h-64 sm:rounded-t-3xl">
            <img
              src={foodSrc}
              alt={product.foodCaption}
              className="h-full w-full object-cover"
              width={720}
              height={256}
              fetchPriority="high"
              decoding="sync"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span
                className="mb-1 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: product.accentColor }}
              >
                {product.category}
              </span>
              <p className="text-[13px] text-white/80">{product.foodCaption}</p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-secondary sm:text-2xl">
                  Julizen {product.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{product.tagline}</p>
              </div>
              <div className="mt-2 shrink-0 sm:mt-0 sm:text-right">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/8 px-3 py-1.5 text-sm font-bold text-primary">
                  <Package2 className="h-3.5 w-3.5" />
                  {product.size} — {product.packLabel}
                </span>
                <p className="mt-1.5 text-xs text-muted-foreground">{product.packDetail}</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-[#fef9ee] p-4">
              {[
                { src: frontSrc, side: "front" },
                { src: backSrc, side: "back" },
              ].map(({ src, side }) => (
                <div key={side} className="relative">
                  <img
                    src={src}
                    alt={`Julizen ${product.name} ${product.size} ${side} view`}
                    className="h-auto w-full rounded-xl object-contain"
                    style={{ aspectRatio: "3/4" }}
                    width={200}
                    height={267}
                    fetchPriority="high"
                    decoding="sync"
                  />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">About This Product</h3>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{product.fullDescription}</p>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Cooking Tips</h3>
              </div>
              <ol className="space-y-2.5">
                {product.cookingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: product.accentColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-6 text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-secondary/90 hover:shadow-lg active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({
  product,
  priority,
  onViewDetails,
}: {
  product: ProductEntry;
  priority: boolean;
  onViewDetails: (p: ProductEntry) => void;
}) {
  const whatsappLink = generateWhatsAppLink(product.whatsappMessage);
  const frontSrc = product.frontImage.startsWith("/")
    ? getImageUrl(product.frontImage)
    : product.frontImage;
  const backSrc = product.backImage.startsWith("/")
    ? getImageUrl(product.backImage)
    : product.backImage;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative grid grid-cols-2 bg-gradient-to-b from-[#fef9ee] to-[#f1ede3]">
        <div className="flex items-end justify-center border-r border-white/70 px-4 pt-6 pb-4">
          <div className="w-full">
            <img
              src={frontSrc}
              alt={`Julizen ${product.name} ${product.size} — front view`}
              className="h-auto w-full object-contain drop-shadow-md"
              style={{ aspectRatio: "3/4" }}
              width={160}
              height={213}
              fetchPriority={priority ? "high" : "auto"}
              decoding={priority ? "sync" : "async"}
              itemProp="image"
            />
          </div>
        </div>
        <div className="flex items-end justify-center px-4 pt-6 pb-4">
          <div className="w-full">
            <img
              src={backSrc}
              alt={`Julizen ${product.name} ${product.size} — back label`}
              className="h-auto w-full object-contain drop-shadow-md"
              style={{ aspectRatio: "3/4" }}
              width={160}
              height={213}
              fetchPriority="auto"
              decoding="async"
            />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded-full bg-secondary/85 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          {product.size}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <span
          className="mb-2 inline-block self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: product.accentColor }}
        >
          {product.category}
        </span>

        <h4 className="mb-1 font-display text-[15px] font-bold leading-snug text-secondary" itemProp="name">
          Julizen {product.name}
          <span className="ml-1.5 font-normal text-sm text-muted-foreground">· {product.size}</span>
        </h4>

        <p className="mb-3 text-[12px] leading-5 text-muted-foreground" itemProp="description">
          {product.tagline}
        </p>

        <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <Package2 className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="text-[11px] font-semibold text-gray-600">{product.packDetail}</span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-secondary/20 bg-secondary/5 px-3 py-2.5 text-center text-[12px] font-semibold text-secondary transition hover:bg-secondary/10 active:scale-[0.97]"
          >
            <Info className="h-3.5 w-3.5 shrink-0" />
            View Details
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order Julizen ${product.name} ${product.size} via WhatsApp`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 py-2.5 text-center text-[12px] font-semibold text-white shadow-sm transition hover:bg-secondary/90 hover:shadow-md active:scale-[0.97]"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            Order Now
          </a>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE GROUP
// ─────────────────────────────────────────────────────────────────────────────

function SizeGroup({
  size,
  products,
  groupIndex,
  onViewDetails,
}: {
  size: string;
  products: ProductEntry[];
  groupIndex: number;
  onViewDetails: (p: ProductEntry) => void;
}) {
  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: groupIndex * 0.04, duration: 0.45 }}
    >
      <div className="mb-7 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-bold text-white shadow-md">
            {size}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-secondary sm:text-2xl">
              {size} Products
            </h3>
            <p className="text-sm text-muted-foreground">{SIZE_LABELS[size]}</p>
          </div>
        </div>
        <div className="ml-2 h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" aria-hidden />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, pi) => (
          <ProductCard
            key={product.id + product.size}
            product={product}
            priority={groupIndex === 0 && pi < 2}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState<ProductEntry | null>(null);
  const closeModal = useCallback(() => setActiveProduct(null), []);
  const rawProducts = useProducts();

  const allProducts = useMemo(() => adminProductsToEntries(rawProducts), [rawProducts]);

  const grouped = useMemo(
    () =>
      SIZES.map((sz) => ({
        size: sz,
        products: allProducts.filter((p) => p.size === sz),
      })).filter((g) => g.products.length > 0),
    [allProducts]
  );

  return (
    <>
      <section
        id="products"
        aria-label="Julizen Seasoning Products"
        className="scroll-mt-24 bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
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
              transition={{ delay: 0.06 }}
              className="mt-3 text-3xl font-display font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl"
            >
              Turn Every Meal Into a Masterpiece.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="mx-auto mt-5 max-w-2xl space-y-3 text-base leading-7 text-muted-foreground sm:text-lg"
            >
              <p>
                Julizen Seasoning is the real{" "}
                <strong className="font-bold text-secondary">&ldquo;Baba&rdquo;</strong>{" "}
                in cooking &mdash; crafted to deliver rich, mouth-watering flavour in every
                spoonful. Whether it&apos;s your everyday meal or a special dish, Julizen
                brings out the deep, authentic taste that keeps people asking for more.
              </p>
              <p>
                From quick home cooking to full family feasts, one thing stays the same &mdash;
                bold flavour, perfect balance, and a taste you can trust every time.
              </p>
            </motion.div>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {grouped.map((g, gi) => (
              <SizeGroup
                key={g.size}
                size={g.size}
                products={g.products}
                groupIndex={gi}
                onViewDetails={setActiveProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={closeModal} />
      )}
    </>
  );
}
