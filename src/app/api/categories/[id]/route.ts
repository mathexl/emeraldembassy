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
  const body = (await req.json()) as { enabled: boolean };
  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "Missing enabled boolean" }, { status: 400 });
  }
  await sanityWrite.patch(id).set({ enabled: body.enabled }).commit();
  return NextResponse.json({ ok: true });
}
