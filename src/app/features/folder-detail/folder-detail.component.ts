import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FolderDetailService } from "./services/folder-detail.service";
import { Observable, Subject, takeUntil } from "rxjs";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { LoaderComponent } from "../../components/loader.component";
import { UploadFileComponent } from "./components/upload-file/upload-file.component";
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  standalone: true,
  selector: 'app-folder-detail',
  template: `
    <h1>
      <button mat-icon-button routerLink="..">
        <mat-icon>arrow_backward</mat-icon>
      </button>
      {{ 'features.folder-detail.title' | transloco }}
    </h1>

    <!--
    TODO: Need to be fixed with the new API

    <h2>Tables</h2>
    <ng-container *ngIf="tables$ | async as tables;else loadingTables">
      <ng-container *ngIf="tables.message">
        {{ tables.message }}
      </ng-container>

      <input type="text" #name placeholder="Table name"/>
      <button (click)="createTable(name.value);name.value = ''">Create table</button>
    </ng-container>
    <ng-template #loadingTables>
      <app-loader>
        Loading folder metadata
      </app-loader>
    </ng-template>

    <h2>Fichiers</h2>

    <button (click)="uploadFile()">Ajouter un fichier</button>

    <ng-container *ngIf="files$ | async as files;else loadingFiles">
      <ng-container *ngIf="files.message">
        {{ files.message }}
      </ng-container>
    </ng-container>
    <ng-template #loadingFiles>
      <app-loader>
        Loading folder metadata
      </app-loader>
    </ng-template>  -->
  `,
  styles: [`
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
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
  ],
  providers: [FolderDetailService]
})
export class FolderDetailComponent implements OnInit, OnDestroy {
  private readonly isDestroy$ = new Subject<void>();
  private readonly folderDetailService = inject(FolderDetailService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bottomSheet = inject(MatBottomSheet);
  public tables$: Observable<any>;
  public files$: Observable<any>;
  public folderId: string;

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.isDestroy$))
      .subscribe(({ id }) => {
        this.folderId = id;
        this.tables$ = this.folderDetailService.fetchTables(id);
        this.files$ = this.folderDetailService.fetchFiles(id);
      });
  }

  public ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  public uploadFile(): void {
    this.bottomSheet.open(UploadFileComponent, { panelClass: 'bottom-sheet-without-padding' })
      .afterDismissed()
      .pipe(takeUntil(this.isDestroy$))
      .subscribe((data) => {
        this.folderDetailService.uploadFile(this.folderId, 'cities', data)
          .subscribe({
            next: (a) => {
              console.log(a);
            },
            error: (error) => console.log(error)
          });
      });
  }

  public createTable(name: string) {
    const data = {
      "name": name,
      "id": '',
      'updated_on': '',
      'created_on': '',
      'id_bgquery': ''
    }

    this.folderDetailService.createTable(this.folderId, data)
      .subscribe({
        next: (a) => {
          console.log(a);
        },
        error: (error) => console.log(error)
      });
  }
}
