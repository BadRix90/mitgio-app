import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../auth/auth.service';
import { OrgStore } from '../org-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private orgStore = inject(OrgStore);
  private router = inject(Router);

  // Current user and organization
  readonly currentUser = this.authService.currentUser;
  readonly userProfile = this.authService.userProfile;
  readonly selectedOrgId = this.orgStore.selectedOrgId;

  // Dashboard stats (mock data for now)
  readonly stats = signal({
    totalMembers: 45,
    activeMembers: 42,
    pendingPayments: 8,
    overduePayments: 3,
    totalRevenue: 2840,
    monthlyFees: 1850
  });

  // Welcome message
  readonly welcomeMessage = computed(() => {
    const user = this.userProfile();
    if (user) {
      return `Willkommen zurück, ${user.firstName}!`;
    }
    return 'Willkommen bei Mitgio!';
  });

  // Quick action methods
  addMember() {
    // TODO: Navigate to add member page
    console.log('Add member clicked');
  }

  viewMembers() {
    // TODO: Navigate to members list
    console.log('View members clicked');
  }

  managePayments() {
    // TODO: Navigate to payments page
    console.log('Manage payments clicked');
  }

  exportData() {
    // TODO: Export functionality
    console.log('Export data clicked');
  }

  sendReminders() {
    // TODO: Send payment reminders
    console.log('Send reminders clicked');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}