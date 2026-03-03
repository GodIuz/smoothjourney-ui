import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { PhotoService } from '../../services/photo.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AdminService } from '../../services/admin-service.service';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class CreateBusinessComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  businessId: number | null = null;
  previewUrl: string | null = null;
  businesses: any[] = [];

  categories = ['Επιχείρηση', 'Αξιοθέατο'];

  typesMap: any = {
    Επιχείρηση: [
      'Ξενοδοχείo',
      'Ενοικιαζόμενα Δωμάτια-Διαμερίσματα',
      'Τουριστικές Κατοικίες',
      'Τουριστικά Γραφεία',
      'Διοργανωτές Περιηγήσεων',
      'Γραφεία Ενοικίασης Οχημάτων',
      'Εστιατόριο',
      'Ταβέρνα',
      'Μπερκεράδικο',
      'Καφετέρια',
      'Μπαρ',
      'Κέντρα Διασκέδασης',
      'Ταξί',
      'Τουριστικά Λεωφορεία',
      'Κρουαζιέρες',
      'Ενοικιάσεις Σκαφών',
      'Αεροπορικές Εταιρείες',
      'Τουριστικά Είδη',
      'Τοπικά Προϊόντα',
      'Σουβενίρ',
    ],
    Αξιοθέατο: [
      'Αρχαία Mνημεία',
      'Kάστρα',
      'Παλάτια',
      'Ιστορικές Τοποθεσίες',
      'Πολιτιστικό κέντρο',
      'Αγάλματα',
      'Μνημεία',
      'Εκκλησίες',
      'Καθεδρικοί Ναοί',
      'Μοναστήρια',
      'Ιεροί Χώροι',
      'Παραλίες',
      'Εθνικά πάρκα',
      'Δάση',
      'Λίμνες',
      'Λιμάνια',
      'Σπήλαια',
      'Λόφοι',
      'Μουσεία',
      'Πινακοθήκες',
      'Βιβλιοθήκες',
      'Θέατρα',
      'Πλατείες',
      'Γέφυρες',
      'Ουρανοξύστες',
      'Πύργοι Παρατήρησης',
      'Γραφικές Γειτονιές',
      'Φάροι',
      'Πάρκα Αναψυχής',
      'Ζωολογικοί Κήποι',
      'Ενυδρεία',
      'Εμπορικά Κέντρα',
      'Selfie Museums',
      'Χώροι Ευεξίας (Spa)',
    ],
  };

  availableTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private businessService: BusinessService,
    private photoService: PhotoService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      categoryType: ['', Validators.required],
      moodTags: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      priceRange: ['Moderate', Validators.required],
      priceLevel: [2, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      isHiddenGem: [false],
      isSuspectedScam: [false],

      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.form.get('category')?.valueChanges.subscribe((selectedCategory) => {
      this.availableTypes = this.typesMap[selectedCategory] || [];
      const currentType = this.form.get('categoryType')?.value;
      if (!this.availableTypes.includes(currentType)) {
        this.form.get('categoryType')?.setValue('');
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.businessId = +idParam;
      this.isEditMode = true;

      this.businessService.getById(this.businessId).subscribe({
        next: (data) => {
          if (data.category) {
            this.availableTypes = this.typesMap[data.category] || [];
          }

          this.form.patchValue(data);

          if (data.imageUrl) {
            this.previewUrl = 'https://localhost:7000' + data.imageUrl;
          }
        },
        error: (err) => {
          console.error('❌ Το ID δεν βρέθηκε:', err);
          this.router.navigate(['/admin/businesses']);
        },
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadPhoto(file).subscribe({
        next: (res) => {
          this.form.patchValue({ imageUrl: res.url });
          this.previewUrl = 'https://localhost:7000' + res.url;
        },
        error: (err) => alert('Το ανέβασμα απέτυχε!'),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία (κοκκινισμένα).');
      return;
    }

    const dto = this.form.value;
    dto.priceLevel = Number(dto.priceLevel);

    if (this.isEditMode && this.businessId) {
      this.adminService.updateBusiness(this.businessId, dto).subscribe(() => {
        this.router.navigate(['/admin/businesses']);
      });
    } else {
      this.businessService.createBusiness(dto).subscribe(() => {
        this.router.navigate(['/admin/businesses']);
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Είστε σίγουρος για τη διαγραφή;')) {
      this.businessService.deleteBusiness(id).subscribe(() => {
        this.businesses = this.businesses.filter((b) => b.businessId !== id);
      });
    }
  }
}
