import { motion } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/utils";

const articles = [
  {
    title: "How to Cook Perfect Jollof Rice",
    slug: "jollof-rice",
    excerpt:
      "Perfect Nigerian jollof rice starts with the right seasoning powder. Julizen Stew & Jollof Seasoning brings out the deep tomato flavor and smoky aroma that makes jollof rice irresistible. Fry your tomato base until the oil floats, add your seasoning early, then steam the rice to lock in flavor.",
    icon: "🍅",
  },
  {
    title: "How to Improve Fried Rice Taste",
    slug: "fried-rice",
    excerpt:
      "Great Nigerian fried rice needs a balanced, savory seasoning powder that doesn't overpower the vegetables. Julizen Fried Rice Seasoning Powder is blended specifically for fried rice — add it while stir-frying your rice for a rich, restaurant-quality result every time.",
    icon: "🍚",
  },
  {
    title: "Best Seasoning for Nigerian Soups",
    slug: "nigerian-soups",
    excerpt:
      "From egusi to oha soup, Nigerian soups rely on bold, layered flavors. Julizen Crayfish Flavour Seasoning Powder adds the deep, savory crayfish taste that makes traditional soups stand out — without losing the natural aroma of your other ingredients.",
    icon: "🍲",
  },
];

export function SeoContentSection() {
  const whatsappLink = generateWhatsAppLink(
    "Hello, I want to order Julizen seasoning"
  );

  return (
    <section
      id="cooking-tips"
      className="py-24 bg-[#f9f9f7] scroll-mt-24"
      aria-label="Nigerian cooking tips and seasoning guides"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4"
          >
            Nigerian Cooking Tips with Julizen
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Learn how to get the best results from your favourite Nigerian dishes
            using Julizen seasoning powder.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="text-4xl mb-4" role="img" aria-label={article.title}>
                {article.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-secondary mb-3">
                {article.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1 text-sm">
                {article.excerpt}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                aria-label={`Order Julizen seasoning for ${article.title}`}
              >
                Try Julizen for this recipe →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
