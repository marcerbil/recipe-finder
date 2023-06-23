import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';
import {COMMA, ENTER, PLUS_SIGN} from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { fadeInAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.scss'],
  animations: [
    fadeInAnimation
  ]
})
export class SearchRecipeComponent implements OnInit, OnDestroy {
  ingredientSearch = new FormControl('');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, PLUS_SIGN];
  ingredients: string[] = [];
  value = "";
  recipes: any;
  sub: Subscription = new Subscription();

  constructor(
    private searchRecipeService: SearchRecipeServiceService,
    private router: Router
  ) { }

  search(event: Event) {
    event.preventDefault();
        
    if (this.ingredients && this.ingredients.length > 0) {
      this.searchRecipeService.search(this.ingredients.toString());
      this.router.navigate(['/ingredient-search', {ingredients: this.ingredients}]);
    }
  }

  getSearchResult() {
    return this.searchRecipeService.getSearchResult();
  }

  // handling comma separation
  processInput(): void {
    let value = '';
  
    if (this.ingredientSearch.value && this.ingredientSearch.value.length > 0) {
      if (this.ingredientSearch.value.includes(',')) {
        value = this.ingredientSearch.value.trim().slice(0, -1); // Remove the trailing comma
      } else {
        value = this.ingredientSearch.value;
      }
  
      if (value && !this.ingredients.includes(value)) {
        this.ingredients = [...this.ingredients, value];
        this.ingredientSearch.setValue('');
      }
    }
  }
  
  onKeyUp(event: KeyboardEvent): void {
    if (this.separatorKeysCodes.includes(event.keyCode)) {
      this.processInput();
    }
  }
  
  add() {
    this.processInput();
  }

  remove(ingredient: string) {
    const index = this.ingredients.indexOf(ingredient);

    if (index >= 0) {
      this.ingredients.splice(index, 1);
    }
  }

  ngOnInit() {
    this.sub = this.searchRecipeService.searchResult$.subscribe(result => {
      this.recipes = result;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}