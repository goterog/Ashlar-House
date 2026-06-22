# Plan de implementación para restablecer funcionamiento correcto

## Estado general
- [x] Diagnóstico completo ejecutado (`reporte.md`)
- [ ] Estabilización base completada
- [ ] Confiabilidad operativa completada
- [ ] Calidad y prevención de regresiones completada

## Fase 1 — Estabilización base (bloqueantes)
- [x] Corregir scripts NPM con rutas inválidas de sincronización Airbnb
- [x] Corregir validación de `tsconfig.json` en pre-deploy (JSON con comentarios)
- [ ] Estandarizar y verificar contrato de variables de entorno (dev/prod)
- [ ] Confirmar arranque limpio local de Strapi con `.env` válido
- [ ] Validar smoke tests de sincronización Airbnb con backend activo

## Fase 2 — Confiabilidad operativa
- [ ] Reducir vulnerabilidades de dependencias sin romper compatibilidad
- [ ] Externalizar configuraciones hardcodeadas de Airbnb/WhatsApp a variables de entorno
- [ ] Fortalecer pre-deploy con checks de conectividad opcionales/no bloqueantes en dev
- [ ] Documentar checklist de despliegue técnico reproducible

## Fase 3 — Calidad y prevención de regresiones
- [ ] Unificar naming de campos de suscripción (frontend/backend/docs)
- [ ] Implementar pruebas automatizadas mínimas de flujos críticos (reserva/contacto)
- [ ] Endurecer políticas de CORS/CSP y manejo de secretos por entorno
- [ ] Definir monitoreo y alertas básicas de salud del sistema

## Próximos pasos inmediatos (siguiente iteración)
- [ ] Completar estandarización de `.env.example` y documentación de arranque
- [ ] Dejar `npm run develop` operativo en local con variables mínimas requeridas
- [ ] Ejecutar y registrar validación final (`build`, `pre-deploy`, `test:airbnb-sync`, `test:manual-sync`)
