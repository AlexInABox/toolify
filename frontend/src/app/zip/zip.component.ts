import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'zip-app',
  templateUrl: './zip.component.html',
  styleUrls: ['zip.component.css'],
  standalone: true,
  imports: [CommonModule, ToastModule, StepperModule, ButtonModule, FileUploadModule],
  providers: [MessageService],
})
export class ZipComponent {
  uploadedFiles: File[] = [];
  unzippedFiles: string[] = [];

  constructor(private messageService: MessageService) { }

  // Zipping method: Compresses uploaded files into a ZIP archive
  async zipFiles(event: FileUploadHandlerEvent) {
    this.uploadedFiles = Array.from(event.files);

    if (this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'No Files Selected',
        detail: 'Please upload files to zip.',
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Uploading files...',
      detail: `${this.uploadedFiles.length} file(s) are being processed.`,
    });

    const formData = new FormData();
    this.uploadedFiles.forEach((file) => formData.append('files', file, file.name));

    try {
      const response = await fetch(`${environment.apiUrl}/zip`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error zipping files');
      }

      const blob = await response.blob();
      // Create a link to download the zipped file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'files.zip'; // Name of the zipped file
      a.click();
      window.URL.revokeObjectURL(url);

      this.messageService.add({
        severity: 'success',
        summary: 'Files Zipped Successfully',
        detail: `${this.uploadedFiles.length} file(s) have been compressed into a ZIP file.`,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Zipping Failed',
        detail: 'There was an error while zipping the files.',
      });
    }
  }

  // Unzipping method: Extracts files from the uploaded ZIP file
  async unzipFile(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    if (!file) {
      this.messageService.add({
        severity: 'error',
        summary: 'No File Selected',
        detail: 'Please upload a ZIP file to unzip.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const response = await fetch(`${environment.apiUrl}/unzip`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error unzipping file');
      }

      const data = await response.json();
      this.unzippedFiles = data.files.map((fileUrl: string) => `${environment.apiUrl}${fileUrl}`);

      this.messageService.add({
        severity: 'success',
        summary: 'Files Unzipped Successfully',
        detail: `${this.unzippedFiles.length} file(s) have been extracted.`,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unzipping Failed',
        detail: 'There was an error while unzipping the file.',
      });
    }
  }
}
