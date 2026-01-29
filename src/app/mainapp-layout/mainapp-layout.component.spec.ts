import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainappLayoutComponent } from './mainapp-layout.component';

describe('MainappLayoutComponent', () => {
  let component: MainappLayoutComponent;
  let fixture: ComponentFixture<MainappLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainappLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainappLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
