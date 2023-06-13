import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

export const Authentification = (): Promise<boolean> => {
  const router = inject(Router);
  const auth = inject(Auth);

  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe from the listener after the first invocation

      if (user) {
        router.navigate(['/folders']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
