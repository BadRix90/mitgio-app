import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrgStore } from './../org-store..service';

type Org = { id: string; name?: string; fiscalYearStartMonth?: number };

@Component({
  selector: 'app-org-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Organisation wählen</h3>
    <ul>
      <li *ngFor="let o of orgs$ | async">
        <button (click)="choose(o)">{{ o.name || o.id }}</button>
      </li>
    </ul>

    <p *ngIf="store.selectedOrgId()">
      Ausgewählt: <strong>{{ store.selectedOrgName() || store.selectedOrgId() }}</strong>
    </p>
  `,
})
export class OrgListComponent {
  private fs = inject(Firestore);
  readonly store = inject(OrgStore);

  orgs$: Observable<Org[]> = collectionData(
    collection(this.fs, 'orgs'), { idField: 'id' }
  ) as Observable<Org[]>;

  choose(o: Org) {
    this.store.select(o.id, o.name ?? null);
  }
}
