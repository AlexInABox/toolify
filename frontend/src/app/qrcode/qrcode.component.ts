import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../environments/environment';

@Component({
  selector: 'qrcode-app',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
  imports: [ToastModule, FormsModule, CommonModule, InputTextModule, ButtonModule],
  providers: [MessageService],
})
export class QRCodeComponent {
  qrInput: string = '';
  qrCodeUrl: string | null = null;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  generateQRCode() {
    if (!this.qrInput.trim()) {
      this.showError('Input cannot be empty');
      return;
    }

    this.http.get(`${environment.apiUrl}/qrcode?string=${encodeURIComponent(this.qrInput)}`, { responseType: 'text' })
      .subscribe({
        next: (base64String) => {
          this.qrCodeUrl = base64String;
          this.showSuccess('QR Code generated successfully');
        },
        error: (error) => {
          console.error('Error fetching QR code', error);
          const errorMessage = error.error?.message || 'Failed to generate QR Code';
          this.showError(errorMessage);
        }
      });
  }

  private showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
