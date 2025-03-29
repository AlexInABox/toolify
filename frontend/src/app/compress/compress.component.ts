import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment';


@Component({
  selector: 'compress-app',
  templateUrl: './compress.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule, StepperModule, ButtonModule, FileUploadModule],
  providers: [MessageService],
})
export class CompressComponent {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }

  uploadFiles(event: FileUploadHandlerEvent) {
    // Convert FileList to array
    this.uploadedFiles = Array.from(event.files);

    this.messageService.add({
      severity: 'info',
      summary: 'Uploading files...',
      detail: `${this.uploadedFiles.length} file(s) are uploading.`,
    });

    this.uploadedFiles.forEach((file) => {
      this.uploadFile(file);
    });
  }


  // File upload method
  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${environment.apiUrl}/compress`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Handle response after compression, such as downloading the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_file';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'There was an error during the upload process.',
        });
      });
  }
}
