import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Run with: node --env-file=.env.local scripts/ingest-menu.mjs"
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

const menu = {
  Drinks: [
    { name: "Kothami", description: "Ayurvedic coriander tisane" },
    {
      name: "Rose Milk Tea",
      description: "English rose tea mixed with milk of your choice",
    },
    { name: "Green Tea", description: null },
    { name: "Black Coffee", description: null },
    { name: "Latte", description: "Milk of your choice" },
    {
      name: "Orange Latte",
      description: "Milk of your choice topped with cold dragonfruit foam",
    },
    { name: "Lavender Lemonade", description: null },
    {
      name: "Peach & Dragonfruit",
      description: "Peach juice topped with cold dragonfruit foam",
    },
  ],
  Breakfast: [
    {
      name: "Spiced Eggs",
      description: "Eggs with seven spices, to preferred doneness",
    },
    {
      name: "Smoked Salmon Bagel",
      description: "Smoked salmon, capers, minced shallots, and truffle salt",
    },
  ],
  Lunch: [
    {
      name: "Steak & Mustard",
      description:
        "Sliced steak and mustard on ciabatta, with mayo, lettuce and roasted tomatoes",
    },
    {
      name: "Salmon Circle",
      description: "Salmon circle with a lemon herb sauce",
    },
    {
      name: "Tagliatelle Swirl",
      description: "Choice of shrimp or vegetable red sauce",
    },
    {
      name: "Bison Meatball",
      description: "If in market. Otherwise, will be substituted for beef.",
    },
  ],
  Dessert: [
    {
      name: "Courgette Scone",
      description:
        "Scones made of courgette and thyme, served with strawberry and champagne jam",
    },
    {
      name: "Blackberry Cake",
      description: "Blackberry-infused cake with blackberry compote",
    },
  ],
};

const categorySettings = [
  { category: "Drinks", hours: "" },
  { category: "Breakfast", hours: "9am to 12pm" },
  { category: "Lunch", hours: "12pm to 6pm" },
  { category: "Dessert", hours: "9am to 6pm" },
];

async function main() {
  const existingNames = new Set(
    await client.fetch(`*[_type == "dish"].name`)
  );
  const existingSettings = new Set(
    await client.fetch(`*[_type == "categorySetting"].category`)
  );

  let created = 0;
  let skipped = 0;
  let rank = 0;

  for (const [category, items] of Object.entries(menu)) {
    for (const item of items) {
      rank += 1;
      if (existingNames.has(item.name)) {
        console.log(`↪︎  skip  [${category}] ${item.name} (already exists)`);
        skipped += 1;
        continue;
      }
      await client.create({
        _type: "dish",
        name: item.name,
        category,
        description: item.description ?? undefined,
        available: true,
        removableIngredients: [],
        rank,
      });
      console.log(`✓  create [${category}] ${item.name}`);
      created += 1;
    }
  }

  let settingsCreated = 0;
  let settingsSkipped = 0;
  for (const s of categorySettings) {
    if (existingSettings.has(s.category)) {
      console.log(`↪︎  skip setting [${s.category}]`);
      settingsSkipped += 1;
      continue;
    }
    await client.create({
      _type: "categorySetting",
      category: s.category,
      enabled: true,
      hours: s.hours,
    });
    console.log(`✓  create setting [${s.category}] hours="${s.hours}"`);
    settingsCreated += 1;
  }

  console.log(
    `\nDishes — created: ${created}, skipped: ${skipped}\nSettings — created: ${settingsCreated}, skipped: ${settingsSkipped}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
