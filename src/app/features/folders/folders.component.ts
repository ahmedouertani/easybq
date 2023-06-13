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
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  standalone: true,
  selector: 'app-folders',
  styles: [`
    .folders-card {
      padding: 24px 16px;
    }

    .add-folder {
      padding-top: 32px;
      padding-bottom: 16px;
    }

    .folders-container {
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `],
  template: `
    <h1>
      {{ 'features.folders.title' | transloco }}
    </h1>

    <ng-container *ngIf="folders$ | async as folders; else loading">
      <div class="add-folder">
        <button mat-flat-button color="primary" (click)="openCreateFolderDialog()">
          {{ 'features.folders.add' | transloco }}
        </button>
      </div>

      <mat-card class="folders-card">
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
  providers: [FoldersService]
})
export class FoldersComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(FoldersService);
  private readonly bottomSheet = inject(MatBottomSheet);
  public folders$: Observable<Folder[]>;

  public ngOnInit(): void {
    this.fetchAll();
  }

  private fetchAll(): void {
    this.folders$ = this.service.fetchFolders();
  }

  private createFolder(folderName: string): void {
    // TODO : display loader
    this.service.createFolder(folderName)
      .subscribe({
        next: (_) => this.fetchAll(),
        error: (error) => console.log(error)
      });
  }

  public openCreateFolderDialog(): void {
    this.bottomSheet
      .open(CreateFolderComponent, { panelClass: 'bottom-sheet-without-padding' })
      .afterDismissed()
      .pipe(filter((data) => !!data.name))
      .subscribe(({ name }) => this.createFolder(name));
  }

  public deleteFolder(folderName: string) {
    // TODO: add confirmation dialog
    this.service.deleteFolder(folderName)
      .subscribe({
        next: () => this.fetchAll(),
        error: (error) => console.log(error)
      });
  }

  public handleRowCliked(folder: Folder) {
    this.router.navigate([folder.id], {
      relativeTo: this.activatedRoute
    });
  }
}
