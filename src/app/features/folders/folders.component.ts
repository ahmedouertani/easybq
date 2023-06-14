import { Component, OnInit, inject } from "@angular/core";
import { FoldersService } from "./services/folders.service";
import { AsyncPipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { Observable, filter } from "rxjs";
import { Folder } from "./models/folders.model";
import { FolderTableComponent } from "./components/folders-table/folders-table.component";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CreateFolderComponent } from "./components/create-folder/create-folder.component";
import { LoaderComponent } from "../../components/loader.component";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { OrderByDatePipe } from "src/app/pipes/orderByDate.pipe";
import { ProfileService } from "src/app/services/profile.service";
import { Auth } from "@angular/fire/auth";
import { displayConfirmationAlert, handleResponseWithAlerts } from "src/app/common/alerts.utils";

@Component({
  standalone: true,
  selector: 'app-folders',
  template: `
    <ng-container *ngIf="folders$ | async as folders; else loading">
      <div class="btn-add">
        <h1>{{ 'features.folders.title' | transloco }}</h1>
        <button mat-flat-button color="primary" (click)="openCreateFolderDialog()" [disabled]="!activatedAccount">
            {{ 'features.folders.add' | transloco }}
        </button>
      </div>

      <mat-card >
        <mat-form-field appearance="outline">
          <mat-label>{{ "features.folders.search" | transloco }}</mat-label>
          <input type="text" #searchInput matInput />
        </mat-form-field>

        <app-folders-table
        [data]="folders.message ? [] : folders"
          [filter]="searchInput.value"
          (deleteFolder)="deleteFolder($event)"
          (rowClicked)="handleRowCliked($event)"
        >
        </app-folders-table>
      </mat-card>
    </ng-container>

    <ng-template #loading>
      <app-loader>{{ 'loading.default' | transloco }}</app-loader>
    </ng-template>
  `,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    JsonPipe,
    FolderTableComponent,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    CreateFolderComponent,
    LoaderComponent,
    TranslocoModule,
  ],
  providers: [FoldersService, OrderByDatePipe]
})
export class FoldersComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(FoldersService);
  private readonly bottomSheet = inject(MatBottomSheet);
  public folders$: Observable<Folder[]>;
  orderByDatePipe: OrderByDatePipe = new OrderByDatePipe();
  private readonly profileService = inject(ProfileService);
  private readonly transloco = inject(TranslocoService);
  private readonly auth = inject(Auth);
  userRole: string;
  activatedAccount: boolean = true;


  public ngOnInit(): void {
    // Fetch folders based on user role
    this.profileService.getUserRole().then(res => {
      this.userRole = res;
      if (this.userRole == "admin") {
        this.fetchAll();
      } else {
        this.fetchByUser();
      }
    });
    // Check activated account
    this.checkActivatedAccount();
  }

  // Fetch all folders
  private fetchAll(): void {
    this.folders$ = this.service.fetchFolders();
  }

  // Fetch folders by user
  private fetchByUser(): void {
    this.folders$ = this.service.fetchFoldersByUser(this.auth.currentUser!.uid);
  }

  // Create a new folder
  private createFolder(folderName: string): void {
    this.service.createFolder(folderName)
      .subscribe({
        next: (_) => {
          // Fetch folders based on user role after creating a folder
          this.profileService.getUserRole().then(res => {
            this.userRole = res;
            if (this.userRole == "admin") {
              this.fetchAll();
            } else {
              this.fetchByUser();
            }
          });
        },
        error: (error) => console.log(error)
      });
  }

  // Open the create folder dialog
  public openCreateFolderDialog(): void {
    this.bottomSheet
      .open(CreateFolderComponent, { panelClass: 'bottom-sheet-without-padding' })
      .afterDismissed()
      .pipe(filter((data) => !!data.name))
      .subscribe(({ name }) => this.createFolder(name));
  }

  // Delete a folder
  public deleteFolder(folderName: string) {
    displayConfirmationAlert(
      this.transloco.translate('features.folders.dialog.confirmation'),
      this.transloco.translate('common.confirm'),
      this.transloco.translate('common.cancel'),
    )
      .then((result) => {
        if (result.isConfirmed) {
          this.handleResponse(
            this.service.deleteFolder(folderName)
              .subscribe({
                next: () => {
                  // Fetch folders based on user role after deleting a folder
                  this.profileService.getUserRole().then(res => {
                    this.userRole = res;
                    if (this.userRole == "admin") {
                      this.fetchAll();
                    } else {
                      this.fetchByUser();
                    }
                  });
                },
                error: (error) => console.log(error)
              }), 'remove'
          );
        }
      });

  }

  // Handle row clicked event
  public handleRowCliked(folder: Folder) {
    this.router.navigate([folder.id], {
      relativeTo: this.activatedRoute
    });
  }

  // Check if the account is activated
  public checkActivatedAccount() {
    this.service.checkActivatedAccount().subscribe((res) => {
      if (!res.client_email) {
        if (this.userRole === "admin") {
          this.activatedAccount = true;
          handleResponseWithAlerts(
            this.transloco.translate('common.start-now.title'),
            this.transloco.translate('common.start-now.message'),
            this.transloco.translate('common.close'),
            () => this.router.navigate(['settings'])
          );
        } else if (this.userRole === "user") {
          this.activatedAccount = false;
          handleResponseWithAlerts(
            this.transloco.translate('common.contact-admin.title'),
            this.transloco.translate('common.contact-admin.message'),
            this.transloco.translate('common.close')
          );
        }
      }
    });
  }

  // Handle response
  handleResponse(arg0: any, arg1: string) {
    throw new Error("Method not implemented.");
  }
}

