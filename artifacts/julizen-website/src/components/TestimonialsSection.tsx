import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I used it for my jollof rice and the taste came out really good. My family finished the pot.",
    name: "Adaeze O.",
    location: "Lagos",
    stars: 5,
    delay: 0
  },
  {
    quote: "It made cooking easier and the result was consistent. I cook fried rice every weekend now and the taste doesn't change.",
    name: "Emeka K.",
    location: "Abuja",
    stars: 5,
    delay: 0.2
  },
  {
    quote: "I've started using it regularly for my soups. The crayfish blend works well — not too strong, just right.",
    name: "Fatima A.",
    location: "Kano",
    stars: 4,
    delay: 0.4
  }
];

export function TestimonialsSection() {
  return (
    <section aria-label="Customer testimonials for Julizen seasoning" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
          >
            What People Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Feedback from everyday cooks who use Julizen in their homes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: t.delay, duration: 0.5 }}
              className="p-8 rounded-3xl bg-muted/50 border border-border hover:shadow-lg transition-all duration-300 flex flex-col"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex gap-1 mb-6" aria-label={`${t.stars} out of 5 stars`} itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={String(t.stars)} />
                <meta itemProp="bestRating" content="5" />
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.stars ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-base text-foreground/80 mb-8 leading-relaxed flex-grow" itemProp="reviewBody">
                "{t.quote}"
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base shrink-0" aria-hidden="true">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-foreground text-sm block" itemProp="author">{t.name}</cite>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
