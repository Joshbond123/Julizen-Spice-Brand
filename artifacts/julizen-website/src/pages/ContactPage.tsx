import { useEffect } from "react";
  import { Navbar } from "@/components/Navbar";
  import { Footer } from "@/components/Footer";
  import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
  import { Phone, Mail, MessageCircle } from "lucide-react";
  import { useSettings } from "@/hooks/useSettings";

  function setPageMeta(title: string, description: string, canonical: string) {
    document.title = title;

    let descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descEl) descEl.content = description;

    let ogTitleEl = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitleEl) ogTitleEl.setAttribute("content", title);

    let ogDescEl = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDescEl) ogDescEl.setAttribute("content", description);

    let ogUrlEl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrlEl) ogUrlEl.setAttribute("content", canonical);

    let canonEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonEl) canonEl.href = canonical;

    let twitterTitleEl = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    if (twitterTitleEl) twitterTitleEl.setAttribute("content", title);

    let twitterDescEl = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
    if (twitterDescEl) twitterDescEl.setAttribute("content", description);
  }

  const HOME_TITLE = "Julizen Seasoning Powder | Jollof Rice, Fried Rice, Stew & Soup Seasoning — Nigeria";
  const HOME_DESCRIPTION = "Julizen seasoning powder delivers bold, authentic Nigerian flavor for jollof rice, fried rice, stew, soups, and everyday cooking. Available in 10g, 100g & 400g. Order via WhatsApp.";
  const HOME_CANONICAL = "https://joshbond123.github.io/Julizen-Spice-Brand/";

  export default function ContactPage() {
    const settings = useSettings();

    const waLink = `https://wa.me/${settings.whatsapp_number}`;

    useEffect(() => {
      setPageMeta(
        "Contact Us | Julizen Seasoning — Order via WhatsApp or Email",
        "Get in touch with Julizen Seasoning. Order our Nigerian seasoning powder for jollof rice, fried rice, stew, and soups via WhatsApp, phone, or email.",
        "https://joshbond123.github.io/Julizen-Spice-Brand/contact"
      );
      return () => {
        setPageMeta(HOME_TITLE, HOME_DESCRIPTION, HOME_CANONICAL);
      };
    }, []);

    return (
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <Navbar />
        <main className="pt-36 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Page Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                Get In Touch
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold font-display text-secondary mb-5 leading-tight">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Have a question about our products, want to place a bulk order, or need support? We're always available to help.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">

              {/* Phone */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Phone className="w-8 h-8 text-primary" aria-hidden="true" />
                </div>
                <h2 className="font-bold text-secondary font-display text-xl mb-4">Phone</h2>
                <div className="space-y-2">
                  {settings.contact_phone && (
                    <a
                      href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}
                      className="block text-muted-foreground hover:text-primary transition-colors font-medium"
                      aria-label={`Call Julizen Seasoning at ${settings.contact_phone}`}
                    >
                      {settings.contact_phone}
                    </a>
                  )}
                  {settings.contact_phone_2 && (
                    <a
                      href={`tel:${settings.contact_phone_2.replace(/\s/g, "")}`}
                      className="block text-muted-foreground hover:text-primary transition-colors font-medium"
                      aria-label={`Call Julizen Seasoning at ${settings.contact_phone_2}`}
                    >
                      {settings.contact_phone_2}
                    </a>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-primary" aria-hidden="true" />
                </div>
                <h2 className="font-bold text-secondary font-display text-xl mb-4">Email</h2>
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="block text-muted-foreground hover:text-primary transition-colors font-medium break-all"
                    aria-label={`Email Julizen Seasoning at ${settings.contact_email}`}
                  >
                    {settings.contact_email}
                  </a>
                )}
              </div>

              {/* WhatsApp */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <MessageCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
                </div>
                <h2 className="font-bold text-secondary font-display text-xl mb-4">WhatsApp</h2>
                <p className="text-muted-foreground text-sm mb-5">Chat with us directly for fast replies</p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md shadow-green-200 hover:-translate-y-0.5 text-sm"
                  aria-label="Chat with Julizen Seasoning on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* WhatsApp CTA Banner */}
            <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full" />
                <div className="absolute -bottom-20 -left-12 w-80 h-80 bg-white/10 rounded-full" />
              </div>
              <div className="relative px-8 py-12 sm:py-16 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mb-3">
                  Ready to Place an Order?
                </h2>
                <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
                  The fastest way to reach us is on WhatsApp. Tap the button and we'll respond right away.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-full transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 shadow-xl"
                  aria-label="Order Julizen Seasoning via WhatsApp"
                >
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }