import { motion } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/utils";
import { MessageCircle, Truck, Store } from "lucide-react";

export function CTASection() {
  const whatsappLink = generateWhatsAppLink("Hello, I want to order Julizen seasoning");

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent"></div>

      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-5 leading-tight"
        >
          Order Julizen Seasoning Powder
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Order Julizen seasoning powder — the best Nigerian seasoning for jollof rice, fried rice, stew, and soups — easily through WhatsApp for fast delivery across Nigeria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-medium">
            <Truck className="w-4 h-4" />
            Fast Delivery
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-medium">
            <Store className="w-4 h-4" />
            Available for wholesalers and retailers
          </div>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-white text-primary font-bold text-xl shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 fill-primary text-primary" />
          Order on WhatsApp
        </motion.a>
      </div>
    </section>
  );
}
