import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SettingsService } from './services/settings.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { handleResponseErrorWithAlerts, handleResponseSuccessWithAlerts } from 'src/app/common/alerts.utils';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { LoaderComponent } from 'src/app/components/loader.component';

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
    MatCardModule,
    NgIf,
    LoaderComponent

  ],
  providers: [
    SettingsService,
  ],
})
export class SettingsComponent implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly service = inject(SettingsService);
  private readonly router = inject(Router);
  public file: File | undefined;
  emailAS: string ;
  showInput : boolean | null = null ;
  showBtn : boolean = true ;

  public defaultLanguage = this.transloco.getActiveLang();

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) as File;
    this.file = file;
  }

  public ngOnInit(): void {
    this.getEmailAccountService();
  }

  public submitFile(): void {
    const uploadedFile = new FormData();
    uploadedFile.append('file', this.file!, this.file!.name.replace(/\s/g, ""));
    this.service.uploadServiceAccount(uploadedFile).subscribe({
      next: (response) => {
        handleResponseSuccessWithAlerts(
          this.transloco.translate('features.settings.success.title'),
          this.transloco.translate('features.settings.success.message'),
          this.transloco.translate('common.close'),
          () => this.router.navigate(['/folders']),
        );

      },
      error: (error) => {
        handleResponseErrorWithAlerts(
          this.transloco.translate('features.settings.error.title'),
          this.transloco.translate('features.settings.error.message'),
          this.transloco.translate('common.close')
        )
      },
    });
  }

  public onSelectionChange(change: MatSelectChange): void {
    const { value } = change;
    this.transloco.setActiveLang(value);

    localStorage.setItem('current_language', value);
  }

  public getEmailAccountService() {
    this.service.getEmailAS().subscribe((res) => {
      this.emailAS = res.client_email;
      this.showInput = !!res.client_email;
      this.showBtn = !res.client_email;
    });
  }

  public showUpload() {
    this.showBtn = !this.showBtn;
  }
}
