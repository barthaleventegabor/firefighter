# 🚒 Firefighters Overtime Processing Tool  
### Excel → JSON Conversion (Angular 18)

## 📌 Project Overview

This project is an **Angular 18 web application** designed for processing firefighter intervention records stored in Excel `.xlsx` files.  
The application reads Excel data, applies specific overtime calculation rules, groups results by worker, and generates a downloadable JSON output.

The entire implementation is handled within a **single standalone Angular component (`AppComponent`)**, making the project lightweight and easy to maintain.

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

yaml
Kód másolása

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

1:03 → 1:00
1:06 → 1:10
1:14 → 1:10
1:17 → 1:20

pgsql
Kód másolása

#### **Rule 3 — Monthly Worker Summary Rounding**
After summing all adjusted minutes for a worker,  
the final total is **rounded UP to 30-minute blocks**:

7h 20m → 7h 30m
7h 40m → 8h 00m

yaml
Kód másolása

All rounded values are output in **H:MM format**.

---

## 📊 Data Grouping per Worker

The application creates a `WorkerSummary` structure:

id
name
interventions[] → each with:

location

start / end

report

duration (raw)

adjusted duration
totalAdjustedHours (final monthly rounded total)

yaml
Kód másolása

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

markdown
Kód másolása

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
