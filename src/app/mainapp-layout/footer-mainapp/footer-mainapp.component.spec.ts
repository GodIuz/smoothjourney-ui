import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMainappComponent } from './footer-mainapp.component';

describe('FooterMainappComponent', () => {
  let component: FooterMainappComponent;
  let fixture: ComponentFixture<FooterMainappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterMainappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMainappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
