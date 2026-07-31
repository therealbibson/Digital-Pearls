/**
 * Central site contact + social config.
 * Edit these values in one place — they feed the footer, contact page, etc.
 */

export const site = {
  email: "advisory@digitalpearls.com",

  // E.164 for the tel: link (no spaces); `display` is what users see.
  phone: {
    tel: "+2348000000000",
    display: "+234 800 000 0000",
  },

  socials: [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/digital-pearls", icon: "linkedin" as const },
    { name: "X", href: "https://x.com/digitalpearls", icon: "x" as const },
  ],
};
