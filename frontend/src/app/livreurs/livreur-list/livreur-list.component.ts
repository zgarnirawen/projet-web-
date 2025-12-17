import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LivreurService, Livreur } from '../livreur.service';

@Component({
  selector: 'app-livreur-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './livreur-list.component.html',
  styleUrls: ['./livreur-list.component.css']
})
export class LivreurListComponent implements OnInit {
  livreurs: Livreur[] = [];
  loading = false;
  error = '';

  constructor(
    private livreurService: LivreurService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLivreurs();
  }

  loadLivreurs(): void {
    this.loading = true;
    this.error = '';
    console.log('🔍 Chargement des livreurs...');
    this.livreurService.getAllLivreurs().subscribe({
      next: (data) => {
        console.log('✅ Données reçues:', data);
        console.log('📊 Nombre de livreurs:', data.length);
        this.livreurs = data;
        this.loading = false;
        console.log('✅ Loading terminé, livreurs:', this.livreurs);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = '⚠️ Backend inaccessible. Vérifiez qu\'il tourne sur le port 5201.';
        } else if (err.status === 404) {
          this.error = '⚠️ Route API non trouvée.';
        } else {
          this.error = 'Erreur lors du chargement des livreurs';
        }
        this.cdr.detectChanges();
      }
    });
  }

  deleteLivreur(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      this.livreurService.deleteLivreur(id).subscribe({
        next: () => {
          this.loadLivreurs();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error('Erreur:', err);
        }
      });
    }
  }

  editLivreur(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/livreurs/edit', id]);
    }
  }

  addLivreur(): void {
    this.router.navigate(['/livreurs/new']);
  }
}
