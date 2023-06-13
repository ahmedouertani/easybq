import { Component, inject, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Auth, signInWithPopup } from '@angular/fire/auth';
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleAuthProvider, Unsubscribe } from "firebase/auth";
import { take } from "rxjs";
import { AuthService } from "./services/auth.service";

@Component({
  standalone: true,
  selector: 'app-sign-in',
  template: `
    <button  mat-raised-button (click)="signInWithGoogle()">
      <div class="text-with-icon">
        <img src="assets/images/google.svg" height="28" />
        <span>Continue with Google</span>
      </div>
    </button>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 64px;
    }

    .text-with-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
  `],
  imports: [
    MatButtonModule,
  ]
})
export class SignInComponent implements OnInit, OnDestroy {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly service = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);
  private unsubscribeAuthStateChanged: Unsubscribe;

  public signInWithGoogle(): void {
    const provider = new GoogleAuthProvider();

  // Sign in with a popup using the specified provider
signInWithPopup(this.auth, provider)
.then((result) => {
  // Retrieve the signed-in user
  const user = result.user;

  // Call the CheckUser function to validate the user's access
  this.service.CheckUserExist(user?.uid).then((res) => {
    if (res == true) {
      // If the user is authorized, navigate to the 'folders' route
      this.router.navigate(['/folders']);
    } else {
      // If the user is not authorized, navigate to the 'not-authorized' route
      this.router.navigate(['not-authorized']);
    }
  });
});


  }

  public ngOnInit(): void {
    this.unsubscribeAuthStateChanged = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.activatedRoute
          .queryParams
          .pipe(take(1))
          .subscribe(({ redirect, search }) => {
            this.ngZone.run(() => {
              this.router.navigateByUrl(redirect + search || '/', {
                onSameUrlNavigation: 'reload',
                replaceUrl: true,
              });
            })
          });
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribeAuthStateChanged();
  }
}
