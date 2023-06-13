import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ProfileService } from "../../../services/profile.service";
import { Profile } from "src/app/models/profile.model";


@Injectable()
export class UsersService {
  private readonly profileService = inject(ProfileService);
  private readonly http = inject(HttpClient);

  public fetchAll(): Observable<Profile[]> {
    return this.http
      .get<{ users: Profile[] }>(`${environment.apiUrl}/list_users/${this.profileService.profile.idDomaine}`)
      .pipe(map((data) => data.users))
  }

  public sendInvitation(user: Partial<Profile>): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/invite_user/${this.profileService.profile.idDomaine}`,
        user
      );
  }
  public deleteUser(userId: string): Observable<void> {
    return this.http
      .delete<void>(
        `${environment.apiUrl}/delete_user/${this.profileService.profile.idDomaine}/${userId}`
      );
  }

  public updateUser(userId: string, data: Profile): Observable<void> {
    return this.http
      .put<void>(
        `${environment.apiUrl}/update_user/${this.profileService.profile.idDomaine}/${userId}`,
        data
      );
  }
}
