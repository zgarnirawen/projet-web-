import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livreur {
  _id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  disponible: boolean;
  matriculeVehicule: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivreurService {
  private apiUrl = 'http://localhost:5201/api/livreurs';

  constructor(private http: HttpClient) {}

  getAllLivreurs(): Observable<Livreur[]> {
    console.log('📡 Appel API livreurs:', this.apiUrl);
    return this.http.get<Livreur[]>(this.apiUrl);
  }

  getLivreurById(id: string): Observable<Livreur> {
    return this.http.get<Livreur>(`${this.apiUrl}/${id}`);
  }

  createLivreur(livreur: Livreur): Observable<Livreur> {
    return this.http.post<Livreur>(this.apiUrl, livreur);
  }

  updateLivreur(id: string, livreur: Livreur): Observable<Livreur> {
    return this.http.put<Livreur>(`${this.apiUrl}/${id}`, livreur);
  }

  deleteLivreur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
