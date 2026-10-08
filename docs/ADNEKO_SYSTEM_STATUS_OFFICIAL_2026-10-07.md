# ADNEKO — Estado oficial de sistemas
**Checkpoint:** 07 octubre 2026  
**Criterio:** último hilo real + evidencia técnica disponible.  
**Regla:** no inferir porcentajes globales; separar construcción, validación, bloqueos y producción.

---

## 1. Agent Orchestrator / Development Orchestrator — RC2

### Rama / versión
RC2 congelado. No crear módulos ni versiones nuevas hasta cerrar aceptación real.

### Construido
- Project Registry.
- Planner/Goals por `projectId`.
- Perfiles de tests.
- Coordinación multi-repositorio.
- Control de aceptación RC2 independiente del runtime.
- El control exige resultados PASS en H01–H18, Recovery, Gatekeeper, E2E multiagente, idempotencia, rollback y soak.
- Verifica coincidencia de versión y referencias de evidencia.

### Pruebas ya pasadas
- Control de aceptación: **7/7 PASS**.
- El control rechaza pruebas faltantes, fallidas o asociadas a otra versión.

### Evidencia
- H01–H18: PASS histórico, pendiente de repetición sobre la ejecución RC2 actual.
- El control de aceptación existe y está probado.
- La autenticidad de los artefactos reales todavía no está certificada.

### Pendiente
- Ejecutar Agent Orchestrator real en Windows.
- Repetir H01–H18.
- Ejecutar Recovery, Gatekeeper, E2E multiagente, idempotencia, rollback y soak.
- Recoger artefactos auténticos.
- Confirmar que toda la evidencia corresponde exactamente a una única versión RC2.
- Ejecutar el control de aceptación sobre esas evidencias reales.

### Bloqueo externo
El equipo Windows `DESKTOP-FA5MKPC` aparece conectado, pero Desktop Commander bloquea operaciones por límite mensual.

### Estado
**RC2 — ACCEPTANCE BLOCKED / NOT CERTIFIED**

El 7/7 PASS corresponde al control de aceptación, no al runtime.

---

## 2. MEMBRANE — RC19

### Rama / HEAD correcto
- Rama candidata: `cert/membrane-v1.0-rc19`
- SHA: `e7180920542ec79e96cf0aa9967536ab60e0cdc4`
- Coinciden: cert, anchor `anchor/membrane-v1.0-rc19-e718092`, HEAD de PR #76 y deploy staging válido.
- PR #76: open, merged=false, mergeable=true.
- Staging válido: deploy `dep-db3aivl9fdbs73ah15b0`, estado **LIVE**, misma SHA.
- Tres contaminaciones previas con `52dcb366…` quedaron excluidas, auditadas y resealed.
- Antes de cada gate debe comprobarse: `cert == anchor == PR76 == deploy`.

### Construido
RC19 incluye:
- Runtime staging v48.
- PostgreSQL v48 / 38 migraciones.
- Auth / tenant / principal binding.
- Source reads y privacy reads.
- NEXUS gateway.
- Issuance y verification de grants.
- Orchestrator control plane.
- Google connector con gates fail-closed.
- OAuth transport / vault.
- Sync / disconnect runtime.
- Recovery backup / restore.
- Network-load certifier.
- Pilot certifier.
- Final release certifier.
- Production entrypoint / predeploy.
- Rollback runbook.

Fuera del candidato RC19, en ramas `ops`, existen elementos operacionales preparados sin modificar RC19:
- Recovery cifrado.
- Restaurador para rotación PostgreSQL free.
- Gate4 execution window.
- Production smoke probe.

### Pruebas ya pasadas
- Gate 0: PASS.
- Gate 1: PASS.
- Gate 2 PostgreSQL: **PASS** — v48, 38 migraciones, fingerprint `009243c9…`.
- Gate 3 load canónico: **PASS** — 100 requests, concurrency 10, p95 305.14 ms, p99 406.51 ms, 0 errores, readiness estable.
- Gate 5 recovery: **PASS** — PG17 backup/restore, 41 tablas verificadas.
- Gate 7 CI: **PASS** — RC19 SHA exacta, run `37074160581`.
- Source reads: 200/200.
- NEXUS gateway self-probe: PASS.
- Orchestrator control self-probe: PASS, incluyendo spoof rejection y `mutationExecuted=false`.

