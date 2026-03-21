import { motion } from "framer-motion";
import { UtensilsCrossed, ChefHat, Heart } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UtensilsCrossed,
    title: "Season Your Dish",
    description: "Add a spoonful of Julizen seasoning to your raw ingredients or marinade."
  },
  {
    num: "02",
    icon: ChefHat,
    title: "Cook with Love",
    description: "Follow your favorite recipe and let the heat unlock the aromatic spices."
  },
  {
    num: "03",
    icon: Heart,
    title: "Enjoy Rich Flavor",
    description: "Serve and savor every delicious bite with friends and family."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
          >
            Ready in 3 Simple Steps
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Great cooking doesn't have to be complicated. We've done the hard work of blending the perfect spices for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative text-center flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full bg-white shadow-xl shadow-black/5 flex items-center justify-center mb-8 relative border border-border">
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {step.num}
                </span>
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold font-display text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-[280px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
