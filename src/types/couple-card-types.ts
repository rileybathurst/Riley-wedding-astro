export type CoupleCardTypes = {
  id: string; // I think theres a better version of this
  bride?: string;
  groom?: string;
  slug: string;
  excerpt: string;
  title?: string;
  hero: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
};
