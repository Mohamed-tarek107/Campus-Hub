import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface ChatBotResponse {
  message: string;
  newHistory: ChatHistoryItem[];
}

@Injectable({
  providedIn: 'root',
})
export class GpaCalcService {
  private readonly gpaApi = `${environment.apiUrl}/gpa`;

  constructor(private http: HttpClient) {}

  editUserGpa(gpa: number) {
    return this.http.post(`${this.gpaApi}/assginGpa`,
      { gpa }
    );
  }

  chatBot(msg: string, history: ChatHistoryItem[]) {
    return this.http.post<ChatBotResponse>(`${this.gpaApi}/aiChat`,
      { msg, history }
    );
  }
}
