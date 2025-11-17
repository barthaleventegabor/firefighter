/*
Filename: app.component.ts
Authors: Vámosi László Ádám, Bartha Levente Gábor, Cipola Ákos
Cordoba, 2025
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

interface Intervention {
  location: string;
  start: Date;
  end: Date;
  report: string;
  durationMinutes: number;
  adjustedMinutes?: number;
  totalHours?: string;
  adjustedHours?: string;
}

interface WorkerSummary {
  id: string;
  name: string;
  interventions: Intervention[];
  totalAdjustedHours: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firefighters';
  workerSummaries: WorkerSummary[] = [];
  pendingRows: any[][] = [];

  // ───────────────────────────────────────────
  //              FILE FELTÖLTÉS + VALIDÁCIÓ
  // ───────────────────────────────────────────
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (!target.files || target.files.length !== 1) return;

    const file = target.files[0];

    // ❌ Rossz formátum – nem XLSX
    if (!file.name.endsWith('.xlsx')) {
      Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: 'Solo se permiten archivos .xlsx'
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' });

        if (!wb.SheetNames || wb.SheetNames.length === 0) {
          return this.errorFile("El archivo está vacío o no contiene hojas.");
        }

        const ws = wb.Sheets[wb.SheetNames[0]];
        if (!ws) {
          return this.errorFile("No se pudo leer la hoja principal del archivo.");
        }

        const rows: any[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: ''
        }) as any[][];

        // ─────────────────────────────────────
        //      XLSX STRUKTÚRA ELLENŐRZÉS
        // ─────────────────────────────────────
        if (!this.validateStructure(rows)) {
          return this.errorFile(
            "Este archivo XLSX no coincide con el formato esperado por la herramienta."
          );
        }

        this.pendingRows = rows;
        this.workerSummaries = [];

      } catch {
        return this.errorFile(
          "El archivo seleccionado no es un XLSX válido o está dañado."
        );
      }
    };

    reader.readAsBinaryString(file);
  }

  // ───────────────────────────────────────────
  //           XLSX STRUKTÚRA VALIDÁLÁSA
  // ───────────────────────────────────────────
  validateStructure(rows: any[][]): boolean {
    if (!rows || rows.length < 2) return false;

    const header = rows[0];

    // Legalább 5 oszlop kell
    if (header.length < 5) return false;

    // Legalább egy sorban legyen ID + Name + DateField
    const validRow = rows.slice(1).find(r =>
      r[0] && r[1] && r[3] && typeof r[3] === "string"
    );

    return !!validRow;
  }

  // ───────────────────────────────────────────
  //                FELDOLGOZÁS
  // ───────────────────────────────────────────
  processPendingData() {
    if (this.pendingRows.length === 0) return;

    try {
      this.processRows(this.pendingRows);
      this.pendingRows = [];
    } catch (err: any) {
      this.errorFile(err?.message ?? "Error inesperado durante el procesamiento.");
    }
  }

  processRows(rows: any[][]) {
    const data = rows.slice(1);
    const workers: Record<string, WorkerSummary> = {};

    for (const row of data) {
      if (!row[0]) continue;

      const workerId = row[0];
      const name = row[1];
      const location = row[2];
      const startEnd = row[3];
      const report = row[4];

      const { start, end } = this.parseStartEnd(startEnd);
      const duration = (end.getTime() - start.getTime()) / 60000;

      if (!workers[workerId]) {
        workers[workerId] = {
          id: workerId,
          name,
          interventions: [],
          totalAdjustedHours: ''
        };
      }

      workers[workerId].interventions.push({
        location,
        start,
        end,
        report,
        durationMinutes: duration
      });
    }

    for (const worker of Object.values(workers)) {
      worker.interventions.sort((a, b) => a.start.getTime() - b.start.getTime());
      this.applyRules(worker);
    }

    this.workerSummaries = Object.values(workers);
  }

  // ───────────────────────────────────────────
  //          DÁTUM PARSER + VALIDÁLÁS
  // ───────────────────────────────────────────
  parseStartEnd(text: string): { start: Date; end: Date } {
    const match = text.match(
      /(\d{2}\/\d{2}\/\d{4}).*?(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/
    );

    if (!match) {
      this.errorFile(`Formato de fecha inválido: "${text}"`);
      throw new Error('Invalid date format: ' + text);
    }

    const [_, dateStr, startStr, endStr] = match;
    const [d, m, y] = dateStr.split('/').map(Number);

    const start = new Date(y, m - 1, d, ...startStr.split(':').map(Number));
    let end = new Date(y, m - 1, d, ...endStr.split(':').map(Number));

    if (end < start) end.setDate(end.getDate() + 1);

    return { start, end };
  }

  // ───────────────────────────────────────────
  //                SZABÁLYOK
  // ───────────────────────────────────────────
  applyRules(worker: WorkerSummary) {
    const merged: Intervention[] = [];

    for (const current of worker.interventions) {
      const last = merged[merged.length - 1];

      if (last && last.end.getTime() === current.start.getTime()) {
        last.end = current.end;
        last.report += ` + ${current.report}`;
        last.location += ` / ${current.location}`;
        last.durationMinutes += current.durationMinutes;
      } else {
        merged.push({ ...current });
      }
    }

    let totalAdjustedMinutes = 0;

    for (const interv of merged) {
      let minutes = interv.durationMinutes;

      if (minutes < 60) {
        minutes = 60;
      } else {
        const rem = minutes % 10;
        minutes = rem >= 5 ? minutes + (10 - rem) : minutes - rem;
      }

      interv.adjustedMinutes = minutes;
      interv.totalHours = this.formatMinutes(interv.durationMinutes);
      interv.adjustedHours = this.formatMinutes(minutes);
      totalAdjustedMinutes += minutes;
    }

    const rem = totalAdjustedMinutes % 30;
    if (rem > 0) totalAdjustedMinutes += 30 - rem;

    const h = Math.floor(totalAdjustedMinutes / 60);
    const m = totalAdjustedMinutes % 60;

    worker.totalAdjustedHours = `${h}:${m.toString().padStart(2, '0')}`;
    worker.interventions = merged;
  }

  formatMinutes(mins?: number): string {
    if (mins == null) return '-';
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  // ───────────────────────────────────────────
  //              JSON EXPORT
  // ───────────────────────────────────────────
  downloadJSON() {
    const exportData = this.workerSummaries.map(w => ({
      id: w.id,
      name: w.name,
      totalAdjustedHours: w.totalAdjustedHours,
      interventions: w.interventions.map(i => ({
        location: i.location,
        start: i.start.toLocaleString(),
        end: i.end.toLocaleString(),
        report: i.report,
        totalHours: i.totalHours,
        adjustedHours: i.adjustedHours
      }))
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'firefighters.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  // ───────────────────────────────────────────
  //              SweetAlert ERROR HANDLER
  // ───────────────────────────────────────────
  errorFile(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo no compatible',
      text: msg
    });
  }
}
