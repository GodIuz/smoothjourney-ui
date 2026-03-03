import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { PhotoService } from '../../services/photo.service';
import { AdminService } from '../../services/admin-service.service';

@Component({
  selector: 'app-edit-business',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-business.component.html',
  styleUrl: './edit-business.component.css',
})
export class EditBusinessComponent implements OnInit {
  form: FormGroup;
  businessId: number = 0;
  previewUrl: string | null = null;
  apiUrl = 'https://localhost:7000';

  categories = ['Επιχείρηση', 'Αξιοθέατο'];

  typesMap: any = {
    Επιχείρηση: [
      'Ξενοδοχείo',
      'Ενοικιαζόμενα Δωμάτια-Διαμερίσματα',
      'Τουριστικές Κατοικίες',
      'Τουριστικά Γραφεία',
      'Διοργανωτές Περιηγήσεων',
      'Γραφεία Ενοικίασης Οχημάτων',
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.businessId = +idParam;
      this.loadBusinessData(this.businessId);
    } else {
      this.router.navigate(['/admin/businesses']);
    }

    this.form.get('category')?.valueChanges.subscribe((cat) => {
      this.availableTypes = this.typesMap[cat] || [];
      const currentType = this.form.get('categoryType')?.value;
      if (currentType && !this.availableTypes.includes(currentType)) {
        this.form.get('categoryType')?.setValue('');
      }
    });
  }

  loadBusinessData(id: number) {
    this.businessService.getById(id).subscribe({
      next: (data: any) => {
        console.log('📦 Data loaded:', data);

        if (data.category) {
          this.availableTypes = this.typesMap[data.category] || [];
        }

        const formData = {
          ...data,
          imageUrl: data.imageUrl || data.ImageUrl || data.coverPhoto || '',
          categoryType: data.categoryType || data.CategoryType,
          country: data.country || data.Country,
          description: data.description || data.Description,
        };

        this.form.patchValue(formData, { emitEvent: false });

        if (formData.imageUrl) {
          this.previewUrl = this.getImageUrl(formData.imageUrl);
        }
      },
      error: (err) => console.error(err),
    });
  }

  getImageUrl(url: string | null): string {
    if (!url) return '/assets/images/placeholder.jpg';
    if (url.includes('assets/')) return url;
    return `${this.apiUrl}${url}`;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadPhoto(file).subscribe({
        next: (res) => {
          this.form.patchValue({ imageUrl: res.url });
          this.previewUrl = this.getImageUrl(res.url);
        },
        error: () => alert('Upload failed'),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = { businessId: this.businessId, ...this.form.value };
    dto.priceLevel = Number(dto.priceLevel);

    this.adminService.updateBusiness(this.businessId, dto).subscribe({
      next: () => {
        alert('Επιτυχία!');
        this.router.navigate(['/admin/businesses']);
      },
      error: (err) => {
        console.error(err);
        alert('Σφάλμα κατά την ενημέρωση. Ελέγξτε την κονσόλα.');
      },
    });
  }
}
