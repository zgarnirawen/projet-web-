import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivreurService, Livreur } from '../livreur.service';

@Component({
  selector: 'app-livreur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './livreur-form.component.html',
  styleUrls: ['./livreur-form.component.css']
})
export class LivreurFormComponent implements OnInit {
  livreur: Livreur = {
    nom: '',
    prenom: '',
    telephone: '',
    ville: '',
    disponible: true,
    matriculeVehicule: ''
  };

  isEditMode = false;
  livreurId: string | null = null;
  loading = false;
  error = '';

  constructor(
    private livreurService: LivreurService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.livreurId = this.route.snapshot.paramMap.get('id');
    if (this.livreurId) {
      this.isEditMode = true;
      this.loadLivreur(this.livreurId);
    }
  }

  loadLivreur(id: string): void {
    this.loading = true;
    console.log('🔍 Chargement du livreur:', id);
    this.livreurService.getLivreurById(id).subscribe({
      next: (data) => {
        console.log('✅ Livreur chargé:', data);
        this.livreur = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.error = 'Erreur lors du chargement du livreur';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.livreurId) {
      console.log('🔄 Mise à jour du livreur:', this.livreurId);
      this.livreurService.updateLivreur(this.livreurId, this.livreur).subscribe({
        next: () => {
          console.log('✅ Livreur mis à jour');
          this.router.navigate(['/livreurs']);
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          this.error = 'Erreur lors de la mise à jour';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('➕ Création du livreur');
      this.livreurService.createLivreur(this.livreur).subscribe({
        next: () => {
          console.log('✅ Livreur créé');
          this.router.navigate(['/livreurs']);
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          this.error = 'Erreur lors de la création';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/livreurs']);
  }
}
