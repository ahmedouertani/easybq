import { Component,inject, AfterViewInit , ViewChild} from '@angular/core';
import { AbstractTableComponent } from 'src/app/components/table.component';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FileDetailService } from '../../services/file-detail.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-table-overview',
  templateUrl: './table-overview.component.html',
  styleUrls: ['./table-overview.component.scss'],
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
export class TableOverviewComponent extends AbstractTableComponent<any> implements AfterViewInit {
  public columnName: string[]=[] ;
  private readonly fileDetailService = inject(FileDetailService);
  public tables$: Observable<any>;
  public files$: Observable<any>;
  public folderId: string;
  public tableId: string;
  private readonly isDestroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  public override  displayedColumns: string[] ;
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
    this.fetchAllFiles();
    }

    private fetchAllFiles(): void {
      this.files$ = this.fileDetailService.fetchFileOverview(this.folderId , this.tableId);
      this.files$.subscribe((res)=>{
        if(res){
          this.displayedColumns =  res.headers
          this.dataSource = res.values ;
          this.transformData(this.dataSource ,this.displayedColumns);
        }
      })
    }

    private transformData(values , headers): void {
      if (values && headers) {
        const transformedData = values.map((item) =>
          item.reduce((acc, value, index) => {
            acc[headers[index]] = value;
            return acc;
          }, {})
        );
        this.dataSource = new MatTableDataSource<any>(transformedData);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = headers;
      }
    }
}
