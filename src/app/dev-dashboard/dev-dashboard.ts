import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { TestDbComponent } from "../test-db.component";
import { OrgTestComponent } from '../org-test/org-test';
import { MembersTestComponent } from '../members-test/members-test';
import { MembersListComponent } from '../members-list/members-list';
import { OrgListComponent } from '../org-list/org-list';

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TestDbComponent, 
    OrgTestComponent, 
    MembersTestComponent, 
    MembersListComponent,
    OrgListComponent
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