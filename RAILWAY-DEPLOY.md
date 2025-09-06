# 🚀 Deploy AviSuite en Railway

## Configuración Inicial

### 1. Crear Proyecto en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Conecta tu repositorio: `agustama27/agustama27-avisuite`

### 2. Configurar Variables de Entorno

En Railway Dashboard → Variables, agregar:

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
OPENAI_API_KEY=tu_openai_api_key (opcional)
```

### 3. Configurar Build Settings

Railway detectará automáticamente que es un proyecto Next.js y usará:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.x (automático)

### 4. Deploy

Railway hará el deploy automáticamente cuando:
- Haces push a la rama main
- Cambias variables de entorno
- Haces redeploy manual

## 🎯 URLs de Acceso

- **Aplicación**: `https://tu-proyecto.railway.app`
- **Dashboard**: `https://tu-proyecto.railway.app/dashboard`
- **Chat IA**: `https://tu-proyecto.railway.app/dashboard/poultry-ia`

## 📊 Monitoreo

Railway proporciona:
- Logs en tiempo real
- Métricas de rendimiento
- Monitoreo de salud
- Escalado automático

## 🔧 Troubleshooting

### Error de Build
- Verificar que todas las dependencias estén en `package.json`
- Revisar logs de build en Railway Dashboard

### Error de Runtime
- Verificar variables de entorno
- Revisar logs de aplicación
- Verificar conectividad con Supabase

### Error de OpenAI
- La aplicación funciona sin OpenAI (fallback a Supabase)
- Para habilitar IA completa, agregar `OPENAI_API_KEY`

## 🚀 Optimizaciones

### Performance
- Railway usa CDN automáticamente
- Next.js optimiza imágenes y assets
- Caching automático de páginas estáticas

### Escalado
- Railway escala automáticamente según tráfico
- Límites generosos en plan gratuito
- Upgrade fácil a planes pagos

## 📝 Notas Importantes

1. **Primer Deploy**: Puede tomar 5-10 minutos
2. **Variables de Entorno**: Configurar antes del primer deploy
3. **Dominio Personalizado**: Disponible en planes pagos
4. **SSL**: Automático y gratuito
5. **Backups**: Automáticos en Railway

## 🎉 ¡Listo!

Tu aplicación AviSuite estará disponible en Railway con:
- ✅ Sidebar colapsable
- ✅ Chat de IA con fallback
- ✅ Responsive design
- ✅ Integración con Supabase
- ✅ Deploy automático desde GitHub
