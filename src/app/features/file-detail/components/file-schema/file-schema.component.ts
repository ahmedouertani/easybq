import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { AbstractTableComponent } from '../../../../components/table.component';
import { Schema } from '../../models/schema.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDetailService } from '../../services/file-detail.service';
import { Observable, Subject, takeUntil } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-file-schema',
  templateUrl: './file-schema.component.html',
  styleUrls: ['./file-schema.component.scss'],
  imports: [
    NgIf,
    NgFor,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslocoModule,
  ],
})
export class FileSchemaComponent
  extends AbstractTableComponent<Schema>
  implements AfterViewInit
{
  public override readonly displayedColumns: string[] = [
    'name',
    'type',
    'mode',
  ];
  private readonly isDestroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fileDetailService = inject(FileDetailService);
  public tables$: Observable<any>;
  public files$: Observable<any>;
  public folderId: string;
  public tableId: string;
  public schema: Schema[] = [];
  @ViewChild(MatPaginator) override paginator: MatPaginator;

  override ngAfterViewInit(): void {
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
    this.fetchFileSchema();
  }

  fetchFileSchema(): void {
    this.fileDetailService.fetchFileSchema(this.folderId, this.tableId).subscribe((res) => {
      if (res && res.data_scheme) {
        this.dataSource = new MatTableDataSource(res.data_scheme);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator?.length; // Length of the dataSource
      }
    });
  }

}
