import { motion } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function CTASection() {
  const whatsappLink = generateWhatsAppLink("Hello, I want to order Julizen seasoning");

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent"></div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
        >
          Order Now and Taste the Difference
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Delivered fresh to your door. Skip the hassle and order directly via WhatsApp in seconds.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-white text-primary font-bold text-xl shadow-2xl hover:scale-105 hover:shadow-white/20 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 fill-primary text-primary" />
          Order on WhatsApp
        </motion.a>
      </div>
    </section>
  );
}
