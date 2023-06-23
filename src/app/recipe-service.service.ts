import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {
  private recipeSource = new BehaviorSubject<any>({});
  private recipeIdsSource = new BehaviorSubject<any>({});

  currentRecipe = this.recipeSource.asObservable();
  currentRecipeIds = this.recipeIdsSource.asObservable();

  constructor() { }

  changeRecipe(recipe: any) {
    this.recipeSource.next(recipe);
  }

  changeRecipeIds(ids: any) {
    this.recipeIdsSource.next(ids);
  }
}
