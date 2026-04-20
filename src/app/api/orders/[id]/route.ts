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
  const body = (await req.json()) as { action: "dismiss" | "restore" };

  if (body.action === "dismiss") {
    await sanityWrite
      .patch(id)
      .set({ status: "dismissed", dismissedAt: new Date().toISOString() })
      .commit();
  } else if (body.action === "restore") {
    await sanityWrite
      .patch(id)
      .set({ status: "active" })
      .unset(["dismissedAt"])
      .commit();
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
