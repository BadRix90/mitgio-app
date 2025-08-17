import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-members-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="addMember()">Neues Mitglied anlegen</button>
    <p>{{ msg }}</p>
  `,
})
export class MembersTestComponent {
  private fs = inject(Firestore);
  msg = '';

  async addMember() {
    try {
      // feste orgId (die du eben in Firestore siehst)
      const orgId = 'mPmyfnuGt3zDIMiGcRUH'; 
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
