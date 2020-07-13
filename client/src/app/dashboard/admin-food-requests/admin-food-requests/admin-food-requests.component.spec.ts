import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFoodRequestsComponent } from './admin-food-requests.component';

describe('AdminFoodRequestsComponent', () => {
  let component: AdminFoodRequestsComponent;
  let fixture: ComponentFixture<AdminFoodRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFoodRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFoodRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
