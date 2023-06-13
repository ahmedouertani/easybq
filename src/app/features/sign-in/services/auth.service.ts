import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/profile.model';
import { environment } from 'src/environments/environment';
import { getFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);
  public profile: Profile;
  public app = initializeApp(environment.firebaseConfig);
  public firestore = getFirestore(this.app);

  public async CheckUserExist(uid: string): Promise<boolean> {
    // Check if the user is an admin
    const queryResult = await this.profileService.checkAdmin(uid);

    // Check if the domain document exists
    const qr = await this.profileService.checkDomain();

    // Check if the 'admin_BQDS' or 'users' document exists
    const userExists = await this.profileService.checkUserSubCollection(uid);

    // Check if the domain document exists
    const hasDomain = qr.docs.length > 0;

    // Check if the user is an admin
    const isAdmin = queryResult.docs.length > 0;

    // Check if the 'admin_BQDS' or 'users' document exists
    const hasUser = userExists;

    // Check conditions for authorized access
    if (hasDomain && (isAdmin || hasUser)) {
      // Navigate to the 'folders' route
      this.router.navigate(['/folders']);
      return true;
    } else if (hasDomain && !hasUser) {
      const email = this.auth.currentUser?.email;
      // Send a notification to the admin with the user's email
      this.sendNotificationToAdmin(email).subscribe(() => {});
      // Navigate to the 'not-authorized' route
      this.router.navigate(['not-authorized']);
      return false;
    } else {
      // Navigate to the 'not-authorized' route
      this.router.navigate(['not-authorized']);
      return false;
    }
  }


  public sendNotificationToAdmin(email): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/contact_admin`, {
      email: email,
    });
  }


}
