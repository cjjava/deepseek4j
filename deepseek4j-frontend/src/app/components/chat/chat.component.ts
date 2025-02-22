import { Component, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {CommonModule} from '@angular/common';
import { ChatCompletionResponse } from '../../models/chat-completion-response'; // 导入定义的接口
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy{
  private eventSource?: EventSource;
  private destroy$ = new Subject<void>();
  chatResponses: ChatCompletionResponse[] = [];
  userInput = '';

  constructor(
    private cdr: ChangeDetectorRef
  ) {

  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
    const userMessage = this.userInput.trim();
    this.eventSource = new EventSource('http://localhost:8080/chat?prompt='+userMessage);

    this.userInput = '';

    this.eventSource.onmessage = (event) => {
      const message: ChatCompletionResponse = JSON.parse(event.data);
      console.log(message);
      this.chatResponses.push(message);
      this.cdr.detectChanges();
    };
    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      if (this.eventSource) {
        this.eventSource.close();
      }
    };
  }

  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

}
