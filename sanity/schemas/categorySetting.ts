import { defineField, defineType } from "sanity";

export default defineType({
  name: "categorySetting",
  title: "Category Setting",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Drinks", value: "Drinks" },
          { title: "Breakfast", value: "Breakfast" },
          { title: "Lunch", value: "Lunch" },
          { title: "Dessert", value: "Dessert" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      description: "When off, dishes in this category are greyed out on /menu.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "hours",
      title: "Hours",
      description: "Display-only label (e.g. \"9am to 12pm\").",
      type: "string",
    }),
  ],
  preview: {
    select: {
      category: "category",
      enabled: "enabled",
      hours: "hours",
    },
    prepare: ({ category, enabled, hours }) => ({
      title: category,
      subtitle: `${enabled ? "ON" : "OFF"}${hours ? ` · ${hours}` : ""}`,
    }),
  },
});
