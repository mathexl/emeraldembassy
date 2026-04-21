import { NextRequest, NextResponse } from "next/server";
import { sanityWrite } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Server missing SANITY_WRITE_TOKEN" },
      { status: 500 }
    );
  }
  const { id } = await params;
  const body = (await req.json()) as { available: boolean };
  if (typeof body.available !== "boolean") {
    return NextResponse.json(
      { error: "Missing available boolean" },
      { status: 400 }
    );
  }
  await sanityWrite.patch(id).set({ available: body.available }).commit();
  return NextResponse.json({ ok: true });
}
