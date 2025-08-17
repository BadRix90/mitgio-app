import { NgModule } from '@angular/core';

// Existing modules
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

// Auth & Forms modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

// Dashboard modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  exports: [
    // Existing
    MatButtonModule,
    MatListModule,
    
    // Auth & Forms
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    
    // Dashboard
    MatToolbarModule,
    MatMenuModule
  ]
})
export class MaterialModule {}