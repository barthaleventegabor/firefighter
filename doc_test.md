# 🚒 Firefighters Overtime Processing Tool  
## Testing Documentation (English)

---

## 1. Introduction

This document defines the complete testing plan for the **Firefighters Overtime Processing Tool**, an Angular 18 web application that processes `.xlsx` files, applies overtime rules, merges consecutive interventions, and generates structured JSON.

The tests ensure correctness of:

- Excel parsing using **SheetJS (xlsx)**
- Parsing of date/time text fields
- Overtime rules (Rules 1–3)
- Consecutive intervention merging (Rule 4)
- Monthly rounding logic
- JSON export
- UI behavior

---

## 2. Scope

### In Scope
- File upload handling  
- Excel parsing with **SheetJS (xlsx)**  
- Date & time extraction from text fields  
- Rule 4 merging logic  
- Rule 1–3 time adjustments  
- Worker summary calculations  
- JSON file export  
- UI rendering and responsiveness  

### Out of Scope
- Backend systems  
- Authentication  
- Database interactions  

---

## 3. Test Environment

| Component | Version |
|----------|---------|
| Angular | 18 |
| Node.js | ≥ 18.13 |
| Excel Parser | SheetJS (xlsx) |
| Browsers | Chrome, Edge, Firefox |
| File Format | `.xlsx` |

---

## 4. Functional Test Cases

---

### 4.1 File Upload Tests

| ID | Test | Expected Result |
|----|------|-----------------|
| FU-01 | Upload valid `.xlsx` file | File accepted and parsed |
| FU-02 | Upload invalid file type | File rejected or ignored |
| FU-03 | Excel contains empty rows | Empty rows skipped |
| FU-04 | Upload multiple files | Only most recent file processed |
| FU-05 | Remove and re-upload file | Previous results reset |

---

### 4.2 Excel Parsing Tests — SheetJS (xlsx)

| ID | Scenario | Expected |
|----|----------|----------|
| XP-01 | Correct extraction of columns | Data mapped properly |
| XP-02 | Parse format: `dd/mm/yyyy de HH:MM a HH:MM` | Valid Date objects created |
| XP-03 | End time earlier than start time | End time moved to next day |
| XP-04 | Invalid dates | Row skipped |
| XP-05 | Missing worker ID | Row ignored |

---

### 4.3 Rule 4 — Consecutive Interventions Merging

**Rule Definition**  
If an intervention starts *exactly* when the previous one ends, the interventions must be **merged**.  
Rules 1–2 apply **after merging**, not individually.

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| R4-01 | End time == next start | Interventions merged |
| R4-02 | 0:45 + 0:25 consecutive | Final = **1:10** |
| R4-03 | Chain of 3+ consecutive interventions | All merged |
| R4-04 | Different report numbers | `"A + B"` |
| R4-05 | Different locations | `"Loc1 / Loc2"` |
| R4-06 | Not consecutive | No merge |

---

### 4.4 Rule 1 — Minimum Duration (1:00)

Applied only when the intervention is **not merged** by Rule 4.

| ID | Duration | Expected |
|----|----------|----------|
| R1-01 | 0:15 | 1:00 |
| R1-02 | 0:59 | 1:00 |
| R1-03 | Merged duration = 1:10 | 1:10 (not forced to 1:00) |

---

### 4.5 Rule 2 — Rounding to Nearest 10 Minutes

| ID | Input Duration | Expected |
|----|----------------|----------|
| R2-01 | 1:08 | 1:10 |
| R2-02 | 1:14 | 1:10 |
| R2-03 | 1:16 | 1:20 |
| R2-04 | 2:04 | 2:00 |

---

### 4.6 Rule 3 — Monthly Total Rounding (UP to 30 Minutes)

| ID | Monthly Total | Expected |
|----|----------------|----------|
| R3-01 | 7:20 | 7:30 |
| R3-02 | 7:40 | 8:00 |
| R3-03 | 10:01 | 10:30 |

---

### 4.7 Date & Time Parsing Tests

| ID | Input | Expected |
|----|--------|----------|
| DT-01 | Valid Spanish date format | Parsed correctly |
| DT-02 | Start 23:00 → End 01:00 | End day = next day |
| DT-03 | Bad time format | Row ignored |

---

### 4.8 JSON Export Tests

| ID | Scenario | Expected |
|----|-----------|----------|
| JS-01 | Export after processing | JSON file downloaded |
| JS-02 | JSON structure | Correct worker/intervention format |
| JS-03 | Date formatting | Uses `toLocaleString()` |
| JS-04 | File name | `firefighters.json` |

---

### 4.9 User Interface Tests

| ID | Scenario | Expected |
|----|-----------|----------|
| UI-01 | Worker cards render | Cards display ID & name |
| UI-02 | Table responsiveness | Scrolls on mobile |
| UI-03 | Action buttons visibility | Follow state logic |
| UI-04 | Chronological order | Correct sorting by start time |

---

## 5. Pass / Fail Criteria

### A test **passes** if:
- Rules 1–4 are applied correctly  
- All durations follow **H:MM** format  
- JSON file exports properly  
- Excel parsing has no runtime errors  
- UI updates consistently  

### A test **fails** if:
- Incorrect rounding is applied  
- Merging behaves incorrectly  
- JSON is malformed  
- Application throws errors  

---

## 6. Final Notes

This testing documentation fully covers:

- SheetJS (xlsx) integration  
- Angular 18 component behavior  
- All overtime rules  
- JSON export correctness  
- UI rendering logic  

---

