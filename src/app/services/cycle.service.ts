import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CycleService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/v1/cycle-elective';

    createCycle(data: { year: number; startTime: Date; finalTime: Date; fourMonthPeriod: number }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    getCurrentCycle(): Observable<any> {
        return this.http.get(`${this.apiUrl}/current`);
    }

    toggleExamTables(id: string, enabled: boolean): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/exam-tables`, { enabled });
    }
}
