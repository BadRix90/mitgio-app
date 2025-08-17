import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-org-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="addOrg()">Neue Organisation anlegen</button>
    <p>{{ msg }}</p>
  `,
})
export class OrgTestComponent {
  private fs = inject(Firestore);
  msg = '';

  async addOrg() {
    try {
      const ref = collection(this.fs, 'orgs');
      const doc = await addDoc(ref, {
        name: 'Demo Verein',
        fiscalYearStartMonth: 8, // Beispiel: August als Startmonat
        createdAt: serverTimestamp()
      });
      this.msg = `✅ Org gespeichert: ${doc.id}`;
    } catch (e: any) {
      this.msg = `❌ Fehler: ${e?.message || e}`;
    }
  }
}
