import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommandeService {

  API = 'http://localhost:5201/api/commandes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    console.log('📡 Appel API Commandes:', this.API);
    return this.http.get<any[]>(this.API);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
