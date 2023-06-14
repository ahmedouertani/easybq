import { Component, inject, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Auth, signInWithPopup } from '@angular/fire/auth';
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleAuthProvider, Unsubscribe } from "firebase/auth";
import { take } from "rxjs";
import { AuthService } from "./services/auth.service";
import { MatCardModule } from "@angular/material/card";

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [
    MatButtonModule,
    MatCardModule
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
      this.router.navigate(['create-domaine']);
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
