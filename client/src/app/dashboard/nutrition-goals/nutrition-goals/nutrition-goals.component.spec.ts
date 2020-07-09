import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionGoalsComponent } from './nutrition-goals.component';

describe('NutritionGoalsComponent', () => {
  let component: NutritionGoalsComponent;
  let fixture: ComponentFixture<NutritionGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritionGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