# 🚒 Herramienta de Gestión de Horas Extra  
## Documentación de Pruebas (Español)

---

## 1. Introducción

Este documento define el plan de pruebas completo para la aplicación **Firefighters Overtime Processing Tool**, desarrollada en Angular 18.  
La aplicación procesa archivos `.xlsx`, aplica reglas de horas extra, une intervenciones consecutivas y genera un archivo JSON estructurado.

El plan garantiza el correcto funcionamiento de:

- Lectura de Excel mediante **SheetJS (xlsx)**
- Parseo de fechas y horas  
- Reglas de horas extra (Reglas 1–3)  
- Unión de intervenciones (Regla 4)  
- Cálculo mensual  
- Exportación JSON  
- Comportamiento de la interfaz  

---

## 2. Alcance

### Incluye:
- Subida del archivo  
- Procesamiento del Excel  
- Unión de intervenciones consecutivas  
- Aplicación de reglas 1–3  
- Totales por trabajador  
- Exportación JSON  
- Pruebas de interfaz  

### No incluye:
- Backend  
- Base de datos  
- Autenticación  

---

## 3. Entorno de Pruebas

| Componente | Versión |
|------------|---------|
| Angular | 18 |
| Node.js | ≥ 18.13 |
| Lector Excel | SheetJS (xlsx) |
| Navegadores | Chrome, Edge, Firefox |
| Formato | `.xlsx` |

---

## 4. Casos de Prueba Funcionales

---

### 4.1 Pruebas de Subida de Archivo

| ID | Prueba | Resultado |
|----|--------|-----------|
| FU-01 | Subir `.xlsx` válido | Archivo procesado |
| FU-02 | Subir archivo no válido | Rechazado |
| FU-03 | Filas vacías | Ignoradas |
| FU-04 | Subida múltiple | Solo se usa el último archivo |
| FU-05 | Re-subida del archivo | Datos previos eliminados |

---

### 4.2 Procesamiento del Excel — SheetJS (xlsx)

| ID | Escenario | Resultado |
|----|-----------|-----------|
| XP-01 | Columnas extraídas correctamente | Datos mapeados |
| XP-02 | Parseo de “dd/mm/yyyy de HH:MM a HH:MM” | Fechas válidas |
| XP-03 | Fin < inicio | Fin pasa al día siguiente |
| XP-04 | Fechas inválidas | Fila descartada |
| XP-05 | Falta ID | Fila ignorada |

---

### 4.3 Regla 4 — Unión de Intervenciones Consecutivas

**Definición**  
Si una intervención inicia exactamente cuando termina la anterior,  
las dos se **unen**, y las reglas se aplican **después**.

| ID | Escenario | Resultado Esperado |
|----|-----------|---------------------|
| R4-01 | Fin == inicio | Intervenciones unidas |
| R4-02 | 0:45 + 0:25 consecutivas | Total = **1:10** |
| R4-03 | Cadena de 3+ | Todo unido |
| R4-04 | Partes distintas | `"A + B"` |
| R4-05 | Ubicaciones distintas | `"Loc1 / Loc2"` |
| R4-06 | No consecutivas | No se unen |

---

### 4.4 Regla 1 — Duración Mínima (1:00)

| ID | Duración | Resultado |
|----|-----------|-----------|
| R1-01 | 0:15 | 1:00 |
| R1-02 | 0:59 | 1:00 |
| R1-03 | Duración unida = 1:10 | 1:10 |

---

### 4.5 Regla 2 — Redondeo a 10 Minutos

| ID | Entrada | Salida |
|----|---------|--------|
| R2-01 | 1:08 | 1:10 |
| R2-02 | 1:14 | 1:10 |
| R2-03 | 1:16 | 1:20 |
| R2-04 | 2:04 | 2:00 |

---

### 4.6 Regla 3 — Redondeo Mensual (Hacia Arriba a 30 Minutos)

| ID | Total | Resultado |
|----|--------|-----------|
| R3-01 | 7:20 | 7:30 |
| R3-02 | 7:40 | 8:00 |
| R3-03 | 10:01 | 10:30 |

---

### 4.7 Pruebas de Fechas y Horas

| ID | Entrada | Resultado |
|----|----------|-----------|
| DT-01 | Formato válido | Convertido correctamente |
| DT-02 | 23:00 → 01:00 | Avance de día |
| DT-03 | Hora inválida | Ignorado |

---

### 4.8 Pruebas de Exportación JSON

| ID | Escenario | Resultado |
|----|-----------|-----------|
| JS-01 | Exportar JSON | Descarga correcta |
| JS-02 | Estructura del JSON | Campos completos |
| JS-03 | Formato de fecha | `toLocaleString()` |
| JS-04 | Nombre del archivo | `firefighters.json` |

---

### 4.9 Pruebas de UI

| ID | Escenario | Resultado |
|----|-----------|-----------|
| UI-01 | Tarjetas por trabajador | Se muestran correctamente |
| UI-02 | Responsividad | Scroll en móviles |
| UI-03 | Botones | Aparición según estado |
| UI-04 | Orden cronológico | Correctamente ordenado |

---

## 5. Criterios de Aprobación

Un caso se **aprueba** si:

- Las reglas 1–4 se aplican correctamente  
- Todo tiempo está en **H:MM**  
- El JSON se exporta bien  
- No hay errores de ejecución  

---

## 6. Notas Finales

Este documento cubre completamente:

- Integración de SheetJS (xlsx)  
- Lógica Angular 18  
- Reglas 1–4  
- Redondeos y cálculos  
- Exportación JSON  
- Renderizado de interfaz  
