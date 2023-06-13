import { Component, inject } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  standalone: true,
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ]
})
export class UploadFileComponent {
  private readonly bottomSheet = inject(MatBottomSheetRef<UploadFileComponent>);

  public file: File | undefined;

  public close(): void {
    this.bottomSheet.dismiss(this.file);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) as File;
    this.file = file;
  }
}