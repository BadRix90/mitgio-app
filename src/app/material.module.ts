import { NgModule } from '@angular/core';

// Existing modules
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

// New modules for Login
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    // Existing
    MatButtonModule,
    MatListModule,
    
    // For Login & Forms
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class MaterialModule {}