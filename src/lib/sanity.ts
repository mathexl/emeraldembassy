import { createClient } from "@sanity/client";

const projectId = "qeirzen7";
const dataset = "production";
const apiVersion = "2024-01-01";

export const sanityRead = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const sanityFresh = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const sanityWrite = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export const DISH_CATEGORIES = [
  "Drinks",
  "Breakfast",
  "Lunch",
  "Dessert",
] as const;
export type DishCategory = (typeof DISH_CATEGORIES)[number];

export type DishOption = {
  label: string;
  choices: string[];
};

export type Dish = {
  _id: string;
  name: string;
  category: DishCategory;
  description?: string;
  available: boolean;
  removableIngredients?: string[];
  options?: DishOption[];
  rank?: number;
};

export type SelectedOption = {
  label: string;
  choice: string;
};

export type OrderItem = {
  _key?: string;
  dishName: string;
  quantity: number;
  removedIngredients?: string[];
  selectedOptions?: SelectedOption[];
  notes?: string;
  dish?: { _ref: string };
};

export type Order = {
  _id: string;
  orderNumber: number;
  customerName?: string;
  seating: "Dining Room" | "Window Lounge" | "Bedroom";
  items: OrderItem[];
  status: "active" | "dismissed";
  createdAt: string;
  dismissedAt?: string;
};

export type CategorySetting = {
  _id: string;
  category: DishCategory;
  enabled: boolean;
  hours?: string;
};
