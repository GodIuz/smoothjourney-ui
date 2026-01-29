import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component {
constructor(private location: Location) {}

  goBack() {
    this.location.back(); 
  }
}
