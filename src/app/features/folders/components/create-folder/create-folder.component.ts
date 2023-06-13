import { NgIf } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  standalone: true,
  selector: 'app-create-folder',
  template: `
    <mat-toolbar>
      <mat-toolbar-row>
        <span>
          {{ 'features.folders.add-dialog.title' | transloco }}
        </span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar-row>
    </mat-toolbar>

    <form class="create-folder-form" [formGroup]="formGroup" (ngSubmit)="createFolder()">
      <mat-form-field appearance="outline">
        <mat-label>{{ 'features.folders.add-dialog.title' | transloco }}</mat-label>
        <input matInput formControlName="name" />
        <mat-error *ngIf="formGroup.get('name')?.hasError('required')">
          {{ 'common.form.required' | transloco }}
        </mat-error>
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="!formGroup.valid">
        {{ 'features.folders.add-dialog.action' | transloco }}
      </button>
    </form>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    .create-folder-form {
      padding: 16px;
      display: flex;
      flex-direction: column;
    }
  `],
  imports: [
    NgIf,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class CreateFolderComponent implements OnInit {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateFolderComponent>);
  private readonly formBuilder = inject(FormBuilder);
  public formGroup: FormGroup;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  public close(): void {
    this.bottomSheetRef.dismiss();
  }

  public createFolder(): void {
    this.bottomSheetRef.dismiss(this.formGroup.value);
  }
}