Prueba adicional de madurez:
- Stress 500×50: 0 errores, readiness estable.
- p95 1100.55 ms > límite 750 ms.
- No invalida Gate 3; queda como mejora de performance.

### Evidencia preservada
Ruta: `evidence/membrane-v1.0-rc19`

Incluye:
- CI.
- PostgreSQL canónico.
- Recovery backup/apply/restore.
- Load canónico.
- Gate4 preflight.
- Gate4 atomic activation proof.
- Gate6 preflight.
- Gate8 preflight.
- Secret scan.
- Promotion preflight.
- Incidentes de branch drift.
- Continuity-backup decrypt verification.

Backup operacional cifrado:
- AES-256-GCM.
- Ciphertext SHA `af5f4bde…`.
- Dump SHA `a008a960…`.
- Magic `PGDMP`.
- Restore previo PASS sobre 41 tablas.
- Descifrado real posterior PASS.
- Clave separada del ciphertext.

### Pendiente
- Gate 4 real: `connect → OAuth → sync → disconnect → invalidation → reprojection`.
- Todavía no existe el artifact final `adneko.membrane.google-lifecycle-evidence.v1`.
- Gate 6 canónico depende de Gate 4.
- Gate 8 está estructuralmente preparado y se detiene correctamente en el primer artifact ausente: Google lifecycle.
- Después: Gate 9 production readonly y Gate 10 production smoke.

### Bloqueos externos
Google:
- Falta `MEMBRANE_GOOGLE_OAUTH_CLIENT_SECRET`.
- Falta autenticar la cuenta Google operadora correcta.
- Falta obtener/verificar su `sub`.
- Falta consentimiento OAuth interactivo.
- El `sub` no debe inferirse desde email o profile IDs.

Producción:
- Gate 8 puede alcanzarse con recursos actuales.
- Gate 9/10 quedan diferidos hasta disponer de infraestructura recurrente de producción.

### Bloqueo técnico / infraestructura
Gate4 `complete` y Gate6 oficial requieren acceso directo a PostgreSQL desde el runner canónico.
- Staging posee `MEMBRANE_DATABASE_URL`.
- La integración Render disponible no ofrece shell/exec.
- El runner aislado no posee ese secreto.
- No debe copiarse ni exponerse.
- Falta un execution plane DB-capable seguro.

El helper de identity bootstrap ligado a v47 ya fue resuelto operacionalmente mediante una variante v48 probada en `ops`; no es un bloqueo de diseño de RC19.

### Validación / Producción / FAT
- Staging: **parcialmente certificada**.
- Gates PASS: 0, 1, 2, 3, 5, 7.
- Gate 4: bloqueado.
- Gate 6: pendiente.
- Gate 8: preparado.
- Producción: **NO desplegada**.
- Production Certified: **NO**.
- FAT físico: **no aplica**.

### PostgreSQL staging
- Estado: AVAILABLE.
- PG17 free.
- Vencimiento registrado: `2026-10-09T16:18:19.842694Z`.
- Backup cifrado restaurado, descifrado y verificado.
- Si vence antes de Gate4/6: crear PostgreSQL 17 free, restaurar dump verificado, rebind, revalidar v48/38 y continuar.
- Riesgo residual: downtime, no pérdida de datos.

### Siguiente cierre concreto
No crear RC20 ni ampliar alcance.

Orden obligatorio:
1. Google Client Secret.
2. Operador Google verificado + `sub` + bootstrap v48.
3. Execution plane seguro con acceso DB.
4. Gate 4 PASS.
5. Volver a cerrar Google fail-closed.
6. Gate 6 pilot.
7. Gate 8 final certification.

### Estado
**RC19 — STAGING PARCIALMENTE CERTIFICADA / GATE 4 BLOQUEADO / PRODUCCIÓN NO DESPLEGADA**


---

## 3. Intelligence OS — estado verificado

### Rama / HEAD correcto
- `main` en `19fd382…`.
- PR #354 fue validado y fusionado.
- PR #356 también figura fusionado en el estado público actual.
- Render `adneko-intelligence-os` deploy `dep-db37blom7kps73da3rig` está **LIVE** en SHA `19fd382…`.

### Construido
- Motor de interpretación, planificación y ejecución gobernada.
- Control plane de dependencias.
- Evidencia durable.
- Identidad MEMBRANE read-only dedicada: `service:intelligence-os-main-readonly`.
- Scope exacto: `membrane:state:read`.

