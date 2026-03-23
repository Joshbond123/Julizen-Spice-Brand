import { motion } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/utils";

const articles = [
  {
    title: "How to Cook Perfect Jollof Rice",
    slug: "jollof-rice",
    tip: "Season early.",
    excerpt:
      "Start by frying your tomato base until the oil rises to the surface. Add Julizen Stew & Jollof Seasoning at this stage to build a deep, aromatic base. Steam your rice in the seasoned sauce to lock in the flavor throughout every grain.",
    icon: "🍅",
    label: "Stew & Jollof",
  },
  {
    title: "How to Elevate Your Fried Rice",
    slug: "fried-rice",
    tip: "Season while stir-frying.",
    excerpt:
      "Add Julizen Fried Rice Seasoning Powder while stir-frying — not before or after. This lets the heat activate the spices and coat every grain evenly. The result is a well-balanced, savory dish with a clean finish.",
    icon: "🍚",
    label: "Fried Rice",
  },
  {
    title: "Getting More from Your Soups",
    slug: "soups",
    tip: "Add in layers.",
    excerpt:
      "For richer soups and stews, add Julizen Crayfish Flavour Seasoning Powder in two stages — once at the start to build depth, and again near the end to sharpen the flavor. This layered approach gives your dish a full, satisfying taste without overpowering the other ingredients.",
    icon: "🍲",
    label: "Crayfish Flavour",
  },
];

export function SeoContentSection() {
  const whatsappLink = generateWhatsAppLink(
    "Hello, I want to order Julizen seasoning"
  );

  return (
    <section
      id="cooking-tips"
      className="py-24 bg-white scroll-mt-24"
      aria-label="Cooking tips and seasoning guides"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary"
          >
            Cooking Tips
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl md:text-4xl font-display font-bold text-secondary mb-4"
          >
            Get the Best from Every Meal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Simple techniques to help you cook with more confidence and get consistent results with Julizen seasoning powder.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-[#f9f9f7] overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-7 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl" role="img" aria-label={article.title}>
                    {article.icon}
                  </span>
                  <span className="text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-full">
                    {article.label}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-secondary leading-snug">
                  {article.title}
                </h3>
              </div>

              <div className="px-7 py-6 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 translate-y-[5px]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-secondary">
                    Tip: <span className="text-muted-foreground font-normal">{article.tip}</span>
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                  {article.excerpt}
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/75 transition-colors"
                  aria-label={`Order Julizen seasoning for ${article.title}`}
                >
                  Order this blend →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
