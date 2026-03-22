import { motion } from "framer-motion";
import { products, formatNaira } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-muted relative scroll-mt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6"
          >
            Julizen Seasoning Powder
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Made to bring out the best in your cooking. Add it to your meals and enjoy a rich, well-balanced taste every time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: any, index: number }) {
  const whatsappLink = generateWhatsAppLink(`Hello, I want to order ${product.name} from Julizen`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-border transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-secondary shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-xl font-bold font-display text-foreground leading-tight">
            {product.name}
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm flex-grow mb-6">
          {product.description}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="text-2xl font-bold text-primary">
            {formatNaira(product.price)}
          </div>
          
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-primary transition-colors duration-300 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
