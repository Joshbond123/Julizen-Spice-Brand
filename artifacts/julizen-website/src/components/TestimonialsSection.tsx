import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I've tried many seasonings but Julizen Jollof blend is on another level! My family can't stop eating.",
    name: "Adaeze O.",
    location: "Lagos",
    delay: 0
  },
  {
    quote: "The suya blend gave my backyard BBQ a proper Nigerian flavor. Everyone asked for the secret!",
    name: "Emeka K.",
    location: "Abuja",
    delay: 0.2
  },
  {
    quote: "I use the All-Purpose daily now. It makes everything taste so much better with minimal effort.",
    name: "Fatima A.",
    location: "Kano",
    delay: 0.4
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: t.delay, duration: 0.5 }}
              className="p-8 rounded-3xl bg-muted/50 border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg font-medium text-foreground mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
