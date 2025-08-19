import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { DashboardDataService } from '../../dashboard/dashboard-data';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './members-list.html',
  styleUrls: ['./members-list.scss']
})
export class MembersListComponent {
  private dashboardData = inject(DashboardDataService);
  private router = inject(Router);

  // Data from service
  readonly members = this.dashboardData.members;
  readonly stats = this.dashboardData.stats;

  // Actions
  addMember() {
    console.log('Navigate to add member');
    this.router.navigate(['/members/add']);
  }

  editMember(member: any) {
    console.log('Edit member:', member);
    // TODO: Navigate to edit member page
  }

  deleteMember(member: any) {
    console.log('Delete member:', member);
    // TODO: Implement delete functionality
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}