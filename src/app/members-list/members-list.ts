import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { OrgStore } from '../org-store.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <h3>Mitgliederübersicht</h3>
    <p *ngIf="!(store.selectedOrgId()); else list">Bitte erst eine Organisation wählen.</p>

    <ng-template #list>
      <ul>
        <li *ngFor="let m of members$ | async">
          {{ m.firstName || '' }} {{ m.lastName || '' }}
          <span *ngIf="m.name && !m.firstName">{{ m.name }}</span>
          <span *ngIf="m.email"> ({{ m.email }})</span>
        </li>
      </ul>
    </ng-template>
  `,
})
export class MembersListComponent {
  private fs = inject(Firestore);
  readonly store = inject(OrgStore);

  private selectedOrgId$ = toObservable(this.store.selectedOrgId);

  members$: Observable<any[]> = this.selectedOrgId$.pipe(
    switchMap(orgId => {
      if (!orgId) return of([]);
      const ref = collection(this.fs, `orgs/${orgId}/members`);
      // bewusst ohne orderBy für weniger Reibung am Anfang
      return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
    })
  );
}
