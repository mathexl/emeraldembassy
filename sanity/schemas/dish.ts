import { defineField, defineType } from "sanity";

export default defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "removableIngredients",
      title: "Removable Ingredients",
      description: "Ingredients a guest can ask to remove.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "options",
      title: "Options",
      description: "Required pick-one options (e.g. Milk, Protein).",
      type: "array",
      of: [
        {
          type: "object",
          name: "dishOption",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "choices",
              title: "Choices",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label", choices: "choices" },
            prepare: ({ title, choices }) => ({
              title,
              subtitle: Array.isArray(choices) ? choices.join(", ") : "",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "rank",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Category, then rank",
      name: "categoryRank",
      by: [
        { field: "category", direction: "asc" },
        { field: "rank", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", category: "category", available: "available" },
    prepare: ({ title, category, available }) => ({
      title,
      subtitle: `${category ?? "Uncategorized"} — ${available ? "Available" : "Unavailable"}`,
    }),
  },
});
