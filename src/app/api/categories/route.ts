import { NextResponse } from "next/server";
import { sanityFresh } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await sanityFresh.fetch(
    `*[_type == "categorySetting"]{
      _id, category, enabled, hours
    }`
  );
  return NextResponse.json({ categories });
}
