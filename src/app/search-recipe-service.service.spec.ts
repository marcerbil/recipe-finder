import { TestBed } from '@angular/core/testing';

import { SearchRecipeServiceService } from './search-recipe-service.service';

describe('SearchRecipeServiceService', () => {
  let service: SearchRecipeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchRecipeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
