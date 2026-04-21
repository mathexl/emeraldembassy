import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Run with: node --env-file=.env.local scripts/add-sweetness-options.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId: "qeirzen7",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const TARGET_NAMES = [
  "Kothami",
  "Rose Milk Tea",
  "Green Tea",
  "Black Coffee",
  "Latte",
  "Orange Latte",
];

const SWEETNESS = {
  label: "Sweetness",
  choices: ["None", "Light", "Regular", "Extra"],
};

const SWEETENER = {
  label: "Sweetener",
  choices: ["Sugar", "Honey"],
};

function makeOption(opt) {
  return {
    _key: randomUUID(),
    _type: "dishOption",
    label: opt.label,
    choices: opt.choices,
  };
}

async function main() {
  const dishes = await client.fetch(
    `*[_type == "dish" && name in $names]{_id, name, options}`,
    { names: TARGET_NAMES }
  );

  let patched = 0;
  for (const d of dishes) {
    const existing = Array.isArray(d.options) ? d.options : [];
    const labels = new Set(existing.map((o) => o.label));
    const next = [...existing];
    if (!labels.has("Sweetness")) next.push(makeOption(SWEETNESS));
    if (!labels.has("Sweetener")) next.push(makeOption(SWEETENER));

    if (next.length === existing.length) {
      console.log(`↪︎  skip ${d.name} (already has sweetness + sweetener)`);
      continue;
    }

    await client.patch(d._id).set({ options: next }).commit();
    console.log(`✓  update ${d.name}`);
    patched += 1;
  }

  const missing = TARGET_NAMES.filter(
    (name) => !dishes.some((d) => d.name === name)
  );
  if (missing.length) {
    console.warn(`\n⚠️  not found in Sanity: ${missing.join(", ")}`);
  }

  console.log(`\nPatched ${patched} / ${dishes.length} dishes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
