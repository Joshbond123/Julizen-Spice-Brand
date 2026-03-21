import { motion } from "framer-motion";
import { FlaskConical, Award, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Carefully Blended",
    description: "Each seasoning is formulated with a precise balance of spices selected for authentic Nigerian cooking.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Award,
    title: "Bold & Balanced",
    description: "Our blends are crafted to enhance your dish without overpowering it — just the right depth every time.",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description: "Hygienically prepared and packaged in certified facilities to meet consistent food safety standards.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Order via WhatsApp and get it delivered straight to your door — quick and hassle-free.",
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function WhyJulizenSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
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
            From the kitchen to the table — here is what sets Julizen apart.
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
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
