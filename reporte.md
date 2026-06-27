# Reporte de análisis, diagnóstico y testeo — Ashlar House

Fecha: 2026-06-22

## 1) Alcance ejecutado
Se realizó una revisión completa de estructura, configuración y scripts existentes en `FRONTEND/` y `BACKEND/`, incluyendo instalación de dependencias y ejecución de validaciones/smoke tests disponibles.

## 2) Resultado ejecutivo
**Estado actual:** ⚠️ **No listo para operar correctamente en local/CI sin ajustes previos de configuración y mantenimiento técnico.**

Lo positivo:
- Backend compila (`npm run build`) y genera panel admin.
- Frontend tiene build estático funcional (`npm run build`).
- Scripts de health check y demo WhatsApp existen y ejecutan.

Lo bloqueante:
- Backend no arranca en desarrollo sin secretos críticos (`API_TOKEN_SALT`, etc.).
- Scripts NPM de Airbnb apuntan a rutas incorrectas (fallan por `MODULE_NOT_FOUND`).
- Check pre-deploy marca falso error en `tsconfig.json` por parseo JSON estricto con comentarios.
- Dependencias con riesgo: `npm install` reporta **77 vulnerabilidades** (13 críticas).

## 3) Evidencia de pruebas ejecutadas

### Backend
- ✅ `npm run build` → compila TS y admin correctamente.
- ❌ `npm run develop` → falla por `Missing apiToken.salt`.
- ⚠️ `npm run pre-deploy` → falla por:
  - variables de entorno faltantes,
  - validación de `tsconfig.json` (JSON.parse no tolera comentarios),
  - API WhatsApp no configurada.
- ⚠️ `npm run health-check` → detecta env críticas no configuradas.
- ⚠️ `npm run check:strapi` → no conecta porque Strapi no está levantado.
- ❌ `npm run test:airbnb-sync` y `npm run test:manual-sync` → rutas inválidas en `package.json`.
- ✅ `npm run test:whatsapp` (modo demo) → simulación correcta de notificaciones duales.
- ⚠️ `node "scripts/Airbnb sync/test-airbnb-sync.js"` → falla de conectividad DNS externa (`ENOTFOUND www.airbnb.mx`) + Strapi no iniciado.
- ⚠️ `node "scripts/Airbnb sync/manual-sync-test.js"` → falla por backend no activo.
- ✅ `node "scripts/Airbnb sync/test-url-parsing.js"` → parser funcional en la mayoría de casos.
- ⚠️ `node test-secure-email-system.js` → falla por backend no accesible.

### Frontend
- ✅ `npm install` sin vulnerabilidades propias del paquete frontend (sitio estático).
- ✅ `npm run build` (script informativo) sin errores.

## 4) Diagnóstico técnico (priorizado)

## P0 — Bloqueantes inmediatos
1. **Arranque de Strapi bloqueado por secretos obligatorios faltantes.**
2. **Scripts de Airbnb mal cableados en `BACKEND/package.json`** (archivos reales están dentro de `scripts/Airbnb sync/`).
3. **Entorno local no reproducible sin plantilla de env validada** (faltan claves críticas para administración/tokens).

## P1 — Riesgo alto de operación
4. **Superficie de seguridad de dependencias desactualizada** (77 vulnerabilidades reportadas).
5. **Hardcode de valores sensibles/operativos en código** (teléfonos destino y URL de calendario Airbnb en `src/index.ts`).
6. **Checks de pre-deploy con falso negativo** por parseo de `tsconfig.json` (JSONC vs JSON).

## P2 — Calidad/mantenibilidad
7. **Inconsistencias de naming en frontend/docs** (`newsletter_whatsapp` vs `whatsapp_subscription` / `email_subscription`) que pueden romper reportes/listados.  
   Detectado en:
   - `FRONTEND/js/whatsapp-lists-manager.js`
   - `FRONTEND/js/newsletter.js`
   - `BACKEND/test-secure-email-system.js`
   - `DOCS/TESTING/secure-email-testing.md`
8. **No existe suite automatizada formal (unit/integration/e2e) para backend/frontend**; predominan scripts manuales de diagnóstico.
9. **Configuraciones permisivas** (CORS/CSP y defaults de claves) requieren endurecimiento para producción.

## 5) ¿Por dónde empezar para dejar el sistema funcionando correctamente?

### Fase 1 — Estabilización base (primero)
1. Definir y validar un **contrato único de variables de entorno** (dev/prod), con plantilla y verificación automática.
2. Corregir y validar todos los **scripts npm rotos** de pruebas/sincronización Airbnb.
3. Asegurar **arranque limpio de Strapi** en desarrollo y producción con validaciones de bootstrap.

### Fase 2 — Confiabilidad operativa
4. Reducir vulnerabilidades de dependencias por lotes controlados, con pruebas de regresión tras cada lote.
5. Eliminar hardcodes operativos de código fuente y moverlos a configuración segura.
6. Corregir chequeos pre-deploy para que reflejen estado real (sin falsos fallos).

### Fase 3 — Calidad y prevención de regresiones
7. Unificar naming de campos de suscripción en frontend/backend/docs.
8. Incorporar pipeline de pruebas automatizadas mínimas (smoke API + flujos críticos de reservas/contacto).
9. Endurecer políticas de seguridad de runtime (CORS/CSP/secrets/logging estructurado/monitoring).

## 6) Conclusión
El proyecto tiene buena base funcional, pero hoy depende de configuración manual y scripts no totalmente confiables. Si se ejecuta el plan por fases anterior (estabilización → seguridad/confiabilidad → automatización de calidad), el sistema puede pasar de “funciona por partes” a una operación estable, repetible y segura.
