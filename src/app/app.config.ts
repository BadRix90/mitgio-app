import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { TestDbComponent } from './test-db.component'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TestDbComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  private fs = inject(Firestore);
  pingMessage = '';

  async ping() {
    try {
      const ref = collection(this.fs, 'dev-pings');
      const doc = await addDoc(ref, { at: serverTimestamp(), note: 'hello from mitgio' });
      this.pingMessage = `OK: ${doc.id}`;
    } catch (e: any) {
      this.pingMessage = `Fehler: ${e?.message || e}`;
    }
  }
}
