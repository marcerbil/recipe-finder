import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInAnimation } from 'src/app/animations';
import { RecipeServiceService } from 'src/app/recipe-service.service';
import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  animations: [
    fadeInAnimation
  ]
})
export class RecipeDetailComponent implements OnInit {
  recipeIds: number[] = [];
  selectedRecipe: number = 1;
  recipeDetail: any;
  recipesDetails: any[] = [];
  recipeDetailDietary: any[] = [];

  constructor(
    private searchRecipeService: SearchRecipeServiceService,
    private recipeService: RecipeServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.recipeService.currentRecipe.subscribe(recipe => this.selectedRecipe = recipe);
    this.recipeService.currentRecipeIds.subscribe(recipeIds => this.recipeIds = recipeIds); 

    try {
      this.fetchRecipesDetails();        
    } catch (error) {
      console.log(error);
      this.router.navigate(['/']);
    }
  }

  fetchRecipesDetails() {
    this.searchRecipeService.getRecipes(this.recipeIds)
    .subscribe(
      recipes => {
        this.recipesDetails = recipes;
        this.updateRecipeDetail();
      },
      error => {
        console.error(error);
        this.router.navigate(['/']);
      }
    );
  }

  updateRecipeDetail() {
    this.recipeDetail = this.recipesDetails.find((recipe: any) => recipe.id === this.selectedRecipe);

    this.recipeDetailDietary = [
      {name: "vegetarian", value: this.recipeDetail.vegetarian},
      {name: "vegan", value: this.recipeDetail.vegan},
      {name: "glutenFree", value: this.recipeDetail.glutenFree},
      {name: "dairyFree", value: this.recipeDetail.dairyFree},
      {name: "lowFodmap", value: this.recipeDetail.lowFodmap},
      {name: "ketogenic", value: this.recipeDetail.ketogeni}
    ];    
  }
}
