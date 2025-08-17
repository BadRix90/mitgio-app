import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, orderBy, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Member {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  startDate?: Date;
  createdAt?: any;
}

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="members-container">
      <h3>Mitgliederübersicht</h3>
      
      <div *ngIf="loading" class="loading">
        <p>Lade Mitglieder...</p>
      </div>

      <div *ngIf="error" class="error">
        <p>Fehler beim Laden der Mitglieder: {{ error }}</p>
        <button (click)="retry()">Erneut versuchen</button>
      </div>

      <div *ngIf="!loading && !error">
        <div *ngIf="members.length > 0; else noMembers">
          <p>{{ members.length }} Mitglied(er) gefunden:</p>
          <ul class="members-list">
            <li *ngFor="let m of members; trackBy: trackByFn" class="member-item">
              <strong>{{ getDisplayName(m) }}</strong>
              <span *ngIf="m.email" class="email">({{ m.email }})</span>
            </li>
          </ul>
        </div>
        <ng-template #noMembers>
          <p class="no-members">Noch keine Mitglieder vorhanden.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .members-container {
      padding: 20px;
      max-width: 600px;
    }
    
    .members-list {
      list-style: none;
      padding: 0;
    }
    
    .member-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .email {
      color: #666;
      font-size: 0.9em;
    }
    
    .loading, .error, .no-members {
      text-align: center;
      padding: 20px;
    }
    
    .error {
      color: #d32f2f;
    }
    
    button {
      background: #1976d2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background: #1565c0;
    }
  `]
})
export class MembersListComponent implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private orgId = 'mPmyfnuGt3zDIMiGcRUH'; // später dynamisch
  private subscription?: Subscription;

  members: Member[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadMembers();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadMembers() {
    try {
      this.loading = true;
      this.error = null;

      const membersRef = collection(this.firestore, `orgs/${this.orgId}/members`);
      const membersQuery = query(membersRef, orderBy('lastName'));
      const members$ = collectionData(membersQuery, { idField: 'id' }) as Observable<Member[]>;

      this.subscription = members$.pipe(
        tap(() => this.loading = false),
        catchError(err => {
          console.error('Fehler beim Laden der Mitglieder:', err);
          this.loading = false;
          this.error = err.message || 'Unbekannter Fehler';
          return of([]);
        })
      ).subscribe({
        next: (members) => {
          this.members = members;
          console.log('Mitglieder geladen:', members);
        },
        error: (err) => {
          console.error('Subscription Error:', err);
          this.error = err.message;
          this.loading = false;
        }
      });

    } catch (err: any) {
      console.error('Initialisierungsfehler:', err);
      this.loading = false;
      this.error = err.message || 'Fehler bei der Initialisierung';
    }
  }

  getDisplayName(member: Member): string {
    if (member.firstName || member.lastName) {
      return `${member.firstName || ''} ${member.lastName || ''}`.trim();
    }
    return member.name || 'Unbekanntes Mitglied';
  }

  trackByFn(index: number, item: Member): string {
    return item.id || index.toString();
  }

  retry() {
    this.subscription?.unsubscribe();
    this.loadMembers();
  }
}