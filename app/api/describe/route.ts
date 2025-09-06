import { supabaseService } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Action = { kind: string; args: any };

export async function POST(req: NextRequest) {
  let body: { action: Action };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const { action } = body;
  if (!action?.kind) {
    return NextResponse.json({ ok: false, error: "Falta action.kind" }, { status: 400 });
  }

  const a = action.args || {};
  const bullets: { label: string; value: string }[] = [];
  let title = "";
  let ctaLabel = "Confirmar";
  let warn = "";

  async function nombreGranja(id?: string) {
    if (!id) return undefined;
    const { data } = await supabaseService
      .from("Granjas")
      .select("nombre")
      .eq("id", id)
      .maybeSingle();
    return data?.nombre;
  }

  switch (action.kind) {
    case "create_galpon": {
      title = `Crear galpón ${a.identificador || ""}`.trim();
      const ng = await nombreGranja(a.granja_id);
      bullets.push({ label: "Granja", value: ng ? `${ng} (${a.granja_id})` : a.granja_id || "—" });
      if (a.capacidad_aves !== undefined)
        bullets.push({ label: "Capacidad", value: String(a.capacidad_aves) });
      if (a.estado) bullets.push({ label: "Estado", value: a.estado });
      if (!a.granja_id) warn = "Falta seleccionar la granja.";
      break;
    }
    case "create_granja": {
      title = `Crear granja ${a.nombre || ""}`.trim();
      if (a.ubicacion) bullets.push({ label: "Ubicación", value: a.ubicacion });
      if (a.tipo) bullets.push({ label: "Tipo", value: a.tipo });
      break;
    }
    case "create_lote_parrillero": {
      title = `Crear lote parrillero`;
      bullets.push({ label: "Galpón", value: a.galpon_id || "—" });
      bullets.push({ label: "Fecha inicio", value: a.fecha_inicio || "—" });
      bullets.push({ label: "Cantidad ingresada", value: a.cantidad_ingresada ?? "—" });
      if (a.estado) bullets.push({ label: "Estado", value: a.estado });
      break;
    }
    case "insert_seguimiento_semanal": {
      title = `Cargar seguimiento semanal`;
      bullets.push({ label: "Lote", value: a.lote_parrillero_id || "—" });
      bullets.push({ label: "Semana", value: a.numero_semana ?? "—" });
      if (a.peso_promedio_gr !== undefined)
        bullets.push({ label: "Peso (gr)", value: String(a.peso_promedio_gr) });
      if (a.mortalidad_semanal !== undefined)
        bullets.push({ label: "Mortalidad", value: String(a.mortalidad_semanal) });
      if (a.consumo_alimento_semanal_kg !== undefined)
        bullets.push({ label: "Consumo (kg)", value: String(a.consumo_alimento_semanal_kg) });
      break;
    }
    default: {
      title = `Ejecutar ${action.kind}`;
      Object.keys(a).forEach((k) => bullets.push({ label: k, value: String(a[k]) }));
    }
  }

  return NextResponse.json({
    ok: true,
    summary: { title, bullets, ctaLabel, warn }
  });
}
