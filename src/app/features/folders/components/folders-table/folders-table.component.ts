import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractTableComponent } from '../../../../components/table.component';
import { Folder } from '../../models/folders.model';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'app-folders-table',
  styleUrls: ['folders-table.component.scss'],
  templateUrl: 'folders-table.component.html',
  imports: [
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslocoModule,
  ],
})
export class FolderTableComponent extends AbstractTableComponent<Folder> {
  @Output()
  public readonly deleteFolder = new EventEmitter<string>();

  public override readonly displayedColumns: string[] = [
    'name',
    'user_id',
    'created_on',
    'id',
    'actions'
  ];

  public handleDelete(folder: Folder, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.deleteFolder.emit(folder.id);
  }
}
