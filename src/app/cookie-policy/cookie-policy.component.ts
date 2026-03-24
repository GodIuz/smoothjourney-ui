import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiePolicyComponent {}
