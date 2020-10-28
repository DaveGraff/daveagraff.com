import { NgModule } from '@angular/core';
import { 
  MatToolbarModule, 
  MatDividerModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [MatToolbarModule, MatDividerModule, MatProgressSpinnerModule, MatIconModule, MatInputModule],
  exports: [MatToolbarModule, MatDividerModule, MatProgressSpinnerModule, MatIconModule, MatInputModule]
})
export class MaterialsModule { }
