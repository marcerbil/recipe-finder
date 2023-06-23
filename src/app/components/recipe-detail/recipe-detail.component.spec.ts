import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchRecipeServiceService } from 'src/app/search-recipe-service.service';
import { RecipeDetailComponent } from './recipe-detail.component';
import { of, throwError } from 'rxjs';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let searchRecipeService: SearchRecipeServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeDetailComponent ],
      providers: [ SearchRecipeServiceService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    searchRecipeService = TestBed.inject(SearchRecipeServiceService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch recipes on init', () => {
    spyOn(searchRecipeService, 'getRecipes').and.returnValue(of([]));
    component.ngOnInit();
    expect(searchRecipeService.getRecipes).toHaveBeenCalled();
  });

  it('should handle error when fetching recipes', () => {
    const errorResponse = new ErrorEvent('Service error', {
      message: 'Service is down',
    });
    spyOn(console, 'error');
    spyOn(searchRecipeService, 'getRecipes').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalled();
  });
});
