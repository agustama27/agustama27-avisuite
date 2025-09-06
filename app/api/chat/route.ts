import { openai } from "@/app/lib/openai";
import { tools } from "@/app/lib/tools";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM = `
Sos un asistente avícola para un MVP.
- Operás SOLO con: Geneticas, Granjas, Galpones, Lotes_Reproductoras, Lotes_Parrilleros,
  Lotes_Parrilleros_Trazabilidad, Curvas_Estandar, Seguimiento_Semanal.
- Si falta la granja al crear un galpón, pedí seleccionarla (texto breve).
- Fechas en formato YYYY-MM-DD. Si el usuario escribe 01/08/25, asumí dd/mm/aa y llevá a YYYY-MM-DD.
- Para operaciones, proponé tool (preview). No ejecutes directo.
- Respuestas claras y cortas.
`;

// --- Helpers de normalización de fechas (ES, dd/mm/yyyy por defecto)
function toISO(dateStr: string): string | null {
  if (!dateStr) return null;
  const s = dateStr.trim().toLowerCase();

  const today = new Date();
  const clone = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (s === "hoy") {
    const d = clone(today);
    return d.toISOString().slice(0, 10);
  }
  if (s === "ayer") {
    const d = clone(today);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  // yyyy-mm-dd (ya válido)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // dd/mm/yyyy o dd-mm-yyyy
  let m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (m) {
    let [_, d, mo, y] = m;
    if (y.length === 2) y = (y >= "70" ? "19" : "20") + y; // heurística
    const D = Number(d), M = Number(mo) - 1, Y = Number(y);
    const dt = new Date(Y, M, D);
    if (dt && dt.getMonth() === M && dt.getDate() === D)
      return dt.toISOString().slice(0, 10);
  }

  // mm/dd/yyyy (si detectamos claramente mes > 12 cae en dd/mm; acá damos soporte básico)
  m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const mo = Number(m[1]), d = Number(m[2]), y = Number(m[3]);
    if (mo <= 12 && d <= 31) {
      // por defecto preferimos dd/mm, pero si el día>12 asumimos mm/dd no aplica. Dejamos dd/mm arriba.
      const dt = new Date(y, mo - 1, d);
      if (dt && dt.getMonth() === mo - 1 && dt.getDate() === d)
        return dt.toISOString().slice(0, 10);
    }
  }

  return null;
}

function normalizeArgs(kind: string, args: any) {
  const dateKeys = ["fecha_nacimiento", "fecha_inicio", "fecha_faena"];
  for (const k of dateKeys) {
    if (typeof args?.[k] === "string") {
      const iso = toISO(args[k]);
      if (iso) args[k] = iso;
    }
  }
  return args;
}

export async function POST(req: NextRequest) {
  const { messages = [] } = await req.json();

  const toolSpecs = tools.map((t) => ({
    type: "function" as const,
    function: { name: t.name, description: t.description, parameters: t.parameters }
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [{ role: "system", content: SYSTEM }, ...messages],
    tools: toolSpecs,
    tool_choice: "auto"
  });

  const choice = completion.choices[0];
  const toolCall = choice.message.tool_calls?.[0];

  if (toolCall) {
    const tool = tools.find((t) => t.name === toolCall.function.name)!;
    const raw = JSON.parse(toolCall.function.arguments || "{}");
    const args = normalizeArgs(tool.name, raw); // <-- normalizamos fechas antes del preview

    const { actionId, action, preview } = tool.preview(args);

    return NextResponse.json({
      type: "preview",
      toolName: tool.name,
      actionId,
      action,
      preview,
      assistantThought: choice.message.content ?? null
    });
  }

  return NextResponse.json({
    type: "message",
    content: choice.message.content ?? ""
  });
}
