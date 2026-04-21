import { NextRequest, NextResponse } from "next/server";
import { sanityWrite } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("[orders PATCH] start", {
    hasToken: Boolean(process.env.SANITY_WRITE_TOKEN),
    tokenLen: process.env.SANITY_WRITE_TOKEN?.length ?? 0,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  });
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error("[orders PATCH] missing SANITY_WRITE_TOKEN");
    return NextResponse.json(
      { error: "Server missing SANITY_WRITE_TOKEN" },
      { status: 500 }
    );
  }
  let id: string;
  let body: { action: "dismiss" | "restore" };
  try {
    id = (await params).id;
    body = (await req.json()) as { action: "dismiss" | "restore" };
    console.log("[orders PATCH] parsed", { id, action: body.action });
  } catch (err) {
    console.error("[orders PATCH] failed to parse request", err);
    return NextResponse.json(
      { error: "Bad request", detail: String(err) },
      { status: 400 }
    );
  }

  try {
    if (body.action === "dismiss") {
      const res = await sanityWrite
        .patch(id)
        .set({ status: "dismissed", dismissedAt: new Date().toISOString() })
        .commit();
      console.log("[orders PATCH] dismissed", { id, rev: res._rev });
    } else if (body.action === "restore") {
      const res = await sanityWrite
        .patch(id)
        .set({ status: "active" })
        .unset(["dismissedAt"])
        .commit();
      console.log("[orders PATCH] restored", { id, rev: res._rev });
    } else {
      console.warn("[orders PATCH] unknown action", { action: body.action });
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    const e = err as { message?: string; statusCode?: number; responseBody?: unknown };
    console.error("[orders PATCH] sanity write failed", {
      id,
      action: body.action,
      message: e?.message,
      statusCode: e?.statusCode,
      responseBody: e?.responseBody,
    });
    return NextResponse.json(
      { error: "Sanity write failed", detail: e?.message ?? String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
