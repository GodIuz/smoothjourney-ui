import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTripPlannerComponent } from './ai-trip-planner.component';

describe('AiTripPlannerComponent', () => {
  let component: AiTripPlannerComponent;
  let fixture: ComponentFixture<AiTripPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTripPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTripPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
