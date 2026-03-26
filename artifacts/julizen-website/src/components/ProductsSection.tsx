import { motion } from "framer-motion";
  import { getImageUrl } from "@/lib/imageUrl";
  import { generateWhatsAppLink } from "@/lib/utils";
  import { ShoppingBag } from "lucide-react";

  // ─── Data ──────────────────────────────────────────────────────────────────

  type Flavour = {
    id: string;
    name: string;
    category: string;
  };

  type SizeGroup = {
    size: "10g" | "100g" | "400g";
    packagingDetail: string;
    products: Array<
      Flavour & { frontImage: string; backImage: string; whatsappMessage: string }
    >;
  };

  const FLAVOURS: Flavour[] = [
    { id: "chicken", name: "Chicken Flavour", category: "Chicken Flavour" },
    { id: "crayfish", name: "Crayfish Flavour", category: "Crayfish Flavour" },
    { id: "fried-rice", name: "Fried Rice", category: "Fried Rice" },
    { id: "stew-jollof", name: "Stew & Jollof", category: "Stew & Jollof" },
  ];

  const sizeGroups: SizeGroup[] = [
    {
      size: "10g",
      packagingDetail: "10g × 10 × 42 rolls in a carton",
      products: [
        {
          ...FLAVOURS[0],
          frontImage: "/images/product-chicken-10g-front.jpg",
          backImage: "/images/product-chicken-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 10g (42 rolls/carton). Please send me details.",
        },
        {
          ...FLAVOURS[1],
          frontImage: "/images/product-crayfish-10g-front.jpg",
          backImage: "/images/product-crayfish-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 10g (42 rolls/carton). Please send me details.",
        },
        {
          ...FLAVOURS[2],
          frontImage: "/images/product-fried-rice-10g-front.jpg",
          backImage: "/images/product-fried-rice-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 10g (42 rolls/carton). Please send me details.",
        },
        {
          ...FLAVOURS[3],
          frontImage: "/images/product-stew-jollof-10g-front.jpg",
          backImage: "/images/product-stew-jollof-10g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 10g (42 rolls/carton). Please send me details.",
        },
      ],
    },
    {
      size: "100g",
      packagingDetail: "100g × 5 × 60 sachets",
      products: [
        {
          ...FLAVOURS[0],
          frontImage: "/images/product-chicken-100g-front.jpg",
          backImage: "/images/product-chicken-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 100g (60 sachets). Please send me details.",
        },
        {
          ...FLAVOURS[1],
          frontImage: "/images/product-crayfish-100g-front.jpg",
          backImage: "/images/product-crayfish-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 100g (60 sachets). Please send me details.",
        },
        {
          ...FLAVOURS[2],
          frontImage: "/images/product-fried-rice-100g-front.jpg",
          backImage: "/images/product-fried-rice-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 100g (60 sachets). Please send me details.",
        },
        {
          ...FLAVOURS[3],
          frontImage: "/images/product-stew-jollof-100g-front.jpg",
          backImage: "/images/product-stew-jollof-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 100g (60 sachets). Please send me details.",
        },
      ],
    },
    {
      size: "400g",
      packagingDetail: "400g × 20 sachets in a carton",
      products: [
        {
          ...FLAVOURS[0],
          frontImage: "/images/product-chicken-400g-front.jpg",
          backImage: "/images/product-chicken-400g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Chicken Flavour Seasoning Powder 400g (20 sachets/carton). Please send me details.",
        },
        {
          ...FLAVOURS[1],
          frontImage: "/images/product-crayfish-400g-front.jpg",
          backImage: "/images/product-crayfish-400g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Crayfish Flavour Seasoning Powder 400g (20 sachets/carton). Please send me details.",
        },
        {
          ...FLAVOURS[2],
          frontImage: "/images/product-fried-rice-100g-front.jpg",
          backImage: "/images/product-fried-rice-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Fried Rice Seasoning Powder 400g (20 sachets/carton). Please send me details.",
        },
        {
          ...FLAVOURS[3],
          frontImage: "/images/product-stew-jollof-100g-front.jpg",
          backImage: "/images/product-stew-jollof-100g-back.jpg",
          whatsappMessage: "Hello, I want to order Julizen Stew & Jollof Seasoning Powder 400g (20 sachets/carton). Please send me details.",
        },
      ],
    },
  ];

  // ─── Section ────────────────────────────────────────────────────────────────

  export function ProductsSection() {
    return (
      <section
        id="products"
        aria-label="Julizen Seasoning Products"
        className="scroll-mt-24 bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
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
                Julizen Seasoning is the real &ldquo;Baba&rdquo; in cooking &mdash; crafted to deliver rich,
                mouth-watering flavor in every spoonful. Whether it&apos;s your everyday meal or a special
                dish, Julizen brings out the deep, authentic taste that keeps people asking for more.
              </p>
              <p>
                From quick home cooking to full family feasts, one thing stays the same &mdash; bold
                flavor, perfect balance, and a taste you can trust every time.
              </p>
            </motion.div>
          </div>

          {/* Size Groups */}
          <div className="space-y-20 sm:space-y-28">
            {sizeGroups.map((group, gi) => (
              <SizeSection key={group.size} group={group} groupIndex={gi} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Size Section ────────────────────────────────────────────────────────────

  function SizeSection({
    group,
    groupIndex,
  }: {
    group: SizeGroup;
    groupIndex: number;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.05 }}
      >
        {/* Size heading row */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              {group.size}
            </span>
            <div>
              <h3 className="text-xl font-display font-bold text-secondary sm:text-2xl">
                {group.size} Pack
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{group.packagingDetail}</p>
            </div>
          </div>
          <div className="ml-4 h-px flex-1 bg-gray-200" aria-hidden="true" />
        </div>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {group.products.map((product, pi) => (
            <ProductCard
              key={product.id + group.size}
              product={product}
              size={group.size}
              packagingDetail={group.packagingDetail}
              priority={groupIndex === 0 && pi < 2}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // ─── Product Card ─────────────────────────────────────────────────────────────

  type ProductCardProps = {
    product: SizeGroup["products"][number];
    size: string;
    packagingDetail: string;
    priority: boolean;
  };

  function ProductCard({ product, size, packagingDetail, priority }: ProductCardProps) {
    const whatsappLink = generateWhatsAppLink(product.whatsappMessage);

    return (
      <article
        className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(15,23,42,0.12)]"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* ── Images: front & back side-by-side ── */}
        <div className="relative grid grid-cols-2 gap-0 bg-gradient-to-b from-[#fef9ee] to-[#f5f1e8]">
          {/* Front */}
          <div className="flex items-center justify-center border-r border-white/60 p-4">
            <div className="relative w-full">
              <span className="absolute top-0 left-0 z-10 rounded-br-md rounded-tl-md bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400 backdrop-blur-sm">
                Front
              </span>
              <img
                src={getImageUrl(product.frontImage)}
                alt={`Julizen ${product.name} ${size} — front`}
                className="h-auto w-full object-contain"
                style={{ aspectRatio: "3/4" }}
                width={160}
                height={213}
                fetchPriority={priority ? "high" : "auto"}
                decoding="sync"
                itemProp="image"
              />
            </div>
          </div>

          {/* Back */}
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full">
              <span className="absolute top-0 left-0 z-10 rounded-br-md rounded-tl-md bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400 backdrop-blur-sm">
                Back
              </span>
              <img
                src={getImageUrl(product.backImage)}
                alt={`Julizen ${product.name} ${size} — back label`}
                className="h-auto w-full object-contain"
                style={{ aspectRatio: "3/4" }}
                width={160}
                height={213}
                fetchPriority="auto"
                decoding="async"
              />
            </div>
          </div>

          {/* Size badge overlay */}
          <div className="absolute bottom-2 right-2 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            NET WT: {size}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col border-t border-gray-100 px-4 pb-5 pt-4">
          <span className="mb-1.5 inline-block self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {product.category}
          </span>
          <h4 className="mb-1 text-sm font-display font-bold leading-snug text-secondary" itemProp="name">
            Julizen {product.name}
          </h4>
          <p className="mb-4 text-[12px] leading-5 text-muted-foreground">{packagingDetail}</p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order Julizen ${product.name} ${size} via WhatsApp`}
            className="mt-auto inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Order Now
          </a>
        </div>
      </article>
    );
  }
  