import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  article = {
    _id: null as string | null,
    designation: '',
    quantite: 0,
    prix: 0
  };
  
  isEditMode = false;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.chargerArticle(id);
    }
  }

  chargerArticle(id: string) {
    this.loading = true;
    console.log('🔄 Chargement article ID:', id);
    
    this.articleService.getById(id).subscribe({
      next: (data) => {
        console.log('✅ Article chargé:', data);
        this.article = {
          _id: data._id,
          designation: data.designation,
          quantite: data.quantite,
          prix: data.prix
        };
        this.loading = false;
        this.cdr.detectChanges();
        console.log('📋 Article assigné:', this.article);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'article:', err);
        this.loading = false;
        alert('Erreur lors du chargement de l\'article');
      }
    });
  }

  save() {
    if (!this.article.designation || this.article.quantite < 0 || this.article.prix <= 0) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    if (this.isEditMode && this.article._id) {
      // Mise à jour - exclure _id des données
      const { _id, ...articleData } = this.article;
      this.articleService.update(this.article._id, articleData).subscribe({
        next: () => {
          alert('Article modifié avec succès !');
          this.router.navigate(['/articles']);
        },
        error: (err) => {
          console.error('Erreur lors de la modification:', err);
          alert('Erreur lors de la modification de l\'article');
        }
      });
    } else {
      // Création
      this.articleService.create(this.article).subscribe({
        next: () => {
          alert('Article créé avec succès !');
          this.router.navigate(['/articles']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          alert('Erreur lors de la création de l\'article');
        }
      });
    }
  }

  annuler() {
    this.router.navigate(['/articles']);
  }
}