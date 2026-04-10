import { Instagram, Facebook, Twitter, Phone, Mail } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";
import { useSettings } from "@/hooks/useSettings";

export function Footer() {
  const settings = useSettings();

  const whatsappLink = generateWhatsAppLink(
    "Hello, I want to ask about Julizen seasoning",
    settings.whatsapp_number
  );

  return (
    <footer className="bg-secondary text-white/70 pt-20 pb-10" aria-label="Julizen Seasoning footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="md:col-span-2">
            <a
              href="#home"
              className="inline-block mb-6 group"
              aria-label="Julizen Seasoning — go to homepage"
            >
              <img
                src={getImageUrl("/images/julizen-logo-transparent.webp")}
                alt="Julizen Seasoning — seasoning powder for jollof rice, fried rice and soups"
                className="h-20 sm:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-80"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={600}
                height={400}
              />
            </a>
            <p className="max-w-md text-white/60 leading-relaxed">
              Julizen is a seasoning brand designed to support everyday cooking with consistent,
              reliable results. Suitable for home use, wholesale, and retail distribution.
            </p>
          </div>

          <nav aria-label="Footer quick links">
            <h2 className="text-white font-bold mb-6 font-display">Quick Links</h2>
            <ul className="space-y-4">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li>
                <a
                  href={`${import.meta.env.BASE_URL}contact`}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-primary font-medium"
                >
                  Order via WhatsApp
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-white font-bold mb-6 font-display">Contact Us</h2>
            <address className="not-italic">
              <ul className="space-y-3">
                {settings.contact_email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="hover:text-white transition-colors text-sm break-all"
                    >
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.contact_phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <a
                      href={`https://wa.me/${settings.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors text-sm"
                    >
                      {settings.contact_phone}
                    </a>
                  </li>
                )}
                {settings.contact_phone_2 && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <a
                      href={`tel:${settings.contact_phone_2.replace(/\s/g, "")}`}
                      className="hover:text-white transition-colors text-sm"
                    >
                      {settings.contact_phone_2}
                    </a>
                  </li>
                )}
                <li className="pt-3 flex gap-4">
                  <a
                    href="#"
                    rel="nofollow"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="Julizen on Instagram"
                  >
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    rel="nofollow"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="Julizen on Facebook"
                  >
                    <Facebook className="w-5 h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    rel="nofollow"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    aria-label="Julizen on Twitter"
                  >
                    <Twitter className="w-5 h-5" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Julizen Seasoning. All rights reserved.</p>
          <nav aria-label="Legal links">
            <div className="flex gap-6">
              <a href="#" rel="nofollow" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" rel="nofollow" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
