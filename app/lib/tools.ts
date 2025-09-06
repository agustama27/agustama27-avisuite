// Define SOLO tools para tus tablas. Generan PREVIEW y devuelven también el "action" completo.
// /api/execute recibirá { action } y ejecutará sin depender de memoria de servidor.

import { z } from "zod";
import { randomUUID } from "crypto";

export type PendingAction = { kind: string; args: any };

export type ToolDef = {
  name: string;
  description: string;
  parameters: any; // JSON schema para OpenAI
  preview: (args: any) => { actionId: string; action: PendingAction; preview: any };
};

// Registro en memoria (fallback)
const pending = new Map<string, PendingAction>();
function registerPreview(action: PendingAction) {
  const actionId = randomUUID();
  pending.set(actionId, action);
  return actionId;
}
export function takePending(actionId: string) {
  const v = pending.get(actionId);
  pending.delete(actionId);
  return v;
}

// ===== Enums según CHECKs
const TipoGranja = z.enum(["propio", "alquilado", "integrado"]);
const EstadoGalpon = z.enum(["vacio", "en_crianza", "limpieza", "mantenimiento"]);
const EstadoLote = z.enum(["activo", "finalizado"]);

// ===== Schemas base
const GeneticaCreate = z.object({ nombre: z.string().min(1) });
const GeneticaList = z.object({ q: z.string().optional() });

const GranjaCreate = z.object({
  nombre: z.string().min(1),
  ubicacion: z.string().optional(),
  tipo: TipoGranja.optional(),
});
const GranjaUpdate = GranjaCreate.partial().extend({ id: z.string().uuid() });
const GranjaList = z.object({ q: z.string().optional() });

// --- Galpones: permitir granja_id o nombre_granja
const GalponBase = z.object({
  identificador: z.string().min(1),
  capacidad_aves: z.number().int().positive().optional(),
  estado: EstadoGalpon.optional(),
});
const GalponCreate = GalponBase.extend({
  granja_id: z.string().uuid().optional(),
  nombre_granja: z.string().min(1).optional(),
}).superRefine((v, ctx) => {
  if (!v.granja_id && !v.nombre_granja) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Proporcioná granja_id o nombre_granja" });
  }
});
const GalponUpdate = GalponBase.partial().extend({ id: z.string().uuid() });
const GalponList = z.object({
  q: z.string().optional(),
  granja_id: z.string().uuid().optional(),
});

// Mantengo esta tool para compatibilidad, pero internamente haremos lo mismo
const GalponCreateByGranjaNombre = z.object({
  granja_nombre: z.string().min(1),
  identificador: z.string().min(1),
  capacidad_aves: z.number().int().positive().optional(),
  estado: EstadoGalpon.optional(),
});

const ListGalponesPorGranja = z.object({
  granja_id: z.string().uuid().optional(),
  nombre_granja: z.string().min(1).optional(),
}).superRefine((v, ctx) => {
  if (!v.granja_id && !v.nombre_granja) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Proporcioná granja_id o nombre_granja" });
  }
});

// --- Lotes Reproductoras
const LoteReproductorasCreate = z.object({
  id: z.string().min(1), // PK text
  granja_id: z.string().uuid(),
  genetica_id: z.string().uuid(),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cantidad_inicial: z.number().int().positive(),
});

// Aceptar filtro por id o por nombre (granja/genética)
const LoteReproductorasList = z.object({
  q: z.string().optional(),
  granja_id: z.string().uuid().optional(),
  granja_nombre: z.string().min(1).optional(),
  genetica_id: z.string().uuid().optional(),
  genetica_nombre: z.string().min(1).optional(),
});

// --- Lotes Parrilleros: permitir galpon_id o (nombre_granja+identificador_galpon)
const LoteParrilleroBase = z.object({
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cantidad_ingresada: z.number().int().positive(),
  estado: EstadoLote.default("activo").optional(),
  fecha_faena: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fep_calculado: z.number().optional(),
});

