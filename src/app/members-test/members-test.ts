import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { OrgStore } from '../org-store.service';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-members-test',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <button (click)="addMember()" [disabled]="!orgId">Neues Mitglied anlegen</button>
    <p *ngIf="!orgId">Bitte erst eine Organisation wählen.</p>
    <p>{{ msg }}</p>
  `,
})
export class MembersTestComponent {
  private fs = inject(Firestore);
  private store = inject(OrgStore);

  get orgId() { return this.store.selectedOrgId(); }

  msg = '';

  async addMember() {
    const orgId = this.orgId;
    if (!orgId) { this.msg = '❌ Keine Organisation gewählt.'; return; }

    try {
      const ref = collection(this.fs, `orgs/${orgId}/members`);
      const doc = await addDoc(ref, {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@verein.de',
        startDate: new Date(),
        createdAt: serverTimestamp()
      });
      this.msg = `✅ Mitglied gespeichert: ${doc.id}`;
    } catch (e: any) {
      this.msg = `❌ Fehler: ${e?.message || e}`;
    }
  }
}
