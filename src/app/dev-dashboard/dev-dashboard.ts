import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { TestDbComponent } from "../test-db.component";


@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TestDbComponent
  ],
  templateUrl: './dev-dashboard.html',
  styleUrls: ['./dev-dashboard.scss']
})
export class DevDashboardComponent {
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