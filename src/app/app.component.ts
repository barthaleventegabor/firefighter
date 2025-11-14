/*
Filename: app.component.ts
Author: Vámosi László Ádám, Bartha Levente Gábor, Cipola Ákos
Cordoba, 2025
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

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

  // Nyers, még feldolgozatlan Excel sorok
  pendingRows: any[][] = [];

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];

      // Mindig az új fájl kerül a pendingRows-ba
      this.pendingRows = rows;
      this.workerSummaries = [];  // ← így eltűnik a régi táblázat
    };

    reader.readAsBinaryString(file);
  }

  processPendingData() {
    if (this.pendingRows.length === 0) return;

    this.processRows(this.pendingRows);
    this.pendingRows = [];
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

      if (!startEnd) continue;

      const { start, end } = this.parseStartEnd(startEnd);
      const duration = (end.getTime() - start.getTime()) / 60000;

      if (!workers[workerId]) {
        workers[workerId] = { id: workerId, name, interventions: [], totalAdjustedHours: '' };
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

  parseStartEnd(text: string): { start: Date; end: Date } {
    const match = text.match(/(\d{2}\/\d{2}\/\d{4}).*?(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
    if (!match) throw new Error('Invalid date format: ' + text);

    const [_, dateStr, startStr, endStr] = match;
    const [day, month, year] = dateStr.split('/').map(Number);

    const start = new Date(year, month - 1, day, ...startStr.split(':').map(Number));
    let end = new Date(year, month - 1, day, ...endStr.split(':').map(Number));
    if (end < start) end.setDate(end.getDate() + 1);

    return { start, end };
  }

  applyRules(worker: WorkerSummary) {
    const mergedInterventions: Intervention[] = [];

    for (const current of worker.interventions) {
      const last = mergedInterventions[mergedInterventions.length - 1];

      if (last && last.end.getTime() === current.start.getTime()) {
        last.end = current.end;
        last.report += ` + ${current.report}`;
        last.location += ` / ${current.location}`;
        last.durationMinutes += current.durationMinutes;
      } else {
        mergedInterventions.push({ ...current });
      }
    }

    let totalAdjustedMinutes = 0;
    for (const interv of mergedInterventions) {
      let minutes = interv.durationMinutes;

      if (minutes < 60) {
        minutes = 60;
      } else {
        const remainder = minutes % 10;
        minutes = remainder >= 5 ? minutes + (10 - remainder) : minutes - remainder;
      }

      interv.adjustedMinutes = minutes;
      interv.totalHours = this.formatMinutes(interv.durationMinutes);
      interv.adjustedHours = this.formatMinutes(minutes);
      totalAdjustedMinutes += minutes;
    }

    const remainder = totalAdjustedMinutes % 30;
    if (remainder > 0) totalAdjustedMinutes += 30 - remainder;

    const hours = Math.floor(totalAdjustedMinutes / 60);
    const minutes = totalAdjustedMinutes % 60;
    const minutesStr = minutes.toString().padStart(2, '0');
    worker.totalAdjustedHours = `${hours}:${minutesStr}`;
    worker.interventions = mergedInterventions;
  }

  formatMinutes(mins?: number): string {
    if (mins == null) return '-';
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    const mStr = m.toString().padStart(2, '0');
    return `${h}:${mStr}`;
  }

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

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firefighters.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
