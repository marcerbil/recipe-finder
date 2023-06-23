import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchRecipeComponent } from './components/search-recipe/search-recipe.component';
import { ListRecipesComponent } from './components/list-recipes/list-recipes.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: '', component: SearchRecipeComponent, pathMatch: 'full' },
  { path: 'ingredient-search', component: ListRecipesComponent },
  { path: 'recipe', component: RecipeDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
