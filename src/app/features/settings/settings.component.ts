import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from './services/settings.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    SettingsService,
  ],
})
export class SettingsComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly service = inject(SettingsService);
  public file: File | undefined;

  public defaultLanguage = this.transloco.getActiveLang();

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) as File;
    this.file = file;
  }

  public submitFile(): void {
    const uploadedFile = new FormData();
    uploadedFile.append('file', this.file!, this.file!.name.replace(/\s/g, ""));
    this.service.uploadServiceAccount(uploadedFile).subscribe({
      next: (response) => {
        console.log(response);

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public onSelectionChange(change: MatSelectChange): void {
    const { value } = change;
    this.transloco.setActiveLang(value);

    localStorage.setItem('current_language', value);
  }
}
