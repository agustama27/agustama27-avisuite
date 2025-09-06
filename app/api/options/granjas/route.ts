import { supabaseService } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  let query = supabaseService
    .from("Granjas")
    .select("id,nombre,ubicacion,tipo")
    .order("nombre", { ascending: true })
    .limit(20);

  if (q && q.trim()) {
    // filtro por nombre (case-insensitive)
    query = query.ilike("nombre", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const items = (data || []).map((g: any) => ({
    id: g.id,
    title: g.nombre,
    subtitle: [g.ubicacion, g.tipo].filter(Boolean).join(" • "),
  }));
  return NextResponse.json({ ok: true, items });
}
