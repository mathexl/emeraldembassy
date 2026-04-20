import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderingSchemas } from "./sanity/schemas";

export default defineConfig({
  name: "emerald-embassy",
  title: "Emerald Embassy x Secret Home Cafe",
  projectId: "qeirzen7",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: orderingSchemas,
  },
});