### Pruebas / validación ya pasadas
- TypeScript/build: PASS.
- Suite autónoma: 184 archivos PASS.
- `test:production-contract`: PASS.
- Probe MEMBRANE de arranque: `READY_NO_SNAPSHOT`.
- `evidencePersisted=true`.
- Lectura realizada correctamente.
- Mutaciones / autoridad / dispatch externos: false.
- Smoke de capacidad durable PostgreSQL: PASS.

### Pendiente
El núcleo está operativo, pero el backbone completo todavía no está cerrado:
- ADVANCE RC2 bridge no configurado en el servicio live.
- Faltan credenciales CardDAV dedicadas.
- Faltan reautorizar 3 cuentas Google Drive.
- Después corresponde cerrar E2E Company/Agent sobre estas dependencias.

### Estado
**LIVE · NÚCLEO OPERATIVO · DEPENDENCIAS EXTERNAS PENDIENTES**

---

## 4. Advanced OS / Core — RC2

### Rama / HEAD correcto
- RC2 industrial congelado en `f7b119…`.
- SHA completo registrado: `f7b119525ba56d18774a6b0a3c1b445f1fdeb007`.
- Rama operacional: `ops/advanced-os-v1.0-rc2-deployment`.
- Tooling operacional actual: `d423be90…`.
- La rama operacional está 150 commits ahead / 0 behind del RC2 y no modifica `src/sql/test/package/lockfile/tsconfig` del runtime certificado.

### Construido
- Runtime de intents.
- Health / readiness.
- Idempotencia.
- Aislamiento tenant.
- Gateway industrial.
- Recovery.
- De-energizing fail-closed.
- Tooling operacional de deployment sin alterar el runtime RC2 congelado.

### Pruebas / certificación ya pasadas
- Advanced exact-SHA: **445/445 PASS**.
- EDGE Gateway: **30/30 PASS**.
- Pre-FAT authority: **40/40 PASS**.
- Commissioning / FAT00 software readiness: **72/72 PASS**.
- DB authority: PASS.
- Bootstrap: PASS.
- Startup: PASS.
- Control surface: PASS.
- Evidence authority: PASS.
- Privilege separation: PASS.
- Provenance: PASS.
- Closure checker: PASS.
- Políticas Render: PASS.
- CLI real de activación ejecutado end-to-end con marcador `ADVANCE_OS_PRODUCTION_ACTIVATION_CLI_E2E=PASS`.
- Runner histórico restaurado a su SHA exacto.

### Bloqueo externo / infraestructura
Render está en capacidad máxima:
- 24 servicios.
- 1 PostgreSQL.
- Total: **25/25 recursos**.

Para ADVANCE todavía no existen:
- PostgreSQL 16 durable de producción.
- Web service de producción autorizado.

Esto es un bloqueo externo/de infraestructura, no un fallo del RC2.

### Pendiente de producción / FAT
Después de disponer de infraestructura autorizada faltan:
- Tenant/runtime DB reales.
- Commissioning EDGE Terminal.
- ADAM-6050 + DO/DI + safety profile.
- FAT00 físico P01–P08.
- Autorización post-FAT.
- E2E hardware con readback independiente.
- Confirmación de idempotencia de un único efecto.

### Estado
**SOFTWARE CERTIFIED · INFRA/FAT PENDING · PRODUCTION NO**


---

## 5. ADNEKO ONE — 1.0.0-rc.1

### Rama / HEAD correcto
- Rama: `feature/adneko-one-dogfood-ops-v22`
- HEAD: `75552a159d16e5e08d501e37502466249546a2af`
- PR actual: #94 — ADNEKO ONE Dogfood Operations v0.22
- Base: `feature/adneko-one-rc-closure-v21`
- Estado PR: OPEN · mergeable · no draft

### Construido
ADNEKO ONE está en `1.0.0-rc.1`.

Requisitos y base:
- Node 22.
- PostgreSQL 16.
- 11 migraciones: `001_core.sql` a `011_auth_sessions.sql`.

Capacidades incluidas:
- Multi-tenant + RLS.
- RBAC y auditoría.
- Sesiones revocables.
- Bootstrap controlado y sellable.
- Customers / conversations / tasks.
- Scheduling / reservations.
- Catálogo / quotes / orders / payments.
- Comunicaciones con outbox transaccional.
- Action Gateway con idempotencia, aprobación y evidencia.
- Sesiones NEKO.
- Brain ingress autenticado.
- Voice handoff.
- Briefing determinista.
- PWA.
- Nginx same-origin.
- Migraciones con checksum.
- Runtime DB least-privilege.
- Backup / restore.
- Request correlation.
- Métricas internas.
- Soak programado.