const LoteParrilleroCreate = LoteParrilleroBase.extend({
  galpon_id: z.string().uuid().optional(),
  nombre_granja: z.string().min(1).optional(),
  identificador_galpon: z.string().min(1).optional(),
}).superRefine((v, ctx) => {
  const byId = !!v.galpon_id;
  const byNombre = !!v.nombre_granja && !!v.identificador_galpon;
  if (!byId && !byNombre) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Proporcioná galpon_id o (nombre_granja + identificador_galpon)",
    });
  }
});

const LoteParrilleroUpdate = LoteParrilleroBase.partial().extend({ id: z.string().uuid() });
const LoteParrilleroFinalize = z.object({ id: z.string().uuid(), fecha_faena: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

// Listar por galpon_id, por estado y/o por granja (id o nombre)
const LoteParrilleroList = z.object({
  galpon_id: z.string().uuid().optional(),
  estado: EstadoLote.optional(),
  granja_id: z.string().uuid().optional(),
  granja_nombre: z.string().min(1).optional(),
});

// Compat: herramienta separada si el modelo decide invocarla
const LoteParrilleroCreateByGalponIdent = z.object({
  granja_nombre: z.string().min(1),
  galpon_identificador: z.string().min(1),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cantidad_ingresada: z.number().int().positive(),
  estado: EstadoLote.default("activo").optional(),
  fecha_faena: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fep_calculado: z.number().optional(),
});

const TrazabilidadLink = z.object({
  lote_parrillero_id: z.string().uuid(),
  lote_reproductora_id: z.string().min(1),
});
const TrazabilidadUnlink = TrazabilidadLink;
const TrazabilidadListByLote = z.object({ lote_parrillero_id: z.string().uuid() });

const SeguimientoSemanalInsert = z.object({
  lote_parrillero_id: z.string().uuid(),
  numero_semana: z.number().int().nonnegative(),
  peso_promedio_gr: z.number().optional(),
  mortalidad_semanal: z.number().int().nonnegative().optional(),
  consumo_alimento_semanal_kg: z.number().optional(),
});
const SeguimientoSemanalUpdate = SeguimientoSemanalInsert.partial().extend({ id: z.string().uuid() });
const SeguimientoSemanalDelete = z.object({ id: z.string().uuid() });
const ListSeguimientoPorLote = z.object({ lote_parrillero_id: z.string().uuid() });

const CurvaByGeneticaId = z.object({
  genetica_id: z.string().uuid(),
  dia_edad: z.number().int().nonnegative(),
});
const CurvaByGeneticaNombre = z.object({
  nombre_genetica: z.string().min(1),
  dia_edad: z.number().int().nonnegative(),
});

const ResumenLote = z.object({ lote_parrillero_id: z.string().uuid() });

function makePreview(kind: string, parsed: any, hint?: any) {
  const action: PendingAction = { kind, args: parsed };
  const actionId = registerPreview(action);
  return { actionId, action, preview: { kind, values: parsed, ...(hint ? { hint } : {}) } };
}

export const tools: ToolDef[] = [
  // ===== Genéticas =====
  {
    name: "create_genetica",
    description: "Inserta en Geneticas (nombre único).",
    parameters: { type: "object", properties: { nombre: { type: "string" } }, required: ["nombre"] },
    preview: (args) => makePreview("create_genetica", GeneticaCreate.parse(args), { sql: "insert into Geneticas(nombre)" }),
  },
  {
    name: "list_geneticas",
    description: "Lista genéticas (opcional filtro q por nombre).",
    parameters: { type: "object", properties: { q: { type: "string" } } },
    preview: (args) => makePreview("list_geneticas", GeneticaList.parse(args)),
  },

  // ===== Granjas =====
  {
    name: "create_granja",
    description: "Inserta en Granjas.",
    parameters: {
      type: "object",
      properties: { nombre: { type: "string" }, ubicacion: { type: "string" }, tipo: { type: "string", enum: TipoGranja.options } },
      required: ["nombre"],
    },
    preview: (args) => makePreview("create_granja", GranjaCreate.parse(args), { sql: "insert into Granjas(...)" }),
  },
  {
    name: "update_granja",
    description: "Actualiza Granjas por id.",
    parameters: {
      type: "object",
      properties: { id: { type: "string" }, nombre: { type: "string" }, ubicacion: { type: "string" }, tipo: { type: "string", enum: TipoGranja.options } },
      required: ["id"],
    },
    preview: (args) => makePreview("update_granja", GranjaUpdate.parse(args), { sql: "update Granjas set ..." }),
  },
  {
    name: "list_granjas",
    description: "Lista granjas (opcional filtro q por nombre).",
    parameters: { type: "object", properties: { q: { type: "string" } } },
    preview: (args) => makePreview("list_granjas", GranjaList.parse(args)),
  },

  // ===== Galpones =====
  {
    name: "create_galpon",
    description: "Inserta en Galpones (por granja_id o nombre_granja).",
    parameters: {
      type: "object",
      properties: {
        granja_id: { type: "string" },
        nombre_granja: { type: "string" },
        identificador: { type: "string" },
        capacidad_aves: { type: "number" },
        estado: { type: "string", enum: EstadoGalpon.options },
      },
      required: ["identificador"],
    },
    preview: (args) => makePreview("create_galpon", GalponCreate.parse(args), { sql: "insert into Galpones(...)" }),
  },
  // compat
  {
    name: "create_galpon_by_granja_nombre",
    description: "Crea galpón resolviendo la granja por nombre (sin pedir ID).",
    parameters: {
      type: "object",
      properties: {
        granja_nombre: { type: "string" },
        identificador: { type: "string" },
        capacidad_aves: { type: "number" },
        estado: { type: "string", enum: EstadoGalpon.options },
      },
      required: ["granja_nombre", "identificador"],
    },
    preview: (args) => makePreview("create_galpon_by_granja_nombre", GalponCreateByGranjaNombre.parse(args)),
  },
  {
    name: "update_galpon",
    description: "Actualiza Galpones por id.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        granja_id: { type: "string" },
        identificador: { type: "string" },
        capacidad_aves: { type: "number" },
        estado: { type: "string", enum: EstadoGalpon.options },
      },
      required: ["id"],
    },
    preview: (args) => makePreview("update_galpon", GalponUpdate.parse(args), { sql: "update Galpones set ..." }),
  },
  {
    name: "list_galpones",
    description: "Lista galpones (filtro por q y/o granja_id).",
    parameters: { type: "object", properties: { q: { type: "string" }, granja_id: { type: "string" } } },
    preview: (args) => makePreview("list_galpones", GalponList.parse(args)),
  },
  {
    name: "list_galpones_por_granja",
    description: "Lista galpones por granja (por id o nombre).",
    parameters: { type: "object", properties: { granja_id: { type: "string" }, nombre_granja: { type: "string" } } },
    preview: (args) => makePreview("list_galpones_por_granja", ListGalponesPorGranja.parse(args)),
  },

  // ===== Lotes Reproductoras =====
  {
    name: "create_lote_reproductoras",
    description: "Inserta en Lotes_Reproductoras.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        granja_id: { type: "string" },
        genetica_id: { type: "string" },
        fecha_nacimiento: { type: "string", description: "YYYY-MM-DD" },
        cantidad_inicial: { type: "number" },
      },
      required: ["id", "granja_id", "genetica_id", "fecha_nacimiento", "cantidad_inicial"],
    },
    preview: (args) => makePreview("create_lote_reproductoras", LoteReproductorasCreate.parse(args), { sql: "insert into Lotes_Reproductoras(...)" }),
  },
  {
    name: "list_lotes_reproductoras",
    description: "Lista lotes de reproductoras (se puede filtrar por granja_id o granja_nombre, y/o genetica_id o genetica_nombre).",
    parameters: {
      type: "object",
      properties: {
        q: { type: "string" },
        granja_id: { type: "string" },
        granja_nombre: { type: "string" },
        genetica_id: { type: "string" },
        genetica_nombre: { type: "string" },
      },
    },
    preview: (args) => makePreview("list_lotes_reproductoras", LoteReproductorasList.parse(args)),
  },

  // ===== Lotes Parrilleros =====
  {
    name: "create_lote_parrillero",
    description: "Inserta en Lotes_Parrilleros (por galpon_id o (nombre_granja + identificador_galpon)).",
    parameters: {
      type: "object",
      properties: {
        galpon_id: { type: "string" },
        nombre_granja: { type: "string" },
        identificador_galpon: { type: "string" },
        fecha_inicio: { type: "string", description: "YYYY-MM-DD" },
        cantidad_ingresada: { type: "number" },
        estado: { type: "string", enum: EstadoLote.options, default: "activo" },
        fecha_faena: { type: "string" },
        fep_calculado: { type: "number" },
      },
      required: ["fecha_inicio", "cantidad_ingresada"],
    },
    preview: (args) => makePreview("create_lote_parrillero", LoteParrilleroCreate.parse(args), { sql: "insert into Lotes_Parrilleros(...)" }),
  },
  // compat
  {
    name: "create_lote_parrillero_by_galpon_identificador",
    description: "Crea lote parrillero resolviendo el galpón por (granja_nombre + galpon_identificador).",
    parameters: {
      type: "object",
      properties: {
        granja_nombre: { type: "string" },
        galpon_identificador: { type: "string" },
        fecha_inicio: { type: "string", description: "YYYY-MM-DD" },
        cantidad_ingresada: { type: "number" },
        estado: { type: "string", enum: EstadoLote.options },
        fecha_faena: { type: "string" },
        fep_calculado: { type: "number" },
      },
      required: ["granja_nombre", "galpon_identificador", "fecha_inicio", "cantidad_ingresada"],
    },
    preview: (args) => makePreview("create_lote_parrillero_by_galpon_identificador", LoteParrilleroCreateByGalponIdent.parse(args)),
  },
  {
    name: "update_lote_parrillero",
    description: "Actualiza Lotes_Parrilleros por id.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        galpon_id: { type: "string" },
        fecha_inicio: { type: "string" },
        cantidad_ingresada: { type: "number" },
        estado: { type: "string", enum: EstadoLote.options },
        fecha_faena: { type: "string" },
        fep_calculado: { type: "number" },
      },
      required: ["id"],
    },
    preview: (args) => makePreview("update_lote_parrillero", LoteParrilleroUpdate.parse(args), { sql: "update Lotes_Parrilleros set ..." }),
  },
  {
    name: "finalizar_lote_parrillero",
    description: "Marca un lote como finalizado y setea fecha_faena.",
    parameters: { type: "object", properties: { id: { type: "string" }, fecha_faena: { type: "string" } }, required: ["id", "fecha_faena"] },
    preview: (args) => makePreview("finalizar_lote_parrillero", LoteParrilleroFinalize.parse(args)),
  },
  {
    name: "list_lotes_parrilleros",
    description: "Lista lotes parrilleros (filtros opcionales por galpon_id/estado y/o por granja_id o granja_nombre).",
    parameters: {
      type: "object",
      properties: {
        galpon_id: { type: "string" },
        estado: { type: "string", enum: EstadoLote.options },
        granja_id: { type: "string" },
        granja_nombre: { type: "string" },
      },
    },
    preview: (args) => makePreview("list_lotes_parrilleros", LoteParrilleroList.parse(args)),
  },

  // ===== Trazabilidad =====
  {
    name: "link_trazabilidad",
    description: "Inserta en Lotes_Parrilleros_Trazabilidad.",
    parameters: {
      type: "object",
      properties: { lote_parrillero_id: { type: "string" }, lote_reproductora_id: { type: "string" } },
      required: ["lote_parrillero_id", "lote_reproductora_id"],
    },
    preview: (args) => makePreview("link_trazabilidad", TrazabilidadLink.parse(args), { sql: "insert into Lotes_Parrilleros_Trazabilidad(...)" }),
  },
  {
    name: "unlink_trazabilidad",
    description: "Elimina un vínculo de trazabilidad.",
    parameters: {
      type: "object",
      properties: { lote_parrillero_id: { type: "string" }, lote_reproductora_id: { type: "string" } },
      required: ["lote_parrillero_id", "lote_reproductora_id"],
    },
    preview: (args) => makePreview("unlink_trazabilidad", TrazabilidadUnlink.parse(args)),
  },
  {
    name: "list_trazabilidad_por_lote",
    description: "Lista trazabilidad de un lote parrillero.",
    parameters: { type: "object", properties: { lote_parrillero_id: { type: "string" } }, required: ["lote_parrillero_id"] },
    preview: (args) => makePreview("list_trazabilidad_por_lote", TrazabilidadListByLote.parse(args)),
  },

  // ===== Seguimiento Semanal =====
  {
    name: "insert_seguimiento_semanal",
    description: "Inserta fila en Seguimiento_Semanal.",
    parameters: {
      type: "object",
      properties: {
        lote_parrillero_id: { type: "string" },
        numero_semana: { type: "number" },
        peso_promedio_gr: { type: "number" },
        mortalidad_semanal: { type: "number" },
        consumo_alimento_semanal_kg: { type: "number" },
      },
      required: ["lote_parrillero_id", "numero_semana"],
    },
    preview: (args) => makePreview("insert_seguimiento_semanal", SeguimientoSemanalInsert.parse(args), { sql: "insert into Seguimiento_Semanal(...)" }),
  },
  {
    name: "update_seguimiento_semanal",
    description: "Actualiza una fila de Seguimiento_Semanal.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        lote_parrillero_id: { type: "string" },
        numero_semana: { type: "number" },
        peso_promedio_gr: { type: "number" },
        mortalidad_semanal: { type: "number" },
        consumo_alimento_semanal_kg: { type: "number" },
      },
      required: ["id"],
    },
    preview: (args) => makePreview("update_seguimiento_semanal", SeguimientoSemanalUpdate.parse(args)),
  },
  {
    name: "delete_seguimiento_semanal",
    description: "Elimina una fila de Seguimiento_Semanal.",
    parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    preview: (args) => makePreview("delete_seguimiento_semanal", SeguimientoSemanalDelete.parse(args)),
  },
  {
    name: "list_seguimiento_por_lote",
    description: "Lista Seguimiento_Semanal por lote_parrillero_id.",
    parameters: { type: "object", properties: { lote_parrillero_id: { type: "string" } }, required: ["lote_parrillero_id"] },
    preview: (args) => makePreview("list_seguimiento_por_lote", ListSeguimientoPorLote.parse(args)),
  },

  // ===== Curvas Estándar =====
  {
    name: "get_curva_estandar",
    description: "Lee Curvas_Estandar por genetica_id y dia_edad.",
    parameters: {
      type: "object",
      properties: { genetica_id: { type: "string" }, dia_edad: { type: "number" } },
      required: ["genetica_id", "dia_edad"],
    },
    preview: (args) => makePreview("get_curva_estandar", CurvaByGeneticaId.parse(args)),
  },
  {
    name: "get_curva_estandar_por_nombre_genetica",
    description: "Busca Curvas_Estandar usando nombre de genética.",
    parameters: {
      type: "object",
      properties: { nombre_genetica: { type: "string" }, dia_edad: { type: "number" } },
      required: ["nombre_genetica", "dia_edad"],
    },
    preview: (args) => makePreview("get_curva_estandar_por_nombre_genetica", CurvaByGeneticaNombre.parse(args)),
  },

  // ===== Resumen de lote =====
  {
    name: "resumen_lote_parrillero",
    description: "Devuelve información unificada de un lote (lote, galpón, granja y seguimiento).",
    parameters: { type: "object", properties: { lote_parrillero_id: { type: "string" } }, required: ["lote_parrillero_id"] },
    preview: (args) => makePreview("resumen_lote_parrillero", ResumenLote.parse(args)),
  },

  // ===== Deletes opcionales =====
  {
    name: "delete_galpon",
    description: "Elimina un galpón por id (usa con cuidado).",
    parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    preview: (args) => makePreview("delete_galpon", z.object({ id: z.string().uuid() }).parse(args)),
  },
  {
    name: "delete_granja",
    description: "Elimina una granja por id (usa con cuidado).",
    parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    preview: (args) => makePreview("delete_granja", z.object({ id: z.string().uuid() }).parse(args)),
  },
  {
    name: "delete_lote_parrillero",
    description: "Elimina un lote parrillero por id (usa con cuidado).",
    parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    preview: (args) => makePreview("delete_lote_parrillero", z.object({ id: z.string().uuid() }).parse(args)),
  },
];
