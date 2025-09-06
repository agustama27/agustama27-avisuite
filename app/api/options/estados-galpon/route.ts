import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  const items = ["vacio", "en_crianza", "limpieza", "mantenimiento"].map((v) => ({
    id: v, title: v
  }));
  return NextResponse.json({ ok: true, items });
}
