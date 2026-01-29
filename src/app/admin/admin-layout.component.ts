import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from "./admin-navbar/admin-navbar.component";
import { AdminFooterComponent } from "./admin-footer/admin-footer.component";
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { BusinessesComponent } from "./businesses/businesses.component";

@Component({
  selector: 'app-admin-layout',
  standalone:true,
  imports: [RouterModule, AdminNavbarComponent, AdminSidebarComponent, AdminFooterComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
