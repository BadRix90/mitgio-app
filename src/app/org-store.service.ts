import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrgStore {
  // aktuell ausgewählte Organisation
  readonly selectedOrgId = signal<string | null>(null);
  readonly selectedOrgName = signal<string | null>(null);

  select(id: string, name: string | null = null) {
    this.selectedOrgId.set(id);
    this.selectedOrgName.set(name);
  }

  clear() {
    this.selectedOrgId.set(null);
    this.selectedOrgName.set(null);
  }
}
