import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeappComponent } from "./homeapp/homeapp.component";
import { FooterMainappComponent } from "./footer-mainapp/footer-mainapp.component";
import { NavbarMainappComponent } from './navbar-mainapp/navbar-mainapp.component';

@Component({
  selector: 'app-mainapp-layout',
  imports: [NavbarMainappComponent, RouterModule, FooterMainappComponent],
  templateUrl: './mainapp-layout.component.html',
  styleUrl: './mainapp-layout.component.css'
})
export class MainappLayoutComponent {

}
