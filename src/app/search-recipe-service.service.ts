import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment.secrets';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root'
})
export class SearchRecipeServiceService implements OnDestroy {
  private searchResult = new BehaviorSubject<any>(null);
  public searchResult$ = this.searchResult.asObservable();
  private recipesSource = new BehaviorSubject<Recipe[]>([]);
  public recipes$ = this.recipesSource.asObservable();
  public recipe: any;

  constructor(private http: HttpClient) { }

  private getFromCache(id: number): Recipe {
    let storedRecipes = localStorage.getItem('recipes');
    let cachedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
    return cachedRecipes.find((recipe: Recipe) => recipe.id === id);
  }

  private saveToCache(recipe: Recipe): void {
    let storedRecipes = localStorage.getItem('recipes');
    let cachedRecipes: Recipe[] = storedRecipes ? JSON.parse(storedRecipes) : [];
    let existingIndex = cachedRecipes.findIndex(r => r.id === recipe.id);
  
    if (existingIndex > -1) {
      // If the recipe already exists in cache, replace it
      cachedRecipes[existingIndex] = recipe;
    } else {
      // If it's a new recipe, add it to cache
      cachedRecipes.push(recipe);
    }
  
    localStorage.setItem('recipes', JSON.stringify(cachedRecipes));
  }  
  
  setSearchResult(result: any) {
    this.searchResult = result;
  }

  getSearchResult(): Observable<any> {
    return this.searchResult$;
  }

  // Hit endpoint with search terms and set searchResult
  // /recipes/findByIngredients?ingredients=<ingredients>
  search(searchTerms: string): Observable<Recipe> {
    try {
      const searchTermsEnc = encodeURIComponent(searchTerms.replace(/,\s+/g, ','));
      const searchOptions = 'ranking=1&ignorePantry=true&number=5';
      const searchRequest = `${searchTermsEnc}&${searchOptions}`;
      const url = `${environment.apiUrl}/recipes/findByIngredients?ingredients=${searchRequest}`;
      
      this.http.get(url, {
        headers: {
          'X-RapidAPI-Key': `${environment.apiKey}`,
          'X-RapidAPI-Host': `${environment.apiHost}`
        }
      }).subscribe(response => {
        this.searchResult.next(response);
      });

    } catch (error) {
      console.error(error);
    }

    return this.getSearchResult();
  }

  // Get recipe by id
  // /recipes/id/information
  getRecipe(id: number): Observable<any> {
    const url = `${environment.apiUrl}/recipes/${id}/information`;
    const cachedRecipe = this.getFromCache(id);

    if (cachedRecipe) {
      return of(cachedRecipe);
    } else {
      return this.http.get<Recipe>(url).pipe(
        tap((recipe: Recipe) => {
          this.saveToCache(recipe);
        })
      );
    }
  }

  // Get bulk recipes by id
  // informationBulk?ids=456%2C987%2C321
  getRecipes(ids: number[]): Observable<Recipe[]> {
    let storedRecipes = localStorage.getItem('recipes');
    let cachedRecipes: Recipe[] = storedRecipes ? JSON.parse(storedRecipes) : [];
  
    // Prepare an array for recipes that need to be fetched
    let fetchIds: number[] = [];
    // Prepare an array for recipes that are found in cache
    let foundRecipes: Recipe[] = [];
  
    for (let id of ids) {
      let cachedRecipe = cachedRecipes.find(r => r.id === id);
  
      if (cachedRecipe) {
        // If the recipe is found in cache, add it to the foundRecipes array
        foundRecipes.push(cachedRecipe);
      } else {
        // If not found in cache, add its id to the fetchIds array
        fetchIds.push(id);
      }
    }
  
    // If all recipes are found in cache, return them as an Observable
    if (fetchIds.length === 0) {
      console.log('All recipes found in cache');
      this.recipesSource.next(foundRecipes); // Emit the recipes from cache
      return of(foundRecipes);
    }
  
    // If some recipes are not in cache, fetch them from server
    const url = `${environment.apiUrl}/recipes/informationBulk?ids=${fetchIds.join(',')}`;
  
    return this.http.get<Recipe[]>(url, {
      headers: {
        'X-RapidAPI-Key': `${environment.apiKey}`,
        'X-RapidAPI-Host': `${environment.apiHost}`
      }
    }).pipe(
      map((fetchedRecipes: Recipe[]) => {
        // Add fetched recipes to cache
        console.log('Adding recipes to cache' + fetchedRecipes);
        cachedRecipes = cachedRecipes.concat(fetchedRecipes);
        localStorage.setItem('recipes', JSON.stringify(cachedRecipes));

        // Add fetched recipes to the foundRecipes array
        foundRecipes = foundRecipes.concat(fetchedRecipes);
        this.recipesSource.next(foundRecipes);

        return foundRecipes; // Return the combined array of found and fetched recipes
      })
    );
  }

  ngOnDestroy() {
    this.searchResult.unsubscribe();
    this.recipesSource.unsubscribe();
  }
  
}
