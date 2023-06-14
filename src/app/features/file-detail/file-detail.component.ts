import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subject,take, takeUntil } from 'rxjs';
import { AsyncPipe, DatePipe, JsonPipe, NgIf } from '@angular/common';
import { LoaderComponent } from '../../components/loader.component';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { FileDetailService } from './services/file-detail.service';
import { TableOverviewComponent } from './components/table-overview/table-overview.component';
import { Schema } from './models/schema.model';
import { FileSchemaComponent } from "./components/file-schema/file-schema.component";
import { FileInfos } from './models/fileInfos.model';
import { UpdateFileComponent } from './components/update-file/update-file.component';
import { ListFilesComponent } from '../folder-detail/components/list-files/list-files.component';

@Component({
  standalone: true,
  selector: 'app-folder-detail',
  templateUrl: './file-detail.component.html',

  styles: [
    `
      .tables-card {
        padding: 24px 16px;
      }

      .td-header, .td-body{
        color: #707070;
        height:3.5rem;
        vertical-align:middle;
      }

      .td-body{
        font-weight:400;
      }

      td.td-header {
        font-size: 0.9rem;
        font-weight: 700;
      }

      .folders-container {
        padding: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],

  providers: [FileDetailService],
  imports: [
    NgIf,
    AsyncPipe,
    JsonPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    LoaderComponent,
    MatBottomSheetModule,
    TranslocoModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    TableOverviewComponent,
    FileSchemaComponent,
    UpdateFileComponent,
    ListFilesComponent,
    DatePipe


  ]
})
export class FileDetailComponent implements OnInit, OnDestroy {
  private readonly isDestroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly fileDetailService = inject(FileDetailService);
  public tables$: Observable<any>;
  public files$: Observable<any>;
  public filesHistory$: Observable<any>;
  public folderId: string;
  public tableId: string;
  public infos: FileInfos;
  loadInfo: boolean = true;
  public schema : Schema[]=[] ;
  scheme$ : Observable<any>;


  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.isDestroy$))
      .subscribe(({ id }) => {
        this.folderId = id;
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.isDestroy$))
      .subscribe(({ tableId }) => {
        this.tableId = tableId;
      });

    this.fetchAllFiles();
    this.fetchFileSchema();
    this.fetchHistoryFiles() ;
  }

  public ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  private fetchAllFiles(): void {
    this.files$ = this.fileDetailService.fetchFileOverview(this.folderId, this.tableId);
  }

  private fetchFileSchema(): void {
    this.scheme$ = this.fileDetailService.fetchFileSchema(this.folderId, this.tableId) ;
    this.scheme$.subscribe((res) => {
      if (res) {
        this.infos = res.infos[0];
        this.schema = res.data_scheme ;
        this.loadInfo = false;
      }
    })
    this.loadInfo = false ;
  }

  public openUploadFileDialog(): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      panelClass: 'bottom-sheet-without-padding',
      data: { folderId: this.folderId , tableName:this.infos.table_name }
    };

    const dialogRef = this.bottomSheet.open(UpdateFileComponent, bottomSheetConfig);

    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        const componentInstance = dialogRef.instance as UpdateFileComponent;
        componentInstance.folderId = bottomSheetConfig.data.folderId;
        componentInstance.tableName = bottomSheetConfig.data.tableName;

      });

    dialogRef
      .afterDismissed()
      .pipe(takeUntil(this.isDestroy$))
      .subscribe((data: any) => {
        if (data === true) {
          this.fetchAllFiles();
          this.fetchFileSchema();
          this.fetchHistoryFiles() ;        }
      });
  }



  private fetchHistoryFiles(): void {
    this.filesHistory$ = this.fileDetailService.fetchFiles(this.folderId , this.tableId);
  }
}
