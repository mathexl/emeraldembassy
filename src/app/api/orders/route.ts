import { NextRequest, NextResponse } from "next/server";
import { sanityFresh, sanityWrite } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? "active";
  const orders = await sanityFresh.fetch(
    `*[_type == "order" && status == $status] | order(orderNumber desc){
      _id,
      orderNumber,
      customerName,
      seating,
      status,
      createdAt,
      dismissedAt,
      items[]{
        _key,
        dishName,
        quantity,
        removedIngredients,
        selectedOptions[]{ label, choice },
        notes
      }
    }`,
    { status }
  );
  return NextResponse.json({ orders });
}

type IncomingItem = {
  dishId: string;
  dishName: string;
  quantity: number;
  removedIngredients?: string[];
  selectedOptions?: { label: string; choice: string }[];
  notes?: string;
};

type IncomingOrder = {
  customerName?: string;
  seating: "Dining Room" | "Window Lounge" | "Bedroom";
  items: IncomingItem[];
};

export async function POST(req: NextRequest) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Server missing SANITY_WRITE_TOKEN" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as IncomingOrder;
  const seatingOptions = ["Dining Room", "Window Lounge", "Bedroom"];
  if (!seatingOptions.includes(body.seating)) {
    return NextResponse.json({ error: "Invalid seating" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const maxNumber: number | null = await sanityFresh.fetch(
    `*[_type == "order"] | order(orderNumber desc)[0].orderNumber`
  );
  const orderNumber = (maxNumber ?? 0) + 1;

  const customerName = (body.customerName ?? "").trim();
  const doc = {
    _type: "order",
    orderNumber,
    ...(customerName ? { customerName } : {}),
    seating: body.seating,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    items: body.items.map((item) => ({
      _type: "orderItem",
      _key: crypto.randomUUID(),
      dish: { _type: "reference", _ref: item.dishId },
      dishName: item.dishName,
      quantity: Math.max(1, Math.floor(item.quantity || 1)),
      removedIngredients: item.removedIngredients ?? [],
      selectedOptions: (item.selectedOptions ?? []).map((so) => ({
        _type: "selectedOption",
        _key: crypto.randomUUID(),
        label: so.label,
        choice: so.choice,
      })),
      notes: item.notes ?? "",
    })),
  };

  const created = await sanityWrite.create(doc);
  return NextResponse.json({ orderNumber, id: created._id });
}
