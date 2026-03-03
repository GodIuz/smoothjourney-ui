import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { PhotoService } from '../../services/photo.service';
import { AdminService } from '../services.service';

@Component({
  selector: 'app-edit-business',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-business.component.html',
  styleUrl: './edit-business.component.css'
})
export class EditBusinessComponent implements OnInit {
  form: FormGroup;
  businessId: number = 0;
  previewUrl: string | null = null;
  categories = ['Επιχείρηση', 'Αξιοθέατο']
  typesMap: any = {
    'Επιχείρηση': ['Ξενοδοχείo', 'Ενοικιαζόμενα Δωμάτια', 'Εστιατόριο', 'Καφετέρια', 'Μπαρ', 'Κέντρα Διασκέδασης', 'Ταξί', 'Τουριστικά Γραφεία', 'Ενοικιάσεις Οχημάτων', 'Σουβενίρ'],
    'Αξιοθέατο': ['Μουσεία', 'Αρχαία Mνημεία', 'Παραλίες', 'Εκκλησίες', 'Πάρκα', 'Λίμνες', 'Σπήλαια', 'Θέατρα', 'Πλατείες']
  };
  
  availableTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService,
    private adminService: AdminService,
    private photoService: PhotoService
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
      imageUrl: ['']
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

    this.form.get('category')?.valueChanges.subscribe(cat => {
        this.availableTypes = this.typesMap[cat] || [];
        const currentType = this.form.get('categoryType')?.value;
        if (currentType && !this.availableTypes.includes(currentType)) {
             this.form.get('categoryType')?.setValue('');
        }
    });
  }

  loadBusinessData(id: number) {
    this.businessService.getById(id).subscribe({
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
        console.error('Σφάλμα φόρτωσης:', err);
        alert('Η επιχείρηση δεν βρέθηκε ή υπήρξε σφάλμα σύνδεσης.');
        this.router.navigate(['/admin/businesses']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadPhoto(file).subscribe({
        next: (res) => {
          this.form.patchValue({ imageUrl: res.url });
          this.previewUrl = 'https://localhost:7000' + res.url;
        },
        error: (err) => {
          console.error(err);
          alert('Το ανέβασμα της εικόνας απέτυχε!');
        }
      });
    }
  }

  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
        businessId: this.businessId,
        ...this.form.value
    };
    dto.priceLevel = Number(dto.priceLevel);
    this.adminService.updateBusiness(this.businessId, dto).subscribe({
      next: () => {
        alert('✅ Η ενημέρωση ολοκληρώθηκε!');
        this.router.navigate(['/admin/businesses']);
      },
      error: (err) => {
        console.error('Update Error:', err);
        alert('Κάτι πήγε στραβά με την ενημέρωση.');
      }
    });
  }
}