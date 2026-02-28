import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-gpa-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gpa-advisor.component.html',
  styleUrls: ['./gpa-advisor.component.css']
})
export class GpaAdvisorComponent implements AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // ── State ─────────────────────────────────────────────
  isOpen = false;
  isTyping = false;
  inputText = '';

  // ── Messages history ──────────────────────────────────
  messages: Message[] = [];

  // ── Quick suggestion chips ────────────────────────────
  suggestions = [
    'How can I improve my GPA?',
    'What GPA do I need for graduation?',
    'How are grades calculated?',
    'Tips for exam preparation?',
  ];

  // ── System prompt sent to Claude ──────────────────────
  private systemPrompt = `You are a helpful GPA advisor for university students. 
  Your role is to:
- Help students understand how GPA is calculated
- Give advice on improving grades and academic performance  
- Answer questions about grade scales (A+/A = 4.0, B+ = 3.5, B = 3.0, C+ = 2.5, C = 2.0, D = 1.0, F = 0.0)
- Provide study tips and academic guidance
- Be encouraging and supportive

Keep responses concise and practical. Use simple formatting. Do not use markdown headers.`;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // ── Toggle chat open/close ────────────────────────────
  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  // ── Send a suggestion chip as a message ───────────────
  sendSuggestion(text: string): void {
    this.inputText = text;
    this.sendMessage();
  }

  // ── Clear chat history ────────────────────────────────
  clearChat(): void {
    this.messages = [];
    this.inputText = '';
  }

  // ── Send message to Anthropic API ────────────────────
  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isTyping) return;

    // Add user message
    this.messages.push({ role: 'user', content: text });
    this.inputText = '';
    this.isTyping = true;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: this.systemPrompt,
          messages: this.messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not get a response. Please try again.';

      this.messages.push({ role: 'assistant', content: reply });

    } catch (error) {
      this.messages.push({
        role: 'assistant',
        content: 'Something went wrong. Please check your connection and try again.'
      });
    } finally {
      this.isTyping = false;
    }
  }

  // ── Auto scroll to latest message ────────────────────
  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}