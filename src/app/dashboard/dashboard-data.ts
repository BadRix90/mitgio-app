import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  query, 
  where,
  orderBy,
  limit
} from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { OrgStore } from '../org-store.service';

// Interfaces
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  startDate: Date;
  createdAt: any;
  membershipFee?: number;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  lastPayment?: Date;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'paid' | 'pending' | 'overdue';
  type: 'membership' | 'fee' | 'donation';
  createdAt: any;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingPayments: number;
  overduePayments: number;
  totalRevenue: number;
  monthlyFees: number;
}

export interface Activity {
  type: 'member_added' | 'payment_received' | 'reminder_sent';
  description: string;
  timestamp: Date;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private fs = inject(Firestore);
  private orgStore = inject(OrgStore);

  private selectedOrgId$ = toObservable(this.orgStore.selectedOrgId);

  // Members data
  readonly members$ = this.selectedOrgId$.pipe(
    switchMap(orgId => {
      if (!orgId) return of([]);
      const membersRef = collection(this.fs, `orgs/${orgId}/members`);
      return collectionData(membersRef, { idField: 'id' }) as Observable<Member[]>;
    }),
    startWith([])
  );

  readonly members = toSignal(this.members$, { initialValue: [] });

  // Payments data (simulated for now - would be real collection)
  readonly payments$ = this.selectedOrgId$.pipe(
    switchMap(orgId => {
      if (!orgId) return of([]);
      // For now, we'll simulate payments based on members
      return this.members$.pipe(
        map(members => this.generateMockPayments(members))
      );
    }),
    startWith([])
  );

  readonly payments = toSignal(this.payments$, { initialValue: [] });

  // Dashboard statistics
  readonly stats = computed<DashboardStats>(() => {
    const members = this.members();
    const payments = this.payments();
    
    const activeMembers = members.filter(m => m.status === 'active').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    
    const totalRevenue = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyFees = payments
      .filter(p => {
        if (!p.paidDate) return false;
        const paymentDate = new Date(p.paidDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               p.status === 'paid';
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalMembers: members.length,
      activeMembers,
      pendingPayments,
      overduePayments,
      totalRevenue,
      monthlyFees
    };
  });

  // Recent activities
  readonly recentActivities$ = combineLatest([
    this.members$,
    this.payments$
  ]).pipe(
    map(([members, payments]) => {
      const activities: Activity[] = [];
      
      // Recent new members
      const recentMembers = members
        .filter(m => m.createdAt)
        .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
        .slice(0, 3);
      
      recentMembers.forEach(member => {
        activities.push({
          type: 'member_added',
          description: `${member.firstName} ${member.lastName} wurde hinzugefügt`,
          timestamp: member.createdAt.toDate(),
          icon: 'person_add'
        });
      });

      // Recent payments
      const recentPayments = payments
        .filter(p => p.paidDate && p.status === 'paid')
        .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
        .slice(0, 2);

      recentPayments.forEach(payment => {
        const member = members.find(m => m.id === payment.memberId);
        if (member) {
          activities.push({
            type: 'payment_received',
            description: `Beitrag von ${member.firstName} ${member.lastName} eingegangen`,
            timestamp: new Date(payment.paidDate!),
            icon: 'payment'
          });
        }
      });

      // Sort by timestamp and return latest 5
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);
    }),
    startWith([] as Activity[])
  );

  readonly recentActivities = toSignal(this.recentActivities$, { initialValue: [] as Activity[] });

  // Helper method to generate mock payments (would be replaced with real payments collection)
  private generateMockPayments(members: Member[]): Payment[] {
    const payments: Payment[] = [];
    const now = new Date();
    
    members.forEach((member, index) => {
      // Generate some payment history for each member
      const membershipFee = 25; // Default membership fee
      
      // Last month's payment
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const wasLastMonthPaid = Math.random() > 0.3; // 70% paid last month
      
      payments.push({
        id: `payment_${member.id}_${lastMonth.getTime()}`,
        memberId: member.id,
        amount: membershipFee,
        dueDate: lastMonth,
        paidDate: wasLastMonthPaid ? new Date(lastMonth.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
        status: wasLastMonthPaid ? 'paid' : 'overdue',
        type: 'membership',
        createdAt: lastMonth
      });

      // Current month's payment
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const isThisMonthPaid = Math.random() > 0.6; // 40% paid this month
      
      payments.push({
        id: `payment_${member.id}_${thisMonth.getTime()}`,
        memberId: member.id,
        amount: membershipFee,
        dueDate: thisMonth,
        paidDate: isThisMonthPaid ? new Date(thisMonth.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000) : undefined,
        status: isThisMonthPaid ? 'paid' : 'pending',
        type: 'membership',
        createdAt: thisMonth
      });
    });
    
    return payments;
  }

  // Method to refresh data
  refreshData() {
    // In a real app, this might trigger data refetch
    console.log('Refreshing dashboard data...');
  }
}