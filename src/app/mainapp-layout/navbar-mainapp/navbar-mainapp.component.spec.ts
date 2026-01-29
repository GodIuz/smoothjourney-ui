import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMainappComponent } from './navbar-mainapp.component';

describe('NavbarMainappComponent', () => {
  let component: NavbarMainappComponent;
  let fixture: ComponentFixture<NavbarMainappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarMainappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarMainappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
