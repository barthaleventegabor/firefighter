# 🚒 Firefighters Overtime Processing Tool (English) 
### Excel → JSON Conversion (Angular 18)

## 📌 Project Overview

This project is an **Angular 18 web application** designed for processing firefighter intervention records stored in Excel `.xlsx` files.  
The application reads Excel data, applies specific overtime calculation rules, groups results by worker, and generates a downloadable JSON output.

The entire implementation is handled within a **single standalone Angular component (`AppComponent`)**, making the project lightweight and easy to maintain.

---

## 🚀 Running the Project

### Prerequisites
- Node.js ≥ 18.13

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
ng serve
```

---


## 🛠 Technologies Used

### **Frontend Framework**
- Angular 18 (standalone components, no routing)
- TypeScript (full business logic implementation)

### **UI & Styling**
- HTML / CSS  
- Bootstrap (layout, styling, responsive tables)  
- SweetAlert2 (alerts for file upload, processing feedback)

### **File Handling**
- `xlsx` (SheetJS) – Excel `.xlsx` parsing  
- Browser Blob API – JSON export  

---

## 📂 Features

### ✔ 1. Excel File Upload
Users can upload `.xlsx` files through a Bootstrap-styled file input.

---

### ✔ 2. Excel Row Processing  
Each row of the spreadsheet is converted into structured data fields:

- Worker ID  
- Worker name  
- Location  
- Start–End timestamps  
- Report number  
- Calculated duration  

---

### ✔ 3. Timestamp Parsing  
The system extracts dates from strings such as:

02/07/2025 de 23:15 a 00:30


Automatically handles:

- Date extraction  
- Time extraction  
- **Cross-midnight shifts** (end time < start time → next day)

---

### ✔ 4. Intervention Merging

Interventions that occur **back-to-back** (end time == next start time) are merged:

- Duration is combined  
- Reports are concatenated  
- Locations are merged  

---

### ✔ 5. Overtime Calculation Rules

Each intervention is processed using these rules:

#### **Rule 1 — Minimum Duration**
If an intervention is less than **60 minutes**, it is rounded up to **1 hour**.

> Exception: merged interventions follow total accumulated time.

#### **Rule 2 — Rounding to 10-minute blocks**
Durations above 60 minutes are rounded to the nearest 10 minutes:

1:03 → 1:10  
1:06 → 1:10  
1:14 → 1:20  
1:17 → 1:20

#### **Rule 3 — Monthly Worker Summary Rounding**
After summing all adjusted minutes for a worker,  
the final total is **rounded UP to 30-minute blocks**:

7h 20m → 7h 30m  
7h 40m → 8h 00m

All rounded values are output in **H:MM format**.

---

## 📊 Data Grouping per Worker

The application creates a `WorkerSummary` structure:

id  
name  
interventions[] → each with:

- location
- start / end
- report
- duration (raw)
- adjusted duration

totalAdjustedHours (final monthly rounded total)

Each worker receives:

- A card displaying their name and ID  
- A Bootstrap table listing their interventions  
- A footer showing the **final monthly rounded total**

---

## 💾 JSON Export

With one click, users can export the computed results as a `.json` file containing:

- Worker metadata  
- All interventions  
- Start/end timestamps  
- Total and adjusted durations  
- Final monthly totals  

Exporting is handled via the **browser’s Blob API**.

---

## 🖥 User Interface Overview

The web page includes:

### 🟥 **Header**
A red Bootstrap-styled title:

🚒 Firefighters Overtime Tool

### 📤 **File Upload**
A simple file selector styled with:

- `form-control`  
- `form-control-sm`  
- `mb-3`

### 📥 **JSON Download**
Visible only after processing:

- `btn btn-secondary`

### 📑 **Worker Tables**
Each worker has:

- A card with their name and ID  
- A table listing all interventions  
- A footer summarizing the total adjusted hours  

All tables are fully responsive via:

- `.table-responsive`
  
---

# 🚒 Herramienta de Procesamiento de Horas Extra de Bomberos (Español)
### Excel → Conversión a JSON (Angular 18)

## 📌 Resumen del Proyecto

Este proyecto es una **aplicación web Angular 18** diseñada para procesar los registros de intervenciones de bomberos almacenados en archivos Excel `.xlsx`.  
La aplicación lee los datos de Excel, aplica reglas específicas para calcular horas extra, agrupa los resultados por trabajador y genera un archivo JSON descargable.

Toda la implementación se maneja dentro de un **único componente independiente de Angular (`AppComponent`)**, lo que hace que el proyecto sea ligero y fácil de mantener.

---

## 🚀 Ejecutando el Proyecto

### Requisitos Previos
- Node.js ≥ 18.13

### Instalar Dependencias
```bash
npm install
```

### Iniciar el Servidor de Desarrollo
```bash
ng serve
```

---

## 🛠 Tecnologías Utilizadas

### **Framework Frontend**
- Angular 18 (componentes independientes, sin routing)  
- TypeScript (implementación completa de la lógica de negocio)

### **UI y Estilos**
- HTML / CSS  
- Bootstrap (diseño, estilos, tablas responsivas)  
- SweetAlert2 (alertas para subida de archivos y feedback de procesamiento)

### **Manejo de Archivos**
- `xlsx` (SheetJS) – Parsing de archivos Excel `.xlsx`  
- Browser Blob API – Exportación a JSON  

---

## 📂 Funcionalidades

### ✔ 1. Subida de Archivos Excel
Los usuarios pueden subir archivos `.xlsx` mediante un selector de archivos estilizado con Bootstrap.

---

### ✔ 2. Procesamiento de Filas de Excel  
Cada fila de la hoja de cálculo se convierte en campos de datos estructurados:

- ID del trabajador  
- Nombre del trabajador  
- Ubicación  
- Tiempos de inicio y fin  
- Número de informe  
- Duración calculada  

---

### ✔ 3. Parsing de Tiempos  
El sistema extrae fechas de cadenas como:

02/07/2025 de 23:15 a 00:30

Maneja automáticamente:

- Extracción de fecha  
- Extracción de hora  
- **Turnos que cruzan la medianoche** (fin < inicio → siguiente día)

---

### ✔ 4. Fusión de Intervenciones

Las intervenciones que ocurren **una tras otra** (fin == siguiente inicio) se fusionan:

- Se combinan las duraciones  
- Se concatenan los informes  
- Se fusionan las ubicaciones  

---

### ✔ 5. Reglas de Cálculo de Horas Extra

Cada intervención se procesa usando estas reglas:

#### **Regla 1 — Duración Mínima**
Si una intervención dura menos de **60 minutos**, se redondea a **1 hora**.

> Excepción: las intervenciones fusionadas siguen la duración total acumulada.

#### **Regla 2 — Redondeo a bloques de 10 minutos**
Duraciones mayores a 60 minutos se redondean al múltiplo de 10 minutos más cercano:

1:03 → 1:10  
1:06 → 1:10  
1:14 → 1:20  
1:17 → 1:20

#### **Regla 3 — Redondeo mensual por trabajador**
Después de sumar todos los minutos ajustados de un trabajador,  
el total final se **redondea hacia arriba a bloques de 30 minutos**:

7h 20m → 7h 30m  
7h 40m → 8h 00m

Todos los valores redondeados se muestran en **formato H:MM**.

---

## 📊 Agrupación de Datos por Trabajador

La aplicación crea una estructura `WorkerSummary`:

id  
nombre  
intervenciones[] → cada una con:

- ubicación  
- inicio / fin  
- informe  
- duración (original)  
- duración ajustada

totalAdjustedHours (total mensual final redondeado)

Cada trabajador recibe:

- Una tarjeta mostrando su nombre e ID  
- Una tabla de Bootstrap listando sus intervenciones  
- Un pie de tabla mostrando el **total mensual final redondeado**

---

## 💾 Exportación a JSON

Con un solo clic, los usuarios pueden exportar los resultados calculados como un archivo `.json` que contiene:

- Metadatos del trabajador  
- Todas las intervenciones  
- Tiempos de inicio/fin  
- Duraciones totales y ajustadas  
- Totales finales mensuales

La exportación se maneja mediante la **Browser Blob API**.

---

## 🖥 Vista de la Interfaz de Usuario

La página web incluye:

### 🟥 **Encabezado**
Título en Bootstrap rojo:

🚒 Herramienta de Horas Extra de Bomberos

### 📤 **Subida de Archivo**
Un selector de archivos simple estilizado con:

- `form-control`  
- `form-control-sm`  
- `mb-3`

### 📥 **Descarga JSON**
Visible solo después del procesamiento:

- `btn btn-secondary`

### 📑 **Tablas por Trabajador**
Cada trabajador tiene:

- Una tarjeta con su nombre e ID  
- Una tabla listando todas las intervenciones  
- Un pie de tabla resumiendo el total de horas ajustadas

Todas las tablas son totalmente responsivas gracias a:

- `.table-responsive`