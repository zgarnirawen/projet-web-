import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: any[] = [];
  loading = false;
  error = '';

  constructor(
    private commandeService: CommandeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerCommandes();
  }

  chargerCommandes() {
    this.loading = true;
    this.error = '';
    
    console.log('🔄 Chargement des commandes...');
    
    this.commandeService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Commandes reçues:', data);
        this.commandes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = '⚠️ Backend inaccessible. Vérifiez qu\'il tourne sur le port 5201.';
        } else {
          this.error = `⚠️ Erreur ${err.status}`;
        }
      }
    });
  }

  calculateTotal(commande: any): number {
    if (!commande.lignes || commande.lignes.length === 0) return 0;
    return commande.lignes.reduce((sum: number, ligne: any) => {
      return sum + (ligne.quantite * ligne.prix);
    }, 0);
  }

  delete(id: string) {
    if (confirm('Supprimer cette commande ?')) {
      this.commandeService.delete(id).subscribe({
        next: () => {
          alert('Commande supprimée !');
          this.chargerCommandes();
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}