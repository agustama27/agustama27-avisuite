import { supabaseService } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  let query = supabaseService
    .from("Geneticas")
    .select("id,nombre")
    .order("nombre", { ascending: true })
    .limit(30);

  if (q && q.trim()) {
    query = query.ilike("nombre", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const items = (data || []).map((g: any) => ({
    id: g.id,
    title: g.nombre
  }));
  return NextResponse.json({ ok: true, items });
}
