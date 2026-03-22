import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";

export function HeroSection() {
  const whatsappLink = generateWhatsAppLink("Hello, I want to order Julizen seasoning");

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-secondary">
      {/* Background Image — portrait for mobile, landscape for desktop */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-food-mobile.png"
          alt="Mouthwatering Nigerian food spread"
          className="w-full h-full object-cover object-center block sm:hidden"
        />
        <img
          src="/images/hero-food.png"
          alt="Mouthwatering Nigerian food spread"
          className="w-full h-full object-cover object-center hidden sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-7"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1]">
            Cook Like a Chef.<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
              Taste the Difference.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Julizen seasoning powder is crafted to bring bold, authentic flavor to your meals — from everyday cooking to special occasions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#products"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-center"
            >
              Shop Now
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300 text-center"
            >
              See How It Works
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
