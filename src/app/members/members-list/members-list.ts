import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  // Get members from dashboard service
  readonly members = this.dashboardData.members;

  // Simple methods for now
  addMember() {
    console.log('Add member clicked');
  }

  editMember(member: any) {
    console.log('Edit member:', member);
  }

  deleteMember(member: any) {
    console.log('Delete member:', member);
  }
}