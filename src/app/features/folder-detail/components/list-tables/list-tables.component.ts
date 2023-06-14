import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { AbstractTableComponent } from '../../../../components/table.component';
import { Table } from '../../models/table.model';
import {DatePipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-list-tables',
  templateUrl: './list-tables.component.html',
  styleUrls: ['./list-tables.component.scss'],
  imports: [
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslocoModule,
    DatePipe
  ],
})
export class ListTablesComponent extends AbstractTableComponent<Table> {
  @Output()
  public readonly deleteTable = new EventEmitter<string>();

  public override readonly displayedColumns: string[] = [
    'name',

    'created_on',
    'updated_on',
    'actions'
  ];

  public handleDelete(table : Table, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.deleteTable.emit(table.id);
  }
}
