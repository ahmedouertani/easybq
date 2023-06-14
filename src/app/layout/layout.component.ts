import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { getDocs, query, where, collection, doc } from 'firebase/firestore';
import { getDoc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../services/profile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    NgIf,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule,
    NgClass,
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly isDestroy$ = new Subject<void>();
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  public isAdmin: boolean = true;
  domaineName: string | undefined;
  status: boolean;
  userRole: string;
  private unsubscribe: () => void; // Declare the unsubscribe function

  private readonly transloco = inject(TranslocoService);
  public defaultLanguage = this.transloco.getActiveLang();

  public user: User | null;

  public ngOnInit(): void {
    this.checkDomaineStatus(this.profileService.profile.idDomaine)
    this.profileService.getUserRole().then((res) => {
      this.userRole = res;
    });
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
    });
    this.checkUserAccess();
    this.getNameSpace();
  }

  checkDomaineStatus(domaineId: string): void {
    const app = initializeApp(environment.firebaseConfig);
    const firestore = getFirestore(app);
    const docRef = doc(firestore, 'domaine_BQDS', domaineId);

    this.unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const status = docSnapshot.data()['status'];
        if (status === true) {
          this.status = true;
        } else if (status === false) {
          this.status = false;
        }
      }
    });
  }


  getFirstLetter(email: string): string {
    return email ? email.charAt(0).toUpperCase() : '';
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  public ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  public async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  public async checkUserAccess() {
    // check if the user exist in bqds-user is an admin using the profileService
    const queryResult = await this.profileService.checkAdmin(
      this.auth.currentUser!.uid
    );

    // Check if the query result has any documents and if the user's role is "admin"
    this.isAdmin =
      queryResult.docs.length > 0 &&
      queryResult.docs[0].data()['role'] === 'admin';

    // Check if userData exists and if the user's role is "admin"
    this.isAdmin = this.isAdmin;

    // Return the value of isAdmin
    return this.isAdmin;
  }

  public onSelectionChange(change: MatSelectChange): void {
    const { value } = change;
    this.transloco.setActiveLang(value);

    localStorage.setItem('current_language', value);
  }

  getStatus() {
    this.profileService.getStatusAS().subscribe((res) => {
      if (res) {
        this.status = res.status;
      }
    });
  }
  getNameSpace() {
    this.profileService.getDomaineName().subscribe((res) => {
      if (res) {
        this.domaineName = res.domainename;
      }
    });
  }
}


