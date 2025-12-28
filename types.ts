
export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
}

export interface Testimonial {
  name: string;
  title: string;
  stats: { label: string; value: string; trend?: string }[];
  quote: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
