import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealsComponent } from './add-meals.component';

describe('AddMealsComponent', () => {
  let component: AddMealsComponent;
  let fixture: ComponentFixture<AddMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
