import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../articles/article.service';
import { CommandeService } from '../commandes/commande.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statistiques = {
    totalArticles: 0,
    totalCommandes: 0,
    chiffreAffaires: 0,
    valeurStock: 0
  };
  loading = true;

  constructor(
    private articleService: ArticleService,
    private commandeService: CommandeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerStatistiques();
  }

  chargerStatistiques() {
    this.loading = true;

    forkJoin({
      articles: this.articleService.getAll(),
      commandes: this.commandeService.getAll()
    }).subscribe({
      next: (data) => {
        this.statistiques.totalArticles = data.articles.length;
        this.statistiques.totalCommandes = data.commandes.length;
        
        // Calculer la valeur du stock
        this.statistiques.valeurStock = data.articles.reduce((total: number, article: any) => {
          return total + (article.quantite * article.prix);
        }, 0);
        console.log('💎 Valeur du stock:', this.statistiques.valeurStock);
        
        // Calculer le chiffre d'affaires total
        console.log('📊 Calcul CA - Nombre de commandes:', data.commandes.length);
        this.statistiques.chiffreAffaires = data.commandes.reduce((total, commande) => {
          const commandeTotal = commande.lignes.reduce((sum: number, ligne: any) => {
            const ligneTotal = ligne.quantite * ligne.prix;
            console.log(`  Ligne: ${ligne.article} - ${ligne.quantite} x ${ligne.prix} = ${ligneTotal}`);
            return sum + ligneTotal;
          }, 0);
          console.log(`  Total commande ${commande.id}: ${commandeTotal}`);
          return total + commandeTotal;
        }, 0);
        console.log('💰 Chiffre d\'affaires total:', this.statistiques.chiffreAffaires);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
        this.loading = false;
      }
    });
  }
}