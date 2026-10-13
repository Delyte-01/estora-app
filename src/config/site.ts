export const siteConfig = {
  brand: {
    name: "ESTORA",
    descriptor: "PROPERTY GROUP",
  },
  contact: {
    whatsappNumber: "+2348139760048",
    email: "hello@estora.example",
    phoneDisplay: "+234 8139760048",
  },
  nav: [
    { label: "Properties", href: "/properties" },
    { label: "Our Approach", href: "/#approach" },
    { label: "About", href: "/#about" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],
} as const;

export function getWhatsAppUrl(message?: string): string {
  const number = siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

export const defaultWhatsAppMessage =
  "Hello ESTORA, I'd like to enquire about a property.";
