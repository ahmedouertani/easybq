import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FolderDetailService } from './services/folder-detail.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { LoaderComponent } from '../../components/loader.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Folder } from '../folders/models/folders.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ListTablesComponent } from './components/list-tables/list-tables.component';
import { Table } from './models/table.model';
import { OrderByDatePipe } from 'src/app/pipes/orderByDate.pipe';
import { displayConfirmationAlert } from 'src/app/common/alerts.utils';

@Component({
  standalone: true,
  selector: 'app-folder-detail',
  styles: [
    `
      .tables-card {
        padding: 24px 16px;
      }

      .folders-container {
        padding: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  template: `
    <div class="btn-add">
      <span class="back-and-title">
        <a class="btn-back">
          <mat-icon routerLink="..">arrow_backward</mat-icon>
        </a>
        <h1>
          {{ 'features.folder-detail.title' | transloco }}
          {{ folderDetail?.name }}
        </h1>
      </span>
      <button mat-flat-button color="primary" (click)="openCreateTableDialog()">
        {{ 'features.tables.add' | transloco }}
      </button>
    </div>
    <ng-container *ngIf="tables$ | async as tables; else loadingTables">
      <mat-card>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'features.tables.search' | transloco }}</mat-label>
          <input type="text" #searchInput matInput />
        </mat-form-field>

        <app-list-tables
          [data]="tables.message ? [] : tables"
          [filter]="searchInput.value"
          (deleteTable)="deleteTable($event)"
          (rowClicked)="handleRowCliked($event)"
        >
        </app-list-tables>
      </mat-card>
    </ng-container>
    <ng-template #loadingTables>
      <app-loader> {{ 'loading.default' | transloco }}</app-loader>
    </ng-template>
  `,
  imports: [
    NgIf,
    AsyncPipe,
    JsonPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    LoaderComponent,
    UploadFileComponent,
    MatBottomSheetModule,
    TranslocoModule,
    ListTablesComponent,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatProgressBarModule,
  ],
  providers: [FolderDetailService, OrderByDatePipe],
})
export class FolderDetailComponent implements OnInit, OnDestroy {
  private readonly isDestroy$ = new Subject<void>();
  private readonly folderDetailService = inject(FolderDetailService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  public tables$: Observable<any>;
  public files$: Observable<any>;
  public folderId: string;
  public folderDetail: Folder;
  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.isDestroy$))
      .subscribe(({ id }) => {
        this.folderId = id;
      });
    this.fetchAllTables();
    this.fetchAllFiles();
    this.fetchFolderByDetail();
  }

  public ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  private fetchAllTables(): void {
    this.tables$ = this.folderDetailService.fetchTables(this.folderId);
  }

  private fetchAllFiles(): void {
    this.files$ = this.folderDetailService.fetchFiles(this.folderId);
  }

  private fetchFolderByDetail(): void {
    this.folderDetailService.fetchFolderById(this.folderId).subscribe((res) => {
      if (res) {
        this.folderDetail = res[0];
      }
    });
  }

  public openCreateTableDialog(): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      panelClass: 'bottom-sheet-without-padding',
      data: { folderId: this.folderId },
    };

    const dialogRef = this.bottomSheet.open(
      UploadFileComponent,
      bottomSheetConfig
    );

    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        const componentInstance = dialogRef.instance as UploadFileComponent;
        componentInstance.folderId = bottomSheetConfig.data.folderId;
      });

    dialogRef
      .afterDismissed()
      .pipe(takeUntil(this.isDestroy$))
      .subscribe((data: any) => {
        if (data === true) {
          this.fetchAllTables();
        }
      });
  }

  public handleRowCliked(table: Table) {
    this.router.navigate(['/folders/' + this.folderId + '/' + table.id], {
      relativeTo: this.activatedRoute,
    });
  }

  public deleteTable(id: string) {
    displayConfirmationAlert(
      this.transloco.translate('features.folder-detail.dialog.confirmation'),
      this.transloco.translate('common.confirm'),
      this.transloco.translate('common.cancel'),
    )
      .then((result) => {
        if (result.isConfirmed) {
          this.handleResponse(
            this.folderDetailService.deleteTable(this.folderId, id)
              .subscribe({
                next: () => {
                  this.fetchAllTables()
                },
                error: (error) => console.log(error)
              }), 'remove'
          );
        }
      });

  }
  handleResponse(arg0: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
}
