import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  userId: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(page: number = 1, pageSize: number = 5) {
    return this.http.get<PaginatedResponse<TaskItem>>(`${environment.apiUrl}/tasks?page=${page}&pageSize=${pageSize}`);
  }

  addTask(data: { title: string; description: string }) {
    return this.http.post<TaskItem>(`${environment.apiUrl}/tasks`, data);
  }

  completeTask(id: number) {
    return this.http.put<TaskItem>(`${environment.apiUrl}/tasks/${id}/complete`, {});
  }

  deleteTask(id: number) {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`, { responseType: 'text' });
  }
}
