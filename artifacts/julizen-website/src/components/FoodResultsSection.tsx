import { motion } from "framer-motion";

const results = [
  {
    title: "Perfect Jollof Rice",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80",
    delay: 0
  },
  {
    title: "Authentic Pepper Soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    delay: 0.2
  },
  {
    title: "Spicy Suya Platter",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    delay: 0.4
  }
];

export function FoodResultsSection() {
  return (
    <section className="py-24 bg-secondary text-white relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary"></div>
      
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
              Every meal deserves to be unforgettable. Our signature blends bring authentic, mouthwatering flavor to your home kitchen instantly.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {results.map((result) => (
            <motion.div
              key={result.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: result.delay, duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-secondary-foreground/10"
            >
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <h3 className="text-2xl font-display font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {result.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
