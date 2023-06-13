import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ProfileService } from "../../../services/profile.service";
import { environment } from "../../../../environments/environment";

@Injectable()
export class FolderDetailService {
  private readonly profileService = inject(ProfileService);
  private readonly http = inject(HttpClient);



  public fetchTables(folderId: string): Observable<any> {
    return this.http
      .get(
        `${environment.apiUrl}/get_tables/${this.profileService.profile.idDomaine}/${folderId}`
      );
  }

  public fetchFiles(folderId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get_files/${this.profileService.profile.idDomaine}/${folderId}`);
  }

  public uploadFile(folderId: string, tableId: string, file: File): Observable<any> {
    const uploadedFile = new FormData();
    uploadedFile.append('file', file, file.name.replace(/\s/g, ""));
    uploadedFile.append('table_name', tableId);
    uploadedFile.append('skip_leading_rows', '0');
    uploadedFile.append('write_disposition', 'WRITE_EMPTY');
    uploadedFile.append('field_delimiter', ',');

    return this.uploadFormFile(
      uploadedFile,
      `${environment.apiUrl}/upload_file/${this.profileService.profile.idDomaine}/${folderId}/${tableId}`,
    );
  }

  public uploadTableFile(folderId: string, tableId: string, file: File): Observable<any> {
    const uploadedFile = new FormData();
    uploadedFile.append('file', file, file.name.replace(/\s/g, ""));
    uploadedFile.append('table_name', tableId);
    uploadedFile.append('skip_leading_rows', '0');
    uploadedFile.append('write_disposition', 'WRITE_EMPTY');
    uploadedFile.append('field_delimiter', ',');

    return this.uploadFormFile(
      uploadedFile,
      `${environment.apiUrl}/upload_table_file/${this.profileService.profile.idDomaine}/${folderId}/${tableId}`,
    );
  }

  private uploadFormFile(formData: FormData, to: string): Observable<any> {
    return this.http.post(to, formData)
  }

  public createTable(folderId: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/create_table/${this.profileService.profile.idDomaine}/${folderId}`,
      data
    );
  }
}
