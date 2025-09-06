// Ejecuta de verdad en Supabase las acciones confirmadas (action.kind)
import { supabaseService } from "./supabase";
import { PendingAction as Action } from "./tools";

// ---------- Helpers (devuelven UUID string o null)
async function getGranjaId(nombre: string): Promise<string | null> {
  const { data, error } = await supabaseService
    .from("Granjas")
    .select("id")
    .ilike("nombre", `%${nombre}%`)
    .order("nombre", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { id: string } | null)?.id ?? null;
}

async function getGeneticaId(nombre: string): Promise<string | null> {
  const { data, error } = await supabaseService
    .from("Geneticas")
    .select("id")
    .eq("nombre", nombre)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { id: string } | null)?.id ?? null;
}

async function getGalponId(granja_id: string, identificador: string): Promise<string | null> {
  const { data, error } = await supabaseService
    .from("Galpones")
    .select("id")
    .eq("granja_id", granja_id)
    .eq("identificador", identificador)
    .order("identificador", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { id: string } | null)?.id ?? null;
}

// Exporto con el mismo nombre que usa /api/execute
export async function execute(action: Action) {
  switch (action.kind) {
    // ===== Genéticas =====
    case "create_genetica": {
      const { data, error } = await supabaseService.from("Geneticas").insert([action.args]).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "genetica" } };
    }
    case "list_geneticas": {
      const q = action.args?.q?.trim();
      let query = supabaseService.from("Geneticas").select("*").order("nombre", { ascending: true });
      if (q) query = query.ilike("nombre", `%${q}%`);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((g: any) => ({ ...g, type: "genetica" })) };
    }

    // ===== Granjas =====
    case "create_granja": {
      const { data, error } = await supabaseService.from("Granjas").insert([action.args]).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "granja" } };
    }
    case "update_granja": {
      const { id, ...patch } = action.args;
      const { data, error } = await supabaseService.from("Granjas").update(patch).eq("id", id).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "granja" } };
    }
    case "list_granjas": {
      const q = action.args?.q?.trim();
      let query = supabaseService.from("Granjas").select("*").order("nombre", { ascending: true });
      if (q) query = query.ilike("nombre", `%${q}%`);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((g: any) => ({ ...g, type: "granja" })) };
    }

    // ===== Galpones =====
    case "create_galpon": {
      let query;
      if (action.args.granja_id) {
        query = supabaseService.from("Galpones").insert([action.args]).select("*").single();
      } else if (action.args.nombre_granja) {
        const { nombre_granja, identificador, capacidad_aves, estado } = action.args;
        const granja_id = await getGranjaId(nombre_granja);
        if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${nombre_granja}`);
        query = supabaseService
          .from("Galpones")
          .insert([{ granja_id, identificador, capacidad_aves, estado }])
          .select("*")
          .single();
      } else {
        throw new Error("Se requiere granja_id o nombre_granja");
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "galpon" } };
    }
    // compat
    case "create_galpon_by_granja_nombre": {
      const { granja_nombre, identificador, capacidad_aves, estado } = action.args;
      const granja_id = await getGranjaId(granja_nombre);
      if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${granja_nombre}`);
      const { data, error } = await supabaseService
        .from("Galpones")
        .insert([{ granja_id, identificador, capacidad_aves, estado }])
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "galpon" } };
    }
    case "update_galpon": {
      const { id, ...patch } = action.args;
      const { data, error } = await supabaseService.from("Galpones").update(patch).eq("id", id).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "galpon" } };
    }
    case "list_galpones": {
      const q = action.args?.q?.trim();
      const granja_id = action.args?.granja_id as string | undefined;
      let query = supabaseService
        .from("Galpones")
        .select("*, granja:Granjas(nombre)")
        .order("identificador", { ascending: true });
      if (granja_id) query = query.eq("granja_id", granja_id);
      if (q) query = query.ilike("identificador", `%${q}%`);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((g: any) => ({ ...g, type: "galpon" })) };
    }
    case "list_galpones_por_granja": {
      let granja_id = action.args?.granja_id as string | undefined;
      if (!granja_id && action.args?.nombre_granja) {
        granja_id = await getGranjaId(action.args.nombre_granja);
        if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${action.args.nombre_granja}`);
      }
      if (!granja_id) throw new Error("Falta granja_id o nombre_granja");
      const { data, error } = await supabaseService
        .from("Galpones")
        .select("*, granja:Granjas(nombre)")
        .eq("granja_id", granja_id)
        .order("identificador", { ascending: true });
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((g: any) => ({ ...g, type: "galpon" })) };
    }

    // ===== Lotes Reproductoras =====
    case "create_lote_reproductoras": {
      const { data, error } = await supabaseService.from("Lotes_Reproductoras").insert([action.args]).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_reproductoras" } };
    }
    case "list_lotes_reproductoras": {
      const q = action.args?.q?.trim();
      let granja_id = action.args?.granja_id as string | undefined;
      let genetica_id = action.args?.genetica_id as string | undefined;

      if (!granja_id && action.args?.granja_nombre) {
        granja_id = await getGranjaId(action.args.granja_nombre);
        if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${action.args.granja_nombre}`);
      }
      if (!genetica_id && action.args?.genetica_nombre) {
        genetica_id = await getGeneticaId(action.args.genetica_nombre);
        if (!genetica_id) throw new Error(`No se encontró la genética con el nombre ${action.args.genetica_nombre}`);
      }

      let query = supabaseService
        .from("Lotes_Reproductoras")
        .select("*, genetica:Geneticas(nombre)")
        .order("id", { ascending: true });
      if (granja_id) query = query.eq("granja_id", granja_id);
      if (genetica_id) query = query.eq("genetica_id", genetica_id);
      if (q) query = query.ilike("id", `%${q}%`);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((l: any) => ({ ...l, type: "lote_reproductoras" })) };
    }

    // ===== Lotes Parrilleros =====
    case "create_lote_parrillero": {
      let query;
      if (action.args.galpon_id) {
        query = supabaseService.from("Lotes_Parrilleros").insert([action.args]).select("*").single();
      } else if (action.args.nombre_granja && action.args.identificador_galpon) {
        const { nombre_granja, identificador_galpon, fecha_inicio, cantidad_ingresada, estado, fecha_faena, fep_calculado } =
          action.args;
        const granja_id = await getGranjaId(nombre_granja);
        if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${nombre_granja}`);
        const galpon_id = await getGalponId(granja_id, identificador_galpon);
        if (!galpon_id) throw new Error(`No se encontró el galpón ${identificador_galpon} en la granja ${nombre_granja}`);
        query = supabaseService
          .from("Lotes_Parrilleros")
          .insert([{ galpon_id, fecha_inicio, cantidad_ingresada, estado, fecha_faena, fep_calculado }])
          .select("*")
          .single();
      } else {
        throw new Error("Se requiere galpon_id o (nombre_granja + identificador_galpon)");
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_parrilleros" } };
    }
    // compat
    case "create_lote_parrillero_by_galpon_identificador": {
      const { granja_nombre, galpon_identificador, fecha_inicio, cantidad_ingresada, estado, fecha_faena, fep_calculado } = action.args;
      const granja_id = await getGranjaId(granja_nombre);
      if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${granja_nombre}`);
      const galpon_id = await getGalponId(granja_id, galpon_identificador);
      if (!galpon_id) throw new Error(`No se encontró el galpón ${galpon_identificador} en la granja ${granja_nombre}`);
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros")
        .insert([{ galpon_id, fecha_inicio, cantidad_ingresada, estado, fecha_faena, fep_calculado }])
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_parrilleros" } };
    }
    case "update_lote_parrillero": {
      const { id, ...patch } = action.args;
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_parrilleros" } };
    }
    case "finalizar_lote_parrilleros": // alias
    case "finalizar_lote_parrillero": {
      const { id, fecha_faena } = action.args;
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros")
        .update({ estado: "finalizado", fecha_faena })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_parrilleros" } };
    }
    case "list_lotes_parrilleros": {
      const galpon_id = action.args?.galpon_id as string | undefined;
      const estado = action.args?.estado as string | undefined;

      // Filtro por granja opcional (id o nombre → id)
      let granja_id = action.args?.granja_id as string | undefined;
      if (!granja_id && action.args?.granja_nombre) {
        granja_id = await getGranjaId(action.args.granja_nombre);
        if (!granja_id) throw new Error(`No se encontró la granja con el nombre ${action.args.granja_nombre}`);
      }

      let query = supabaseService
        .from("Lotes_Parrilleros")
        .select("*, galpon:Galpones(identificador, granja_id, granja:Granjas(nombre))")
        .order("fecha_inicio", { ascending: false });

      if (galpon_id) query = query.eq("galpon_id", galpon_id);
      if (estado) query = query.eq("estado", estado);
      // Filtrar por granja en relación anidada
      if (granja_id) query = query.eq("galpon.granja_id", granja_id);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((l: any) => ({ ...l, type: "lote_parrilleros" })) };
    }

    // ===== Trazabilidad =====
    case "link_trazabilidad": {
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros_Trazabilidad")
        .insert([action.args])
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "trazabilidad_lote_parrillero" } };
    }
    case "unlink_trazabilidad":
    case "remove_trazabilidad_lote_parrillero": {
      const { lote_parrillero_id, lote_reproductora_id } = action.args;
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros_Trazabilidad")
        .delete()
        .eq("lote_parrillero_id", lote_parrillero_id)
        .eq("lote_reproductora_id", lote_reproductora_id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "trazabilidad_lote_parrillero" } };
    }
    case "list_trazabilidad_por_lote":
    case "get_trazabilidad_lote_parrillero": {
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros_Trazabilidad")
        .select("*, lote_reproductora:Lotes_Reproductoras(*, genetica:Geneticas(nombre))")
        .eq("lote_parrillero_id", action.args.lote_parrillero_id);
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((t: any) => ({ ...t, type: "trazabilidad_lote_parrillero" })) };
    }

    // ===== Seguimiento =====
    case "insert_seguimiento_semanal": {
      const { data, error } = await supabaseService.from("Seguimiento_Semanal").insert([action.args]).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "seguimiento_semanal" } };
    }
    case "update_seguimiento_semanal": {
      const { id, ...patch } = action.args;
      const { data, error } = await supabaseService
        .from("Seguimiento_Semanal")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "seguimiento_semanal" } };
    }
    case "delete_seguimiento_semanal": {
      const { data, error } = await supabaseService
        .from("Seguimiento_Semanal")
        .delete()
        .eq("id", action.args.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "seguimiento_semanal" } };
    }
    case "list_seguimiento_por_lote": {
      const { data, error } = await supabaseService
        .from("Seguimiento_Semanal")
        .select("*")
        .eq("lote_parrillero_id", action.args.lote_parrillero_id)
        .order("numero_semana", { ascending: true });
      if (error) throw new Error(error.message);
      return { ok: true, data: data.map((s: any) => ({ ...s, type: "seguimiento_semanal" })) };
    }

    // ===== Curvas Estándar =====
    case "get_curva_estandar": {
      let query;
      if (action.args.genetica_id) {
        const { genetica_id, dia_edad } = action.args;
        query = supabaseService.from("Curvas_Estandar").select("*").eq("genetica_id", genetica_id).eq("dia_edad", dia_edad).maybeSingle();
      } else if (action.args.nombre_genetica) {
        const { nombre_genetica, dia_edad } = action.args;
        const genetica_id = await getGeneticaId(nombre_genetica);
        if (!genetica_id) throw new Error(`No se encontró la genética con el nombre ${nombre_genetica}`);
        query = supabaseService.from("Curvas_Estandar").select("*").eq("genetica_id", genetica_id).eq("dia_edad", dia_edad).maybeSingle();
      } else {
        throw new Error("Se requiere genetica_id o nombre_genetica");
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { ok: true, data: data ? { ...data, type: "curva_estandar" } : null };
    }

    // ===== Resumen compuesto =====
    case "resumen_lote_parrillero": {
      const { lote_parrillero_id } = action.args;

      const { data: lote, error: loteError } = await supabaseService
        .from("Lotes_Parrilleros")
        .select("*")
        .eq("id", lote_parrillero_id)
        .single();
      if (loteError) throw new Error(loteError.message);

      const { data: galpon, error: galponError } = await supabaseService
        .from("Galpones")
        .select("*")
        .eq("id", lote.galpon_id)
        .single();
      if (galponError) throw new Error(galponError.message);

      const { data: granja, error: granjaError } = await supabaseService
        .from("Granjas")
        .select("*")
        .eq("id", galpon.granja_id)
        .single();
      if (granjaError) throw new Error(granjaError.message);

      const { data: seguimientosSemanales, error: seguimientosError } = await supabaseService
        .from("Seguimiento_Semanal")
        .select("*")
        .eq("lote_parrillero_id", lote_parrillero_id)
        .order("numero_semana", { ascending: true });
      if (seguimientosError) throw new Error(seguimientosError.message);

      const hoy = new Date();
      const fi = new Date(lote.fecha_inicio + "T00:00:00");
      const diff = hoy.getTime() - fi.getTime();
      const dia_edad = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

      return {
        ok: true,
        data: {
          lote,
          galpon,
          granja,
          seguimientosSemanales,
          dia_edad,
          type: "lote_parrillero_info",
        },
      };
    }

    // ===== Deletes opcionales =====
    case "delete_galpon": {
      const { data, error } = await supabaseService.from("Galpones").delete().eq("id", action.args.id).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "galpon" } };
    }
    case "delete_granja": {
      const { data, error } = await supabaseService.from("Granjas").delete().eq("id", action.args.id).select("*").single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "granja" } };
    }
    case "delete_lote_parrillero": {
      const { data, error } = await supabaseService
        .from("Lotes_Parrilleros")
        .delete()
        .eq("id", action.args.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, data: { ...data, type: "lote_parrilleros" } };
    }

    default:
      return { ok: false, error: `Action ${(action as any).kind} not implemented` };
  }
}
