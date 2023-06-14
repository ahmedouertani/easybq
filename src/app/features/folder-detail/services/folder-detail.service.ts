import { HttpClient, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../services/profile.service';
import { environment } from '../../../../environments/environment';
import { getAuth } from '@angular/fire/auth';

@Injectable()
export class FolderDetailService {
  private readonly profileService = inject(ProfileService);
  private readonly http = inject(HttpClient);
  private httpClient: HttpClient;
  fileSizeUnit: number = 1024;

  private initializeHttpClient() {
    // Create an instance of HttpXhrBackend
    const backend = new HttpXhrBackend({ build: () => new XMLHttpRequest() });

    // Initialize the httpClient using the backend
    this.httpClient = new HttpClient(backend);
  }

  public uploadFile(
    folderId,
    uploadedFile: FormData,
    tableId?
  ): Observable<any> {
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
    };

    // Remove the "Content-Type" header from the headers
    httpOptions.headers.delete('Content-Type');

    // Make the POST request using the initialized httpClient

    return this.httpClient.post(
      `${environment.apiUrl}/upload_table_file/${domaineId}/` + folderId,
      uploadedFile,
      httpOptions
    );
  }

  public fetchTables(folderId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/get_tables/${this.profileService.profile.idDomaine}/${folderId}`
    );
  }

  public fetchFiles(folderId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/get_files/${this.profileService.profile.idDomaine}/${folderId}`
    );
  }

  public createTable(folderId: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/create_table/${this.profileService.profile.idDomaine}/${folderId}`,
      data
    );
  }
  public fetchFolderById(folderId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/get_folder_by_id/${this.profileService.profile.idDomaine}/${folderId}`
    );
  }
  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }
    return fileSize;
  }
  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }

  public deleteTable(folderId: string , tableId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/delete_table/${this.profileService.profile.idDomaine}/${folderId}/${tableId}`
    );
  }
  public deleteTableByName(folderId: string , tabName: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/delete_table_by_name/${this.profileService.profile.idDomaine}/${folderId}/${tabName}`
    );
  }
}
