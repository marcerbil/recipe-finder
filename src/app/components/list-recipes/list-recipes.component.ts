import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { listAnimation } from 'src/app/animations';
import { RecipeServiceService } from 'src/app/recipe-service.service';
import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';

@Component({
  selector: 'app-list-recipes',
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.scss'],
  animations: [
    listAnimation
  ]
})
export class ListRecipesComponent implements OnInit, OnDestroy {
  selectedRecipe: number = 1;
  recipes: any;
  recipeIds: number[] = [];
  animState = 'start';
  sub: Subscription = new Subscription();
  
  constructor(
    private searchRecipeService: SearchRecipeServiceService,
    private router: Router,
    private recipeService: RecipeServiceService
  ) { }

  ngOnInit() {
    this.updateResults();
    
    // trigger animation
    setTimeout(() => {
      this.animState = 'finish';
    }, 100);
  }

  selectRecipe(id: number) {
    this.selectedRecipe = id;
    this.recipeService.changeRecipe(this.selectedRecipe);
    this.recipeService.changeRecipeIds(this.recipeIds);
    this.updateResults();
    this.router.navigate(['recipe']);
  }

  updateResults() {
    try {
      this.sub = this.searchRecipeService.searchResult$.subscribe(result => {       
        if (result !== null && result.length > 0) {
          this.recipes = result;
          this.recipeIds = result.map((recipe: any) => recipe.id);
        }
      });  
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
