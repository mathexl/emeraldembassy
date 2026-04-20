import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seating",
      title: "Seating",
      type: "string",
      options: {
        list: [
          { title: "Dining Room", value: "Dining Room" },
          { title: "Window Lounge", value: "Window Lounge" },
          { title: "Bedroom", value: "Bedroom" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "orderItem",
          fields: [
            defineField({
              name: "dish",
              title: "Dish",
              type: "reference",
              to: [{ type: "dish" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "dishName",
              title: "Dish Name (snapshot)",
              type: "string",
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              initialValue: 1,
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "removedIngredients",
              title: "Removed Ingredients",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "selectedOptions",
              title: "Selected Options",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "selectedOption",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "choice", type: "string" }),
                  ],
                  preview: {
                    select: { label: "label", choice: "choice" },
                    prepare: ({ label, choice }) => ({
                      title: `${label}: ${choice}`,
                    }),
                  },
                },
              ],
            }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: "dishName",
              qty: "quantity",
              notes: "notes",
            },
            prepare: ({ title, qty, notes }) => ({
              title: `${qty}× ${title}`,
              subtitle: notes || undefined,
            }),
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Dismissed", value: "dismissed" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
    defineField({
      name: "dismissedAt",
      title: "Dismissed At",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Order number, newest first",
      name: "orderNumberDesc",
      by: [{ field: "orderNumber", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      seating: "seating",
      status: "status",
    },
    prepare: ({ orderNumber, seating, status }) => ({
      title: `Order #${orderNumber}`,
      subtitle: `${seating} — ${status}`,
    }),
  },
});
