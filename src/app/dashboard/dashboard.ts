import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../auth/auth.service';
import { OrgStore } from '../org-store.service';
import { DashboardDataService } from './dashboard-data';

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
  private dashboardData = inject(DashboardDataService);
  private router = inject(Router);

  // Current user and organization
  readonly currentUser = this.authService.currentUser;
  readonly userProfile = this.authService.userProfile;
  readonly selectedOrgId = this.orgStore.selectedOrgId;

  // Real data from service
  readonly stats = this.dashboardData.stats;
  readonly recentActivities = this.dashboardData.recentActivities;
  readonly members = this.dashboardData.members;

  // Welcome message
  readonly welcomeMessage = computed(() => {
    const user = this.userProfile();
    if (user) {
      return `Willkommen zurück, ${user.firstName}!`;
    }
    return 'Willkommen bei Mitgio!';
  });

  // Organization info
  readonly organizationInfo = computed(() => {
    const user = this.userProfile();
    const memberCount = this.members().length;
    if (user && user.orgIds.length > 0) {
      return `${memberCount} Mitglieder`;
    }
    return '';
  });

  // Quick action methods
  addMember() {
    console.log('Add member clicked'); // DEBUG
    this.router.navigate(['/members']);
  }

  viewMembers() {
    console.log('View members clicked'); // DEBUG  
    this.router.navigate(['/members']);
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

  refreshData() {
    this.dashboardData.refreshData();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}