import { Instagram, Facebook, Twitter } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";

export function Footer() {
  const whatsappLink = generateWhatsAppLink("Hello, I want to ask about Julizen seasoning");

  return (
    <footer className="bg-secondary text-white/70 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="md:col-span-2">
            <a href="#home" className="inline-block mb-6 group">
              <picture>
                <img
                  src={getImageUrl("/images/julizen-logo.webp")}
                  alt="Julizen"
                  className="h-20 sm:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-80"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={600}
                  height={400}
                />
              </picture>
            </a>
            <p className="max-w-md text-white/60 leading-relaxed">
              Julizen is a seasoning brand designed to support everyday cooking with consistent, reliable results. Suitable for home use, wholesale, and retail distribution.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-primary font-medium">Order via WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Contact Us</h4>
            <ul className="space-y-4">
              <li><a href="mailto:info@julizen.com" className="hover:text-white transition-colors">info@julizen.com</a></li>
              <li><a href="tel:+2348000000000" className="hover:text-white transition-colors">+234 800 000 0000</a></li>
              <li className="pt-4 flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Julizen Seasoning. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
