import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripMakerComponent } from './trip-maker.component';

describe('TripMakerComponent', () => {
  let component: TripMakerComponent;
  let fixture: ComponentFixture<TripMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripMakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
