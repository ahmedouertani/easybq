import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { Profile, UserRole } from 'src/app/models/profile.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { doc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { query, where, getDocs, collection, CollectionReference, QuerySnapshot } from 'firebase/firestore';
import { DocumentData, getFirestore, setDoc } from '@angular/fire/firestore';

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



    // Check if the user is an admin
    const isAdmin = queryResult.docs.length > 0;


    // Check conditions for authorized access
    if (isAdmin) {
      // Navigate to the 'folders' route
      this.router.navigate(['/folders']);
      return true;
    } else {
      // Navigate to the 'not-authorized' route
      this.router.navigate(['create-domaine']);
      return false;
    }
  }


  public sendNotificationToAdmin(email): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/contact_admin`, {
      email: email,
    });
  }


  async createDomaine(domaineName: string): Promise<{ profile: Profile | null; exists: boolean }> {
    try {
      const user = this.auth.currentUser!;
      const createdOn = new Date().toISOString().substring(0, 10) + 'T00:00:00.000Z';
      const domaineId = uuidv4();

      // Check if the domain name already exists
      const domaineQuery: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(this.firestore, 'domaine_BQDS') as CollectionReference<DocumentData>, where('domaineName', '==', domaineName))
      );

      if (!domaineQuery.empty) {
        // Domain name already exists
        return { profile : null, exists: true };
      }

      // Save profile data to 'domaine_BQDS' collection
      await setDoc(doc(this.firestore, 'domaine_BQDS', domaineId), {
        domaineId,
        user_id: user.uid,
        domaineName,
        status: false
      });

      const profile: Profile = {
        role: UserRole.Admin,
        created_on: createdOn,
        idDomaine: domaineId,
        uid: user.uid,
        last_connected: user.metadata.lastSignInTime ?? '',
        photoURL: user.photoURL ?? '',
        displayName: user.displayName ?? '',
        email: user.email ?? '',
      };

      // Save profile data to 'membership_BQDS' collection
      await setDoc(doc(this.firestore, 'membership_BQDS', user.uid), profile);

      // Navigate to settings page
      this.router.navigate(['/settings']);

      return { profile, exists: false };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }



}
