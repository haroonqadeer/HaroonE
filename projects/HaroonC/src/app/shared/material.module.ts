import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  MatIconModule,
  MatRadioModule,
  MatBottomSheetModule,
  MatTabsModule,
  MatPaginatorModule,
  MatDialogModule,
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatSelectModule,
  MatButtonModule,
  MatSidenavModule,
  MatCardModule,
  MatMenuModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    MatSidenavModule,
    MatCardModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    MatSidenavModule,
    MatCardModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ]
})
export class MaterialModule {}
