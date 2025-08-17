import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-test-db',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="addItem()">Add Test Item</button>
    <p>{{ msg }}</p>
  `,
})
export class TestDbComponent {
  private fs = inject(Firestore);
  msg = '';

  async addItem() {
    try {
      await addDoc(collection(this.fs, 'testCollection'), {
        name: 'Test Mitglied',
        at: serverTimestamp(),
      });
      this.msg = '✅ Eintrag gespeichert';
    } catch (e: any) {
      this.msg = `❌ ${e?.message || e}`;
    }
  }
}
