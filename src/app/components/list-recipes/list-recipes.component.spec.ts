import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListRecipesComponent } from './list-recipes.component';
import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

describe('ListRecipesComponent', () => {
  let component: ListRecipesComponent;
  let fixture: ComponentFixture<ListRecipesComponent>;
  let searchRecipeService: any;
  let searchResult$: BehaviorSubject<any>;
  
  beforeEach(() => {
    searchResult$ = new BehaviorSubject({});
    searchRecipeService = {
      getSearchResult: 
        jasmine.createSpy('getSearchResult').and.returnValue(searchResult$),
      searchResult$: searchResult$
    };

    TestBed.configureTestingModule({
      imports: [        
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatIconModule
      ],
      declarations: [ ListRecipesComponent ],
      providers: [
        { 
          provide: SearchRecipeServiceService, 
          useValue: searchRecipeService
        }
      ],
    
    });
    
    fixture = TestBed.createComponent(ListRecipesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#selectRecipe should set selectedRecipe to the passed id', () => {
    component.selectRecipe(2);
    expect(component.selectedRecipe).toEqual(2);
  });
  
  it('should subscribe to searchRecipeService.searchResult$', fakeAsync(() =>  {
    const subscribeSpy = spyOn(searchResult$, 'subscribe');

    // Call the updateResults method
    component.updateResults();

    // Call tick to simulate the passage of time until all pending asynchronous activities finish
    tick();

    // Assert that subscribe was called on searchResult$
    expect(subscribeSpy).toHaveBeenCalled();
  }));
  
  it('should unsubscribe from searchResult$ when destroyed', () => {
    // Spy on the unsubscribe method from searchResult$
    const subSpy = spyOn(component.sub, 'unsubscribe');

    // Call the ngOnDestroy method
    component.ngOnDestroy();

    // Assert that unsubscribe was called
    expect(subSpy).toHaveBeenCalled();
  });
});
