import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
// IMAGE WITH SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────

function LazyImage({
  src,
  alt,
  className,
  style,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(priority ?? false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && !loaded) setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {!loaded && !errored && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: loaded ? "none" : "opacity 0.35s ease" }}
        width={width}
        height={height}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setErrored(true); }}
      />
    </div>
  );
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
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Product details: Julizen ${product.name} ${product.size}`}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, y: 56, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
          className="relative z-10 w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white transition-all hover:bg-black/50 hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Hero image */}
          <div className="relative h-52 w-full overflow-hidden rounded-t-3xl sm:h-64">
            <img
              src={foodSrc}
              alt={product.foodCaption}
              className="h-full w-full object-cover"
              width={720}
              height={256}
              fetchPriority="high"
              decoding="sync"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            {/* Accent colour strip at top */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: product.accentColor }}
            />

            <div className="absolute bottom-0 left-0 p-5">
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-1.5 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                style={{ backgroundColor: product.accentColor }}
              >
                {product.category}
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[13px] text-white/85 leading-snug"
              >
                {product.foodCaption}
              </motion.p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* Header row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-display font-bold text-secondary sm:text-2xl">
                  Julizen {product.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{product.tagline}</p>
              </div>
              <div className="mt-2 shrink-0 sm:mt-0 sm:text-right">
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold"
                  style={{
                    borderColor: product.accentColor + "30",
                    backgroundColor: product.accentColor + "12",
                    color: product.accentColor,
                  }}
                >
                  <Package2 className="h-3.5 w-3.5" />
                  {product.size} — {product.packLabel}
                </span>
                <p className="mt-1.5 text-xs text-muted-foreground">{product.packDetail}</p>
              </div>
            </motion.div>

            {/* Packaging images */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.4 }}
              className="mb-6 rounded-2xl overflow-hidden"
              style={{ height: "300px", background: "linear-gradient(160deg,#f9f9f7 0%,#ffffff 100%)" }}
            >
              <div className="flex h-full">
                {[
                  { src: frontSrc, side: "front" },
                  { src: backSrc, side: "back" },
                ].map(({ src, side }, si) => (
                  <motion.div
                    key={side}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + si * 0.08, type: "spring", stiffness: 300 }}
                    className="relative flex flex-1 items-center justify-center p-1"
                  >
                    <img
                      src={src}
                      alt={`Julizen ${product.name} ${product.size} ${side} view`}
                      width={300}
                      height={300}
                      fetchPriority="high"
                      decoding="sync"
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    {si === 0 && (
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mb-6"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <Flame className="h-4 w-4" style={{ color: product.accentColor }} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">About This Product</h3>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{product.fullDescription}</p>
            </motion.div>

            {/* Cooking tips */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mb-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <ChefHat className="h-4 w-4" style={{ color: product.accentColor }} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Cooking Tips</h3>
              </div>
              <ol className="space-y-2.5">
                {product.cookingTips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: product.accentColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-6 text-muted-foreground">{tip}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="flex flex-col gap-3"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                style={{ backgroundColor: product.accentColor }}
              >
                <ShoppingBag className="h-4 w-4" />
                Order via WhatsApp
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-gray-500 border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
            </motion.div>
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
  index,
  onViewDetails,
}: {
  product: ProductEntry;
  priority: boolean;
  index: number;
  onViewDetails: (p: ProductEntry) => void;
}) {
  const whatsappLink = generateWhatsAppLink(product.whatsappMessage);
  const [frontLoaded, setFrontLoaded] = useState(priority);
  const [backLoaded, setBackLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const frontImgRef = useRef<HTMLImageElement>(null);
  const backImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (frontImgRef.current?.complete) setFrontLoaded(true);
    if (backImgRef.current?.complete) setBackLoaded(true);
  }, []);

  const frontSrc = product.frontImage.startsWith("/")
    ? getImageUrl(product.frontImage)
    : product.frontImage;
  const backSrc = product.backImage.startsWith("/")
    ? getImageUrl(product.backImage)
    : product.backImage;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.07,
        duration: 0.42,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm cursor-default"
      style={{
        boxShadow: hovered
          ? `0 12px 40px -8px ${product.accentColor}22, 0 4px 16px -4px rgba(0,0,0,0.10)`
          : "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        transition: "box-shadow 0.28s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* ── Image area ──────────────────────────────────────────────────── */}
      {/*
        Images are all normalized to 800×800 with consistent sachet bounds.
        Each half gets exactly 50% width; both use object-fit:contain so the
        sachet always fills its box at the same visual scale.
      */}
      <div className="relative rounded-t-3xl" style={{ height: "320px", background: "linear-gradient(160deg,#f9f9f7 0%,#ffffff 100%)" }}>
        {/* Accent top border — fades in on hover */}
        <div
          className="absolute top-0 left-0 right-0 z-10 h-1 rounded-t-3xl transition-all duration-300"
          style={{
            backgroundColor: product.accentColor,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
          }}
        />

        {/* Side-by-side sachets — flex, no gap, each exactly 50% */}
        <div className="flex h-full">

          {/* ── Front sachet ── */}
          <div className="relative flex flex-1 items-center justify-center p-1">
            {!frontLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-100 rounded-tl-3xl" />
            )}
            <img
              ref={frontImgRef}
              src={frontSrc}
              alt={`Julizen ${product.name} ${product.size} — front`}
              width={400}
              height={400}
              fetchPriority={priority ? "high" : "auto"}
              decoding={priority ? "sync" : "async"}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => setFrontLoaded(true)}
              itemProp="image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: frontLoaded ? 1 : 0,
                transition: "opacity 0.3s ease, transform 0.4s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          </div>

          {/* Hairline divider between the two sachets */}
          <div className="w-px flex-shrink-0 self-stretch bg-gray-200" />

          {/* ── Back sachet ── */}
          <div className="relative flex flex-1 items-center justify-center p-1">
            {!backLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-100 rounded-tr-3xl" />
            )}
            <img
              ref={backImgRef}
              src={backSrc}
              alt={`Julizen ${product.name} ${product.size} — back`}
              width={400}
              height={400}
              fetchPriority={priority ? "high" : "auto"}
              decoding={priority ? "sync" : "async"}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => setBackLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: backLoaded ? 1 : 0,
                transition: "opacity 0.3s ease, transform 0.4s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          </div>
        </div>

        {/* Size badge */}
        <span
          className="absolute bottom-2.5 right-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: product.accentColor }}
        >
          {product.size}
        </span>
      </div>

      {/* Card body */}
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
          <Package2 className="h-3.5 w-3.5 shrink-0" style={{ color: product.accentColor }} />
          <span className="text-[11px] font-semibold text-gray-600">{product.packDetail}</span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-secondary/20 bg-secondary/5 px-3 py-2.5 text-center text-[12px] font-semibold text-secondary transition-all duration-200 hover:bg-secondary/10 hover:border-secondary/30 hover:shadow-sm active:scale-[0.97]"
          >
            <Info className="h-3.5 w-3.5 shrink-0" />
            View Details
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order Julizen ${product.name} ${product.size} via WhatsApp`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-center text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px active:scale-[0.97] active:translate-y-0"
            style={{ backgroundColor: product.accentColor }}
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            Order Now
          </a>
        </div>
      </div>
    </motion.article>
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (products.length === 0) return null;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: groupIndex * 0.06, duration: 0.42 }}
      >
        <div className="mb-7 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: groupIndex * 0.06 + 0.1, type: "spring", stiffness: 320 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-bold text-white shadow-md"
            >
              {size}
            </motion.div>
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
              priority={groupIndex === 0}
              index={pi}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </motion.div>
    </div>
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
                in cooking, giving your food rich and mouth-watering flavour every time.
                Whether it is everyday cooking or a special meal, Julizen helps your food
                come out tasty and well balanced.
              </p>
              <p>
                Easy to use and reliable, Julizen gives you consistent results you can trust.
              </p>
              <p>
                Available in different sizes: 10g, 100g, and 400g.
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
