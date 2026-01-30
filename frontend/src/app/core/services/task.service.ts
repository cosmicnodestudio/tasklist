import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(status?: TaskStatus, priority?: TaskPriority, categoryId?: number): Observable<Task[]> {
    let params = new HttpParams();

    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    if (categoryId) params = params.set('categoryId', categoryId.toString());

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, request);
  }

  updateTask(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
