import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommandeService } from '../commande.service';
import { ArticleService } from '../../articles/article.service';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.css']
})
export class CommandeFormComponent implements OnInit {
  commande = {
    _id: null as string | null,
    id: 0,
    idClient: 0,
    lignes: [] as any[],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  articles: any[] = [];
  isEditMode = false;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerArticles();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.chargerCommande(id);
    }
  }

  chargerArticles() {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles:', err);
      }
    });
  }

  chargerCommande(id: string) {
    this.loading = true;
    console.log('🔄 Chargement commande ID:', id);
    
    this.commandeService.getById(id).subscribe({
      next: (data) => {
        console.log('✅ Commande chargée:', data);
        this.commande = {
          _id: data._id,
          id: data.id,
          idClient: data.idClient,
          lignes: data.lignes || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        this.loading = false;
        this.cdr.detectChanges();
        console.log('📋 Commande assignée:', this.commande);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la commande:', err);
        this.loading = false;
        alert('Erreur lors du chargement de la commande');
      }
    });
  }

  save() {
    if (!this.commande.id || !this.commande.idClient) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    if (this.commande.lignes.length === 0) {
      alert('Veuillez ajouter au moins un article à la commande');
      return;
    }

    // Validation des lignes avant envoi
    for (const ligne of this.commande.lignes) {
      if (!ligne.article) {
        alert('Veuillez sélectionner un article pour toutes les lignes');
        return;
      }

      const stockDisponible = this.getArticleStock(ligne.article);
      const quantiteDemandee = Number(ligne.quantite);

      if (quantiteDemandee <= 0) {
        alert(`La quantité pour "${ligne.article}" doit être supérieure à 0`);
        return;
      }

      if (quantiteDemandee > stockDisponible) {
        alert(
          `Stock insuffisant pour "${ligne.article}".\n` +
          `Disponible: ${stockDisponible}, Demandé: ${quantiteDemandee}`
        );
        return;
      }
    }

    const commandeData = {
      id: Number(this.commande.id),
      idClient: Number(this.commande.idClient),
      lignes: this.commande.lignes.map(ligne => ({
        article: ligne.article,
        quantite: Number(ligne.quantite),
        prix: Number(ligne.prix)
      })),
      createdAt: this.commande.createdAt,
      updatedAt: new Date()
    };

    if (this.isEditMode && this.commande._id) {
      // Mise à jour
      this.commandeService.update(this.commande._id, commandeData).subscribe({
        next: () => {
          alert('Commande modifiée avec succès !');
          this.router.navigate(['/commandes']);
        },
        error: (err: any) => {
          console.error('Erreur lors de la modification:', err);
          const errorMsg = err.error?.message || 'Erreur lors de la modification de la commande';
          alert(errorMsg);
        }
      });
    } else {
      // Création
      this.commandeService.create(commandeData).subscribe({
        next: () => {
          alert('Commande créée avec succès !');
          this.router.navigate(['/commandes']);
        },
        error: (err: any) => {
          console.error('Erreur lors de la création:', err);
          const errorMsg = err.error?.message || 'Erreur lors de la création de la commande';
          alert(errorMsg);
        }
      });
    }
  }

  ajouterLigne() {
    this.commande.lignes.push({
      article: '',
      quantite: 1,
      prix: 0
    });
  }

  supprimerLigne(index: number) {
    this.commande.lignes.splice(index, 1);
  }

  getArticleStock(designation: string): number {
    const article = this.articles.find(a => a.designation === designation);
    return article ? article.quantite : 0;
  }

  onArticleChange(index: number) {
    const ligne = this.commande.lignes[index];
    const article = this.articles.find(a => a.designation === ligne.article);
    if (article) {
      ligne.prix = article.prix;
    }
  }

  annuler() {
    this.router.navigate(['/commandes']);
  }
}
