import { NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { Auth, User } from "@angular/fire/auth";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { Observable, Subject } from "rxjs";
import { TranslocoModule } from "@ngneat/transloco";
import { getDocs, query, where, collection, doc } from 'firebase/firestore';
import { getFirestore } from "@angular/fire/firestore";
import { initializeApp } from "@angular/fire/app";
import { environment } from "src/environments/environment";
import { ProfileService } from "../services/profile.service";



@Component({
  standalone: true,
  selector: 'app-layout',
  template: `
    <mat-toolbar color="primary">
      <mat-toolbar-row class="max-width-container">
        <img routerLink="/"  class="brand" src="./assets/images/logo.png" alt="Logo" role="presentation">

        <span class="spacer"></span>

        <div class="user-container-metadata" *ngIf="user">
          <button mat-icon-button class="user-avatar-trigger" [matMenuTriggerFor]="menu">
            <img [src]="user.photoURL" alt="Avatar" class="user-avatar" />
          </button>

          <mat-menu #menu="matMenu">
            <button mat-menu-item disabled>
              <div class="user-metadata">
                <strong>{{ user.displayName }}</strong>
                <span>{{ user.email }}</span>
              </div>
            </button>
            <button mat-menu-item routerLink="folders">
              <mat-icon>folders</mat-icon>
              {{ 'layout.menu.folders' | transloco }}
            </button>
            <button mat-menu-item routerLink="users" *ngIf="isAdmin">
              <mat-icon>group</mat-icon>
              {{ 'layout.menu.users' | transloco }}
            </button>
            <button mat-menu-item routerLink="settings" *ngIf="isAdmin">
              <mat-icon>settings</mat-icon>
              {{ 'layout.menu.settings' | transloco }}
            </button>
            <button mat-menu-item (click)="signOut()">
              <mat-icon>logout</mat-icon>
              {{ 'layout.menu.sign-out' | transloco }}
            </button>
          </mat-menu>
        </div>
      </mat-toolbar-row>
    </mat-toolbar>

    <div class="layout-container max-width-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    .max-width-container {
      max-width: 1280px;
      margin: auto;
    }

    .layout-container {
      padding: 24px 16px;
      margin-top: 56px;

      @media screen and (min-width: 600px) {
        margin-top: 64px;
      }
    }

    .brand {
      max-height: 24px;
      cursor: pointer;
      background-color: white;
      padding: 8px 16px;
      border-radius: 16px;
    }

    .user-avatar-trigger {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50% !important;
    }

    .user-metadata {
      min-width: 256px;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      font-size: .75rem;
    }

    .user-container-metadata {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    .user-avatar {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      border: 4px solid white;
    }
  `],
  imports: [
    NgIf,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly isDestroy$ = new Subject<void>();
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  public app = initializeApp(environment.firebaseConfig);
  public firestore = getFirestore(this.app);
  public isAdmin: boolean = true  ;


  public user: User | null;

  public ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
    });
    this.checkUserAccess() ;
  }

  public ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  public async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  public async checkUserAccess() {
    // check if the user exist in bqds-user is an admin using the profileService
    const queryResult = await this.profileService.checkAdmin(this.auth.currentUser!.uid);

    // Get the user data from the subCollection users using the profileService
    const userData = await this.profileService.getUser(this.auth.currentUser!);

    // Check if the query result has any documents and if the user's role is "admin"
    this.isAdmin = queryResult.docs.length > 0 && queryResult.docs[0].data()['role'] === "admin";

    // Check if userData exists and if the user's role is "admin"
    this.isAdmin = this.isAdmin || (userData?.data()['role'] === "admin");

    // Return the value of isAdmin
    return this.isAdmin;
  }
}
