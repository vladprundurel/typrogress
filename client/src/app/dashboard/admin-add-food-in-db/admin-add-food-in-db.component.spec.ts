import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddFoodInDbComponent } from './admin-add-food-in-db.component';

describe('AdminAddFoodInDbComponent', () => {
  let component: AdminAddFoodInDbComponent;
  let fixture: ComponentFixture<AdminAddFoodInDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddFoodInDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddFoodInDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
