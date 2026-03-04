export interface Item {
  id: string;
  name: string;
  price: number;
  mainImage: string | null;
  description: string;
  additionalImages: string[];
  tags: string[];
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  sold: boolean;
  presale: boolean;
  retailLink: string;
}
