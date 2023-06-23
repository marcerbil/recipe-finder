import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';
import { SearchRecipeComponent } from './search-recipe.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchRecipeComponent', () => {
  let component: SearchRecipeComponent;
  let fixture: ComponentFixture<SearchRecipeComponent>;
  let router: Router;
  let searchRecipeService: SearchRecipeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule
      ],        
      declarations: [ SearchRecipeComponent ],
      providers: [ SearchRecipeServiceService ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchRecipeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchRecipeService = TestBed.inject(SearchRecipeServiceService);
  });

  it('should prevent default action of an event and perform search', fakeAsync(() => {
    // Create a fake/spy event
    const event = {
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    // Add ingredients to the component
    component.ingredients = ['onion', 'garlic'];

    // Spy on the search method from searchRecipeService
    spyOn(searchRecipeService, 'search').and.callThrough();

    // Spy and stub the navigation method from router
    spyOn(router, 'navigate').and.stub();

    // Call the search method with the fake event
    component.search(event as unknown as Event);

    // Simulate the passage of time until all pending asynchronous activities finish.
    tick();

    // Assert that preventDefault was called
    expect(event.preventDefault).toHaveBeenCalled();

    // Assert that searchRecipeService.search was called with correct argument
    expect(searchRecipeService.search).toHaveBeenCalledWith(component.ingredients.toString());

  }));

  it('should process input', () => {
    // Add ingredients to the component
    component.ingredients = ['onion', 'garlic'];

    // Set ingredientSearch value
    component.ingredientSearch.setValue('tomato');

    // Call the processInput method
    component.processInput();

    // Assert that ingredientSearch value is empty
    expect(component.ingredientSearch.value).toEqual('');

    // Assert that ingredients array has 3 elements
    expect(component.ingredients.length).toEqual(3);
  });

  it('should unsubscribe from searchResult$ when destroyed', () => {
    // Spy on the unsubscribe method from searchResult$
    const subSpy = spyOn(component.sub, 'unsubscribe');

    // Call the ngOnDestroy method
    component.ngOnDestroy();

    // Assert that unsubscribe was called
    expect(subSpy).toHaveBeenCalled();
  });
});