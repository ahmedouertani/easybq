import { File } from '../../models/file.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { AbstractTableComponent } from '../../../../components/table.component';

@Component({
  standalone: true,
  selector: 'app-list-files',
  templateUrl: './list-files.component.html',
  styleUrls: ['./list-files.component.scss'],
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
    NgClass
  ],
})
export class ListFilesComponent extends AbstractTableComponent<File> {

  public override readonly displayedColumns: string[] = [
    'created_on',
    'name',
    'type'
  ];

}

