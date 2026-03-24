import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Ιδρυτική Ομάδα',
      role: 'Visionaries & Engineers',
      description:
        'Δημιουργήσαμε το SmoothJourney με ένα όραμα: να κάνουμε την οργάνωση ταξιδιών έξυπνη, γρήγορη και προσωποποιημένη.',
      icon: 'fa-solid fa-lightbulb',
    },
    {
      name: 'Η Τεχνητή μας Νοημοσύνη',
      role: 'Ο Προσωπικός σας Ξεναγός',
      description:
        'Ο αλγόριθμός μας αναλύει χιλιάδες δεδομένα σε δευτερόλεπτα για να σας προτείνει τα καλύτερα μέρη ανάλογα με τη διάθεσή σας.',
      icon: 'fa-solid fa-microchip',
    },
  ];
}
