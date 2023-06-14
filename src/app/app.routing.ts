import { Routes } from '@angular/router';
import { isAuthenticated } from './guards/is-authenticated.guard';
import { fetchProfile } from './resolvers/profile.resolver';
import { LayoutComponent } from './layout/layout.component';
import { isAdmin } from './guards/is-admin.guard';
import { Authentification } from './guards/authentification.guard';
import { FoldersComponent } from './features/folders/folders.component';
import { HasDomaineGuard } from './guards/has-domaine.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'folders',
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./components/not-authorized.component').then(
        ({ NotAuthorizedComponent }) => NotAuthorizedComponent
      ),
  },
  {
    path: 'create-domaine',
    canActivate: [() => HasDomaineGuard()],
    loadComponent: () =>
      import('./features/sign-in/domaine/domaine.component').then(
        ({ DomaineComponent }) => DomaineComponent
      ),
  },
  {
    path: 'sign-in',
    canActivate: [() => Authentification()],
    loadComponent: () =>
      import('./features/sign-in/sign-in.component').then(
        ({ SignInComponent }) => SignInComponent
      ),
  },

  {
    path: '',
    canActivate: [() => isAuthenticated()],
    component: LayoutComponent,
    resolve: { profile: () => fetchProfile() },
    children: [
      {
        path: 'folders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/folders/folders.component').then(
                ({ FoldersComponent }) => FoldersComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/folder-detail/folder-detail.component').then(
                ({ FolderDetailComponent }) => FolderDetailComponent
              ),
          },
          {
            path: ':id/:tableId',
            loadComponent: () =>
              import('./features/file-detail/file-detail.component').then(
                ({ FileDetailComponent }) => FileDetailComponent
              ),
          },
        ],
      },
      {
        path: 'users',
       //        canActivate: [() => isAdmin()],

        loadComponent: () =>
          import('./features/users/users.component').then(
            ({ UsersComponent }) => UsersComponent
          ),
      },
      {
        path: 'settings',
       //        canActivate: [() => isAdmin()],

        loadComponent: () =>
          import('./features/settings/settings.component').then(
            ({ SettingsComponent }) => SettingsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    component : FoldersComponent
  },
];
