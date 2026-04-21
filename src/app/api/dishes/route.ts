import { NextResponse } from "next/server";
import { sanityFresh } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  const dishes = await sanityFresh.fetch(
    `*[_type == "dish"] | order(category asc, rank asc, name asc){
      _id, name, category, available, rank
    }`
  );
  return NextResponse.json({ dishes });
}
