import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FolderDetailService } from '../../services/folder-detail.service';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { handleResponseErrorWithAlerts, handleResponseSuccessWithAlerts } from 'src/app/common/alerts.utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  imports: [
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    TranslocoModule,
    MatProgressSpinnerModule,

  ],
  providers: [FolderDetailService],
})
export class UploadFileComponent implements OnInit {
  private readonly bottomSheet = inject(MatBottomSheetRef<UploadFileComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(FolderDetailService);
  private readonly transloco = inject(TranslocoService);
  public formGroup: FormGroup;
  public dataFile: any;
  public file: File;
  percentDone: number | null;
  FileProgessSize: string | undefined;
  fileSize: string;
  fileSizeInWords: string;
  size: number;
  folderID: string;
  loader: boolean = false;
  private httpClient: HttpClient;
  private readonly profileService = inject(ProfileService);
  private _folderId: any = inject(MAT_BOTTOM_SHEET_DATA);
  fieldDelimiter: string;

  public ngOnInit(): void {
    this.folderID = this._folderId.folderId;
    this.formGroup = this.formBuilder.group({
      table_name: ['', [Validators.required]],
      skip_leading_rows: ['', [Validators.required]],
      field_delimiter: ['', [Validators.required]],
      write_disposition: [''],
      custom_field_delimiter: ['']
    }, { validator: this.customFieldValidator });

  }

  public close(): void {
    this.bottomSheet.dismiss();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) as File;
    if (file) {
      this.file = file;
      //get size file
      this.size = this.service.getFileSize(this.file.size);
      //file size wuth unit
      this.fileSize =
        this.service.getFileSize(this.file.size) +
        ' ' +
        this.service.getFileSizeUnit(this.file.size);
      //get unit
      this.fileSizeInWords = this.service.getFileSizeUnit(this.file.size);
    }
  }

  private initializeHttpClient() {
    // Create an instance of HttpXhrBackend
    const backend = new HttpXhrBackend({ build: () => new XMLHttpRequest() });

    // Initialize the httpClient using the backend
    this.httpClient = new HttpClient(backend);
  }

  // Custom validator function
  private customFieldValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const fieldDelimiter = control.get('field_delimiter')?.value;
    const customFieldDelimiter = control.get('custom_field_delimiter')?.value;

    if (fieldDelimiter === 'perso' && !customFieldDelimiter) {
      return { required: true };
    }

    return null;
  };

  public uploadFile(): void {
    const file = this.file; // Store the file in a separate variable for readability
    const formValue = this.formGroup.value; // Get the form value
    if (formValue.field_delimiter === 'perso') {
      formValue.field_delimiter = formValue.custom_field_delimiter
    }
    const size = this.size;
    const fileSizeInWords = this.fileSizeInWords;

    if (!file || !formValue) {
      return;
    }

    const uploadedFile = new FormData();
    uploadedFile.append('file', file, file.name.replace(/\s/g, '')); // Append file data to the form data
    uploadedFile.append('skip_leading_rows', formValue.skip_leading_rows); // Append other form data
    uploadedFile.append('table_name', formValue.table_name);
    uploadedFile.append('write_disposition', 'WRITE_EMPTY');
    uploadedFile.append('field_delimiter', formValue.field_delimiter);

    if (!this.httpClient) {
      // If httpClient is not initialized, call the initializeHttpClient() method
      this.initializeHttpClient();
    }

    // Get the domaineId and accessToken
    const domaineId = this.profileService.profile.idDomaine;
    let token: any = getAuth().currentUser;
    let accessToken = token.accessToken;

    // Set the headers with the authorization token
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
      reportProgress: true,
    };

    // Remove the "Content-Type" header from the headers
    httpOptions.headers.delete('Content-Type');

    // Make the POST request using the initialized httpClient
    this.httpClient
      .post(
        `${environment.apiUrl}/upload_table_file/${domaineId}/` + this.folderID,
        uploadedFile,
        {
          ...httpOptions,
          observe: 'events',
        }
      ).pipe(
        catchError(err => {
          return of({ error: err });

        })
      )
      .subscribe((event: any) => {

        this.loader = true;

        if (event.type == HttpEventType.UploadProgress) {
          //calcul percent
          let percent: any = Math.round((100 / event.total) * event.loaded);
          //percent with size
          let completedPercentage = parseFloat(percent);
          this.FileProgessSize = `${((size * completedPercentage) / 100).toFixed(2)} ${fileSizeInWords}`;
          this.percentDone = completedPercentage;
        } else if (event.type == HttpEventType.Response) {
          this.percentDone = null;
          this.loader = false;
          if (this.percentDone == null) {
            handleResponseSuccessWithAlerts(
              this.transloco.translate('features.folder-detail.success.title'),
              this.transloco.translate('features.folder-detail.success.message'),
              this.transloco.translate('common.close')
            );
            this.bottomSheet.dismiss(true);
          }
        }

        const errorStatus = event.error?.status;
        if (errorStatus === 0 || errorStatus === 400) {
          handleResponseErrorWithAlerts(
            this.transloco.translate('features.folder-detail.error.title'),
            this.transloco.translate('features.folder-detail.error.message'),
            this.transloco.translate('common.close')
          );
          if (errorStatus === 400) {
            this.deleteTabByName(formValue.table_name);
          }
          this.bottomSheet.dismiss(true);
        }
      });
  }

  get folderId(): any {
    return this._folderId;
  }

  set folderId(value: any) {
    this._folderId = value;
  }

  public deleteTabByName(tableName) {
console.log(tableName);

    this.service.deleteTableByName(this.folderID, tableName).subscribe((res) => {
      this.bottomSheet.dismiss(true);
    })
  }
}
