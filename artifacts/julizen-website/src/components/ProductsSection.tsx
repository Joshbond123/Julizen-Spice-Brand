import { useState, useEffect, useCallback } from "react";
  import { createPortal } from "react-dom";
  import { motion, AnimatePresence } from "framer-motion";
  import { getImageUrl } from "@/lib/imageUrl";
  import { generateWhatsAppLink } from "@/lib/utils";
  import { ShoppingBag, Info, X, ChefHat, Package2, Flame } from "lucide-react";

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────────────────────

  type FlavorId = "chicken" | "crayfish" | "fried-rice" | "stew-jollof";

  type FlavorDetails = {
    id: FlavorId;
    name: string;
    tagline: string;
    fullDescription: string;
    cookingTips: string[];
    foodImage: string;
    foodCaption: string;
    accentColor: string;
  };

  type ProductEntry = FlavorDetails & {
    size: "10g" | "100g" | "400g";
    packLabel: string;
    packDetail: string;
    frontImage: string;
    backImage: string;
    whatsappMessage: string;
  };

  const FLAVOR_DETAILS: Record<FlavorId, FlavorDetails> = {
    chicken: {
      id: "chicken",
      name: "Chicken Flavour",
      tagline: "Deep savory richness for soups, stews & everyday cooking.",
      fullDescription:
        "Julizen Chicken Flavour Seasoning Powder is carefully blended to bring out the full, natural depth of chicken in every dish. It enhances soups, gravies, vegetable stews and jollof rice with a warm, savory roundness that makes food taste like it was cooked for hours. Made with quality spices and balanced seasoning — no overpowering aftertaste, just clean, rich flavour that keeps the family coming back for seconds.",
      cookingTips: [
        "Add one teaspoonful to 400ml of boiling water for soups and gravies.",
        "Rub directly onto chicken before grilling or frying for deeper flavour.",
        "Stir into fried rice while cooking for a fuller, savory base.",
        "Add to your stew pot 10 minutes before serving for best results.",
      ],
      foodImage: "/images/food-egusi-semo.png",
      foodCaption: "Hearty egusi soup with semo — elevated with Julizen Chicken Flavour",
      accentColor: "#D97706",
    },
    crayfish: {
      id: "crayfish",
      name: "Crayfish Flavour",
      tagline: "Authentic crayfish depth for traditional soups & native dishes.",
      fullDescription:
        "Julizen Crayfish Flavour Seasoning Powder delivers the bold, unmistakable taste of crayfish that Nigerians know and love — without the mess. It brings deep umami richness to egusi soup, oha, bitterleaf, okra, and any traditional dish that calls for real crayfish flavour. Each sachet is concentrated to give your soup that thick, flavorful base that makes people ask \"what did you put in this?\"",
      cookingTips: [
        "Dissolve one teaspoonful in soup stock before adding your main ingredients.",
        "Use in egusi or okra soup to amplify the crayfish flavour naturally.",
        "Combine with fresh pepper and palm oil for an authentic pepper soup base.",
        "Add to ofe onugbu or bitterleaf soup for traditional depth.",
      ],
      foodImage: "/images/food-okro-soup.png",
      foodCaption: "Rich draw okro soup with crayfish, meat & fish — made with Julizen Crayfish Flavour",
      accentColor: "#B45309",
    },
    "fried-rice": {
      id: "fried-rice",
      name: "Fried Rice",
      tagline: "Golden, aromatic fried rice with every spoonful.",
      fullDescription:
        "Julizen Fried Rice Seasoning Powder is precisely blended for Nigerian-style fried rice — delivering that vibrant golden color, warm spice aroma, and satisfying savory taste that makes fried rice the star of any party or family meal. It balances turmeric, seasoning spices, and natural flavouring to produce perfectly seasoned rice without the guesswork. One sachet, perfect rice — every single time.",
      cookingTips: [
        "Add one teaspoonful to 420ml of boiling water and pour directly into your rice.",
        "Use when frying the rice with mixed vegetables for deeper, even flavour.",
        "Combine with a small amount of butter when stir-frying for restaurant-level richness.",
        "Add toward the end of cooking to preserve the aromatic spice notes.",
      ],
      foodImage: "/images/food-nigerian-fried-rice.png",
      foodCaption: "Golden Nigerian fried rice with chicken & plantain — seasoned with Julizen Fried Rice",
      accentColor: "#65A30D",
    },
    "stew-jollof": {
      id: "stew-jollof",
      name: "Stew & Jollof",
      tagline: "Bold, rich flavour for stews and jollof that people remember.",
      fullDescription:
        "Julizen Stew & Jollof Seasoning Powder is the secret behind that deep, smoky, party-jollof flavour that everyone keeps asking about. Crafted with a balanced blend of tomato, onion, basil, garlic, and warm spices, it brings consistency and depth to your jollof rice and meat stew — whether you're cooking for four or forty. Rich colour, bold flavour, and the kind of finish that has guests serving themselves a second plate.",
      cookingTips: [
        "Add to your tomato-pepper blended base while frying the stew.",
        "Stir one teaspoonful into your jollof rice pot after adding the tomato sauce.",
        "Use when browning meat for stew to build a flavourful, deeply seasoned base.",
        "Combine with stock and seasoning to create a concentrated sauce for rice dishes.",
      ],
      foodImage: "/images/food-party-jollof.png",
      foodCaption: "Smoky party jollof rice with grilled chicken — the Julizen Stew & Jollof taste",
      accentColor: "#DC2626",
    },
  };

  const SIZE_CONFIG: Array<{
    size: "10g" | "100g" | "400g";
    packLabel: string;
    packDetail: string;
  }> = [
    { size: "10g",  packLabel: "Sachet",  packDetail: "10g × 10 × 42 rolls (carton)" },
    { size: "100g", packLabel: "Pouch",   packDetail: "100g × 5 × 60 sachets (carton)" },
    { size: "400g", packLabel: "Value Pack", packDetail: "400g × 20 sachets (carton)" },
  ];

  const IMAGE_MAP: Record<FlavorId, Record<"10g" | "100g" | "400g", { front: string; back: string }>> = {
    chicken: {
      "10g":  { front: "/images/product-chicken-10g-front.jpg",  back: "/images/product-chicken-10g-back.jpg"  },
      "100g": { front: "/images/product-chicken-100g-front.jpg", back: "/images/product-chicken-100g-back.jpg" },
      "400g": { front: "/images/product-chicken-400g-front.jpg", back: "/images/product-chicken-400g-back.jpg" },
    },
    crayfish: {
      "10g":  { front: "/images/product-crayfish-10g-front.jpg",  back: "/images/product-crayfish-10g-back.jpg"  },
      "100g": { front: "/images/product-crayfish-100g-front.jpg", back: "/images/product-crayfish-100g-back.jpg" },
      "400g": { front: "/images/product-crayfish-400g-front.jpg", back: "/images/product-crayfish-400g-back.jpg" },
    },
    "fried-rice": {
      "10g":  { front: "/images/product-fried-rice-10g-front.jpg",  back: "/images/product-fried-rice-10g-back.jpg"  },
      "100g": { front: "/images/product-fried-rice-100g-front.jpg", back: "/images/product-fried-rice-100g-back.jpg" },
      "400g": { front: "/images/product-fried-rice-100g-front.jpg", back: "/images/product-fried-rice-100g-back.jpg" },
    },
    "stew-jollof": {
      "10g":  { front: "/images/product-stew-jollof-10g-front.jpg",  back: "/images/product-stew-jollof-10g-back.jpg"  },
      "100g": { front: "/images/product-stew-jollof-100g-front.jpg", back: "/images/product-stew-jollof-100g-back.jpg" },
      "400g": { front: "/images/product-stew-jollof-100g-front.jpg", back: "/images/product-stew-jollof-100g-back.jpg" },
    },
  };

  function buildProducts(): ProductEntry[] {
    const entries: ProductEntry[] = [];
    for (const sizeConf of SIZE_CONFIG) {
      const flavours: FlavorId[] = ["chicken", "crayfish", "fried-rice", "stew-jollof"];
      for (const id of flavours) {
        const detail = FLAVOR_DETAILS[id];
        const imgs = IMAGE_MAP[id][sizeConf.size];
        entries.push({
          ...detail,
          ...sizeConf,
          frontImage: imgs.front,
          backImage: imgs.back,
          whatsappMessage: `Hello, I want to order Julizen ${detail.name} Seasoning Powder ${sizeConf.size} (${sizeConf.packDetail}). Please send me the details and price.`,
        });
      }
    }
    return entries;
  }

  const ALL_PRODUCTS = buildProducts();

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

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }, [onClose]);

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
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="relative z-10 w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close product details"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Food hero image */}
            <div className="relative h-52 w-full overflow-hidden rounded-t-3xl sm:h-64 sm:rounded-t-3xl">
              <img
                src={getImageUrl(product.foodImage)}
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

            {/* Body */}
            <div className="p-5 sm:p-7">
              {/* Header */}
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

              {/* Images: front + back */}
              <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-[#fef9ee] p-4">
                {[
                  { img: product.frontImage, side: "front" },
                  { img: product.backImage,  side: "back"  },
                ].map(({ img, side }) => (
                  <div key={side} className="relative">
                    <img
                      src={getImageUrl(img)}
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

              {/* Full description */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">About This Product</h3>
                </div>
                <p className="text-sm leading-7 text-gray-600">{product.fullDescription}</p>
              </div>

              {/* Cooking tips */}
              <div className="mb-7">
                <div className="mb-3 flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">How To Use</h3>
                </div>
                <ul className="space-y-2.5">
                  {product.cookingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: product.accentColor }}
                      >
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Now — {product.size}
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 py-3.5 text-sm font-semibold text-secondary transition hover:bg-gray-50 sm:flex-none sm:px-8"
                >
                  Close
                </button>
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

    return (
      <article
        className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_20px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.13)]"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* ── Images ── */}
        <div className="relative grid grid-cols-2 bg-gradient-to-b from-[#fef9ee] to-[#f1ede3]">
          {/* Front */}
          <div className="flex items-end justify-center border-r border-white/70 px-4 pt-6 pb-4">
            <div className="w-full">
              <img
                src={getImageUrl(product.frontImage)}
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
          {/* Back */}
          <div className="flex items-end justify-center px-4 pt-6 pb-4">
            <div className="w-full">
              <img
                src={getImageUrl(product.backImage)}
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
          {/* Weight badge */}
          <span className="absolute bottom-2 right-2 rounded-full bg-secondary/85 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            {product.size}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
          {/* Category */}
          <span
            className="mb-2 inline-block self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: product.accentColor }}
          >
            {product.category}
          </span>

          {/* Name */}
          <h4 className="mb-1 font-display text-[15px] font-bold leading-snug text-secondary" itemProp="name">
            Julizen {product.name}
            <span className="ml-1.5 font-normal text-sm text-muted-foreground">· {product.size}</span>
          </h4>

          {/* Tagline */}
          <p className="mb-3 text-[12px] leading-5 text-muted-foreground" itemProp="description">
            {product.tagline}
          </p>

          {/* Packaging */}
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
            <Package2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-[11px] font-semibold text-gray-600">{product.packDetail}</span>
          </div>

          {/* CTAs */}
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
  // SIZE GROUP ROW
  // ─────────────────────────────────────────────────────────────────────────────

  const SIZE_LABELS: Record<string, string> = {
    "10g": "Perfect for everyday cooking & catering packs",
    "100g": "Ideal for households & regular family cooking",
    "400g": "Best value for large families, caterers & resellers",
  };

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
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: groupIndex * 0.04, duration: 0.45 }}
      >
        {/* Group header */}
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

        {/* Cards */}
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

    const grouped = SIZE_CONFIG.map((s) => ({
      size: s.size,
      products: ALL_PRODUCTS.filter((p) => p.size === s.size),
    }));

    return (
      <>
        <section
          id="products"
          aria-label="Julizen Seasoning Products"
          className="scroll-mt-24 bg-white py-20 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* ── Section header ── */}
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
                  Julizen Seasoning is the real &ldquo;Baba&rdquo; in cooking &mdash; crafted to deliver
                  rich, mouth-watering flavour in every spoonful. Whether it&apos;s your everyday meal
                  or a special dish, Julizen brings out the deep, authentic taste that keeps people
                  asking for more.
                </p>
                <p>
                  From quick home cooking to full family feasts, one thing stays the same &mdash; bold
                  flavour, perfect balance, and a taste you can trust every time.
                </p>
              </motion.div>
            </div>

            {/* ── Size groups ── */}
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

        {/* ── Modal ── */}
        {activeProduct && (
          <ProductModal product={activeProduct} onClose={closeModal} />
        )}
      </>
    );
  }
  