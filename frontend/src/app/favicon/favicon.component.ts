import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'favicon-app',
  templateUrl: './favicon.component.html',
  styleUrls: ['favicon.component.css'],
  standalone: true,
  imports: [CommonModule, ToastModule, StepperModule, ButtonModule, FileUploadModule],
  providers: [MessageService],
})
export class FaviconComponent {
  uploadedFiles: File[] = [];

  constructor(private messageService: MessageService) { }

  uploadFiles(event: FileUploadHandlerEvent) {
    // Convert FileList to array
    this.uploadedFiles = Array.from(event.files);

    this.messageService.add({
      severity: 'info',
      summary: 'Uploading files...',
      detail: `${this.uploadedFiles.length} file(s) are being processed.`,
    });

    this.uploadedFiles.forEach((file) => {
      this.convertToFavicons(file);
    });
  }

  // File upload method using async/await to convert to a ZIP of favicons
  async convertToFavicons(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${environment.apiUrl}/favicon`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error generating favicons');
      }

      const blob = await response.blob();
      // Handle response with ZIP of favicons, such as downloading the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicons.zip'; // Change to indicate a ZIP file
      a.click();
      window.URL.revokeObjectURL(url);

      this.messageService.add({
        severity: 'success',
        summary: 'Upload Successful',
        detail: `${file.name} has been processed and converted into a ZIP of favicons.`,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'There was an error during the upload process.',
      });
    }
  }
}
