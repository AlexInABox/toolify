import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'gif-app',
  templateUrl: './gif.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule, StepperModule, ButtonModule, FileUploadModule],
  providers: [MessageService],
})
export class GifComponent {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }

  uploadFiles(event: FileUploadHandlerEvent) {
    // Convert FileList to array and prepare FormData
    const formData = new FormData();
    this.uploadedFiles = Array.from(event.files);

    this.uploadedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Uploading files...',
      detail: `${this.uploadedFiles.length} file(s) are uploading.`,
    });

    this.uploadGif(formData);
  }

  // Upload all files to the server
  uploadGif(formData: FormData) {
    fetch(`${environment.apiUrl}/gif`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to upload files. Please try again later.');
        }
        return response.blob();
      })
      .then((blob) => {
        // Handle response after compression, such as downloading the gif
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'slideshow.gif'; // Set the name for the downloaded GIF
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: error.message || 'There was an error during the upload process.',
        });
      });
  }
}
