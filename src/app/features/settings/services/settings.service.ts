import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpXhrBackend,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../services/profile.service';
import { environment } from '../../../../environments/environment';
import { getAuth } from '@angular/fire/auth';

@Injectable()
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly profile = inject(ProfileService);
  private httpClient: HttpClient;

  private initializeHttpClient() {
    // Create an instance of HttpXhrBackend
    const backend = new HttpXhrBackend({ build: () => new XMLHttpRequest() });

    // Initialize the httpClient using the backend
    this.httpClient = new HttpClient(backend);
  }

  public uploadServiceAccount(data: FormData): Observable<any> {
    if (!this.httpClient) {
      // If httpClient is not initialized, call the initializeHttpClient() method
      this.initializeHttpClient();
    }

    // Get the domaineId and accessToken
    const domaineId = this.profile.profile.idDomaine;
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
      `${environment.apiUrl}/upload_account_service/${domaineId}/`,
      data,
      httpOptions
    );
  }
}
