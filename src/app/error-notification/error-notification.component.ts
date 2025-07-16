import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-notification',
  imports: [],
  templateUrl: './error-notification.component.html',
  styleUrl: './error-notification.component.css',
})
export class ErrorNotificationComponent {
  @Input() message = '';
  @Output() hideNotification = new EventEmitter<any>();
  notifyClose() {
    this.hideNotification.emit();
  }
}
