import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { 
  Firestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';
import { OrgStore } from '../../org-store.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-member.html',
  styleUrls: ['./add-member.scss']
})
export class AddMemberComponent {
  private fb = inject(FormBuilder);
  private fs = inject(Firestore);
  private orgStore = inject(OrgStore);
  private router = inject(Router);

  // Signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  // Form
  memberForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    birthDate: [''],
    status: ['active', [Validators.required]],
    startDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    membershipFee: [25, [Validators.min(0)]],
    notes: ['']
  });

  // Status options
  statusOptions = [
    { value: 'active', label: 'Aktiv' },
    { value: 'inactive', label: 'Inaktiv' },
    { value: 'pending', label: 'Wartend' }
  ];

  async onSubmit() {
    if (this.memberForm.invalid) return;

    const orgId = this.orgStore.selectedOrgId();
    if (!orgId) {
      this.errorMessage.set('Keine Organisation ausgewählt');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const formValue = this.memberForm.value;
      const memberData = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        email: formValue.email!,
        phone: formValue.phone || '',
        address: formValue.address || '',
        birthDate: formValue.birthDate ? new Date(formValue.birthDate) : null,
        status: formValue.status!,
        startDate: new Date(formValue.startDate!),
        membershipFee: formValue.membershipFee || 25,
        notes: formValue.notes || '',
        createdAt: serverTimestamp()
      };

      const membersRef = collection(this.fs, `orgs/${orgId}/members`);
      await addDoc(membersRef, memberData);

      // Navigate back to members list
      this.router.navigate(['/members']);
      
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Fehler beim Speichern');
    } finally {
      this.isLoading.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/members']);
  }
}