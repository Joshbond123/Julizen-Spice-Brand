import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { motion } from "framer-motion";

export function FloatingWhatsApp() {
  const link = generateWhatsAppLink("Hello, I want to order Julizen seasoning");

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-lg shadow-black/20 hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
      <MessageCircle className="w-8 h-8 relative z-10" />
      <span className="sr-only">Order on WhatsApp</span>
    </motion.a>
  );
}
