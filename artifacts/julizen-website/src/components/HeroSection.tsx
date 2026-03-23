import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1], delay },
});

export function HeroSection() {
  const whatsappLink = generateWhatsAppLink("Hello, I want to order Julizen seasoning");

  return (
    <section
      id="home"
      aria-label="Welcome to Julizen Seasoning"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-secondary"
    >
      {/* Hero image — subtle entrance: fade + very slight zoom out */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <picture className="block sm:hidden w-full h-full">
          <img
            src={getImageUrl("/images/hero-food-mobile.webp")}
            alt="Delicious Nigerian jollof rice and fried rice dishes prepared with Julizen seasoning powder"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            sizes="100vw"
            width={768}
            height={1408}
          />
        </picture>
        <picture className="hidden sm:block w-full h-full">
          <img
            src={getImageUrl("/images/hero-food.webp")}
            alt="Mouthwatering Nigerian food spread — jollof rice, fried rice and soups made with Julizen seasoning powder"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            sizes="100vw"
            width={1280}
            height={720}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        <div className="max-w-4xl mx-auto space-y-7">

          {/* Headline — first */}
          <motion.h1
            {...fadeUp(0.05)}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1]"
          >
            Cook Like a Chef.<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
              Taste the Difference.
            </span>
          </motion.h1>

          {/* Subtext — second */}
          <motion.p
            {...fadeUp(0.22)}
            className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed"
          >
            Julizen seasoning powder is crafted to bring bold, authentic flavor to your meals — from everyday cooking to special occasions.
          </motion.p>

          {/* Buttons — last, with hover scale */}
          <motion.div
            {...fadeUp(0.38)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.a
              href="#products"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-shadow duration-300 text-center"
            >
              Shop Now
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-colors duration-300 text-center"
            >
              See How It Works
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