### Pruebas ya pasadas
Sobre RC1 HEAD `68a27ca575d…`:
- Core #236 — PASS.
- PWA #41 — PASS.
- Recovery Drill #100 — PASS.
- Release Candidate #6 — PASS.
- Sustained Soak #4 — PASS.
- Production Stack #125 — PASS.

Sobre HEAD actual v0.22 `75552a159d…`:
- Release Candidate #7 — PASS.
- Dogfood Rehearsal #2 — PASS.
- Production Stack #131 — PASS.

E2E certificados:
1. `humano → Voice ticket → NEKO → Brain → Action Gateway → PostgreSQL → briefing/audit`
2. `inbound → Brain → communication.send → approval/rejection → outbox → adapter → delivery`
3. `estado persistido → restart API → mismo JWT/Brain/NEKO → replay → nueva acción`

### Evidencia existente
Documentos/scripts versionados:
- `OPERATIONAL_EVIDENCE`
- `CRITICAL_DELIVERY_EVIDENCE`
- `RESTART_CONTINUITY_EVIDENCE`
- `SUSTAINED_SOAK_EVIDENCE`
- `RECOVERY`
- `RELEASE_CANDIDATE`
- `DOGFOOD_RUNBOOK`
- `DOGFOOD_EVIDENCE`

Primer soak certificado:
- 0 HTTP 5xx.
- 0 PostgreSQL waiters.
- 58 requests completados antes del restart.
- Latencia media 35.184 ms.
- Latencia máxima 352.246 ms.
- Después del restart: nuevamente 0×5xx y 0 waiters.

Dogfood rehearsal:
- Primer bootstrap: `replayed=false`.
- Segundo bootstrap idempotente: `replayed=true`.
- Mismo tenant/user.
- Bootstrap posteriormente sellado.
- Nuevo bootstrap: 403 `BOOTSTRAP_DISABLED`.
- Owner original continúa autenticando.
- Briefing continúa funcionando.
- 0×5xx.
- 0 PostgreSQL waiters.

Artifact real preservado:
- `adneko-one-dogfood-37142538356`

### Pendiente
No hay defecto técnico conocido bloqueando RC1.

Dos cierres reales:
1. Integración Git definitiva de la cadena stacked: PRs #78, #80, #82, #83, #84, #86, #87, #89, #92, #93 y #94. Todos aparecen open y mergeable. Debe revalidarse el HEAD integrado antes de declarar consolidación.
2. Producción persistente real. Existe packaging Compose, recovery, runbooks y rehearsal, pero no hay evidencia de un host ADNEKO-controlado ejecutando ADNEKO ONE de forma continua.

### Bloqueos
- Técnico del RC1: ninguno demostrado actualmente.
- Interno de ingeniería: consolidar la cadena de PRs sin romper gates.
- Externo para madurez: host persistente ADNEKO-controlado, almacenamiento persistente, HTTPS/dominio y secretos reales.

### Validación / Producción / FAT
- Validación: **PASS — RC1 certificado**.
- Production packaging: **PASS**.
- Producción real sostenida: **NO todavía**.
- FAT físico: **N/A**.
- Equivalente FAT software: **PASS** mediante Production Stack + Recovery + E2E + Dogfood Rehearsal.
- SAT en entorno persistente real: **PENDIENTE**.
- Final v1.0: **NO declarado**; versión actual `1.0.0-rc.1`.

### Siguiente cierre concreto
No abrir v0.23 funcional.

Secuencia:
1. PR consolidation.
2. Verificar HEAD integrado.
3. Reejecutar Core + PWA + Production + Recovery + Soak + RC.
4. Congelar SHA integrado.
5. Preparar deployment persistente.
6. Deploy RC1 real.
7. Bootstrap `adneko-internal`.
8. Sellar bootstrap.
9. Dogfood real.
10. Backup real.
11. Restore drill.
12. Operación sostenida durante días.
13. Revisión de métricas/errores.
14. Decidir v1.0.

### Estado
**RC1 CERTIFICADO · PRODUCTION PACKAGING PASS · HOST REAL / SAT PENDIENTE**
