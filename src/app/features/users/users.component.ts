import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from './services/users.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, filter } from 'rxjs';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { LoaderComponent } from '../../components/loader.component';
import { TranslocoModule } from '@ngneat/transloco';
import { Profile} from 'src/app/models/profile.model';

@Component({
  standalone: true,
  selector: 'app-users',
  styles: [`
    .users-card {
      padding: 24px 16px;
    }

    .add-user {
      padding-top: 32px;
      padding-bottom: 16px;
    }
  `],
  template: `
    <h1>
    {{ 'features.users.title' | transloco }}
    </h1>

    <ng-container *ngIf="users$ | async as users; else loading">
      <div class="add-user">
        <button mat-flat-button color="primary" (click)="addUser()">
        {{ 'features.users.add' | transloco }}
        </button>
      </div>

      <mat-card class="users-card">
        <mat-form-field appearance="outline">
          <mat-label>
          {{ 'features.users.search' | transloco }}
          </mat-label>
          <input type="text" #searchInput matInput />
        </mat-form-field>

        <app-users-table
          [data]="users"
          [filter]="searchInput.value"
          (deleteUser)="deleteUser($event)"
          (updateRole)="updateRole($event)"
        >
        </app-users-table>
      </mat-card>
    </ng-container>

    <ng-template #loading>
      <app-loader>Chargement des utilisateurs</app-loader>
    </ng-template>
  `,
  providers: [
    UsersService
  ],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    JsonPipe,
    UsersTableComponent,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    LoaderComponent,
    TranslocoModule,
  ]
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly bottomSheet = inject(MatBottomSheet);
  public users$: Observable<Profile[]>;

  public ngOnInit() {
    this.fetchAll();
  }

  public fetchAll(): void {
    this.users$ = this.usersService.fetchAll();
  }

  public deleteUser(user: Profile): void {
    // TODO : add a loading spinner
    this.usersService
      .deleteUser(user.id)
      .subscribe({
        next: () => this.fetchAll(),
        error: () => alert('Une erreur est survenue lors de la suppression de l\'utilisateur')
      });
  }

  public updateRole(user: Profile) {
    // TODO : add a loading spinner

    this.usersService
      .updateUser(user.id, user)
      .subscribe(() => this.fetchAll());
  }

  private inviteUser(user: Partial<Profile>): void {
    // TODO : add a loading spinner
    if (user) {
      this.usersService
        .sendInvitation(user)
        .subscribe({
          next: () => this.fetchAll(),
          error: () => alert('Une erreur est survenue lors de l\'invitation de l\'utilisateur')
        });
    }
  }

  public addUser(): void {
    this.bottomSheet
      .open(InviteUserComponent, { panelClass: 'bottom-sheet-without-padding' })
      .afterDismissed()
      .pipe(filter((user) => !!user))
      .subscribe((user: Partial<Profile>) => this.inviteUser(user));
  }
}
