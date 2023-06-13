import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Folder } from "../models/folders.model";
import { ProfileService } from "../../../services/profile.service";

@Injectable()
export class FoldersService {
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);

  public fetchFolders(): Observable<Folder[]> {
    return this.http
      .get<Folder[]>(`${environment.apiUrl}/list_folders/${this.profileService.profile.idDomaine}`);
  }

  public createFolder(name: string): Observable<void> {
    const folder: Folder = { name, id: '', user_id: '', created_on: '' };
    return this.http
      .post<void>(`${environment.apiUrl}/create_folder/${this.profileService.profile.idDomaine}`, folder);
  }

  public deleteFolder(folderId: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/delete_folder/${this.profileService.profile.idDomaine}/${folderId}`);
  }

  public updateFolder(folderId: string, data: string): Observable<void> {
    return this.http
      .put<void>(
        `${environment.apiUrl}/update_folder/${this.profileService.profile.idDomaine}/${folderId}`,
        data
      );
  }
}
