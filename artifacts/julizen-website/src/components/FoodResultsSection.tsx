import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/imageUrl";

const results = [
  {
    title: "Perfect Jollof Rice",
    image: "/images/food-jollof-rice.webp",
    alt: "Plate of jollof rice prepared with Julizen Stew & Jollof seasoning powder",
    delay: 0
  },
  {
    title: "Fried Rice",
    image: "/images/food-fried-rice.webp",
    alt: "Plate of fried rice cooked with Julizen Fried Rice seasoning powder",
    delay: 0.15
  },
  {
    title: "Authentic Soup",
    image: "/images/food-soup.webp",
    alt: "Bowl of rich soup made with Julizen Crayfish Flavour seasoning powder",
    delay: 0.3
  }
];

export function FoodResultsSection() {
  return (
    <section aria-label="Meals made with Julizen seasoning powder" className="py-24 bg-secondary text-white relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold mb-6"
            >
              See the Difference <span className="text-primary">Julizen</span> Makes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/70"
            >
              Every well-prepared meal speaks for itself. These are everyday dishes made better with Julizen seasoning.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {results.map((result) => (
            <figure
              key={result.title}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-secondary-foreground/10"
            >
              <img
                src={getImageUrl(result.image)}
                alt={result.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                sizes="(min-width: 768px) 33vw, 100vw"
                width={600}
                height={750}
              />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <h3 className="text-2xl font-display font-bold text-white">
                  {result.title}
                </h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
