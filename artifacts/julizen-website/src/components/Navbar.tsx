import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { cn, generateWhatsAppLink } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";
import { useSettings } from "@/hooks/useSettings";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [location, navigate] = useLocation();
  const settings = useSettings();

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On non-home pages the navbar sits over a light background — always use the
  // solid/dark style so icons and text are visible.
  const isHomePage = location === "/";
  const forceDark = !isHomePage;
  const isDark = forceDark || isScrolled;

  useEffect(() => {
    // Reset scroll state when navigating to a new page
    setIsScrolled(window.scrollY > 20);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Why Choose", href: "#why-julizen" },
    { name: "Instructions", href: "#how-it-works" },
    { name: "Contact Us", href: "/contact", isRoute: true },
  ];

  const whatsappLink = generateWhatsAppLink(
    "Hello, I want to order Julizen seasoning",
    settings.whatsapp_number
  );

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    const navbarHeight = headerRef.current?.offsetHeight ?? 120;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isRoute?: boolean
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (isRoute) {
      navigate(href);
      return;
    }
    if (location !== "/") {
      window.location.href = import.meta.env.BASE_URL + href;
      return;
    }
    scrollToSection(href);
  };

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      logoClickCount.current += 1;

      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);

      if (logoClickCount.current >= 5) {
        logoClickCount.current = 0;
        navigate("/admin");
        return;
      }

      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);

      if (location !== "/") {
        navigate("/");
        return;
      }
      scrollToSection("#home");
    },
    [location, navigate]
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isDark
          ? "bg-white/95 backdrop-blur-md shadow-sm border-border py-1"
          : "bg-transparent border-transparent py-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a
            href={import.meta.env.BASE_URL}
            onClick={handleLogoClick}
            className="flex items-center group py-1 select-none"
            draggable={false}
          >
            <img
              src={getImageUrl("/images/julizen-logo-transparent.webp")}
              alt="Julizen Seasoning Powder — Nigerian seasoning brand"
              className="h-20 sm:h-24 md:h-28 w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-90"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width={600}
              height={400}
            />
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={
                  link.isRoute
                    ? import.meta.env.BASE_URL.replace(/\/$/, "") + link.href
                    : link.href
                }
                onClick={(e) => handleNavClick(e, link.href, link.isRoute)}
                className={cn(
                  "font-medium text-sm hover:text-primary transition-colors cursor-pointer",
                  isDark
                    ? "text-foreground hover:text-primary"
                    : "text-white/90 hover:text-white",
                  link.isRoute &&
                    location === "/contact" &&
                    isDark &&
                    "text-primary font-semibold"
                )}
              >
                {link.name}
              </a>
            ))}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:-translate-y-0.5",
                isDark
                  ? "bg-primary text-white shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90"
                  : "bg-white text-primary shadow-black/10 hover:shadow-white/20"
              )}
            >
              Order via WhatsApp
            </a>
          </nav>

          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 -mr-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X
                className={cn(
                  "w-6 h-6",
                  isDark ? "text-foreground" : "text-white"
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "w-6 h-6",
                  isDark ? "text-foreground" : "text-white"
                )}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-border absolute top-full left-0 right-0 shadow-2xl z-50"
          >
            <ul className="px-4 pt-3 pb-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={
                      link.isRoute
                        ? import.meta.env.BASE_URL.replace(/\/$/, "") + link.href
                        : link.href
                    }
                    onClick={(e) => handleNavClick(e, link.href, link.isRoute)}
                    className={cn(
                      "block w-full text-left px-4 py-3 text-lg font-medium text-foreground hover:bg-muted rounded-xl transition-colors",
                      link.isRoute &&
                        location === "/contact" &&
                        "text-primary"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="pt-3 px-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-primary text-white font-semibold text-lg shadow-lg shadow-primary/25 active:bg-primary/90"
                >
                  Order via WhatsApp
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
