import { motion } from "framer-motion";
import { RefreshCw, UtensilsCrossed, CheckCircle, Building2 } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Consistent Taste",
    description: "Helps you achieve reliable results every time you cook.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10"
  },
  {
    icon: UtensilsCrossed,
    title: "Works Across Everyday Meals",
    description: "Suitable for rice dishes, soups, and more.",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: CheckCircle,
    title: "Simple to Use",
    description: "Easy to add during cooking with no complications.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Building2,
    title: "Trusted for Daily Cooking",
    description: "Designed for both home use and commercial kitchens.",
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function WhyJulizenSection() {
  return (
    <section id="why-julizen" className="py-24 bg-white relative overflow-hidden scroll-mt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
          >
            Why Choose Julizen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Here is what makes Julizen a practical choice for your kitchen.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors duration-300 text-center flex flex-col items-center"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 rotate-3`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
