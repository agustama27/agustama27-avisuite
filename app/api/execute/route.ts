import { execute } from "@/app/lib/executors";
import { takePending } from "@/app/lib/tools";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok:false, error:"JSON inválido" }, { status: 400 }); }

  if (body?.action?.kind) {
    try {
      const result = await execute(body.action);
      return NextResponse.json(result);
    } catch (e: any) {
      return NextResponse.json({ ok:false, error: e?.message || String(e) }, { status: 500 });
    }
  }

  if (body?.actionId) {
    const action = takePending(body.actionId);
    if (!action) return NextResponse.json({ ok:false, error:"Acción no encontrada o ya ejecutada" }, { status: 400 });
    try {
      const result = await execute(action);
      return NextResponse.json(result);
    } catch (e: any) {
      return NextResponse.json({ ok:false, error: e?.message || String(e) }, { status: 500 });
    }
  }

  return NextResponse.json({ ok:false, error:"Faltan parámetros: action o actionId" }, { status: 400 });
}
