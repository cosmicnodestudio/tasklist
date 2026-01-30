import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a routerLink="/tasks" class="text-gray-600 hover:text-gray-900">← Back to Tasks</a>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div *ngIf="task" class="card">
          <h1 class="text-3xl font-bold mb-4">{{ task.title }}</h1>
          <p class="text-gray-700 mb-6">{{ task.description }}</p>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span class="label">Status</span>
              <span [class]="'inline-block px-3 py-1 rounded-full ' + getStatusClass(task.status)">
                {{ task.status }}
              </span>
            </div>
            <div>
              <span class="label">Priority</span>
              <span [class]="'inline-block px-3 py-1 rounded-full ' + getPriorityClass(task.priority)">
                {{ task.priority }}
              </span>
            </div>
            <div *ngIf="task.dueDate">
              <span class="label">Due Date</span>
              <p>{{ formatDate(task.dueDate) }}</p>
            </div>
            <div *ngIf="task.categoryName">
              <span class="label">Category</span>
              <span class="inline-block px-3 py-1 rounded-full text-white" [style.background-color]="task.categoryColor">
                {{ task.categoryName }}
              </span>
            </div>
          </div>

          <div class="border-t pt-4">
            <p class="text-sm text-gray-500">Created: {{ formatDate(task.createdAt) }}</p>
            <p class="text-sm text-gray-500">Updated: {{ formatDate(task.updatedAt) }}</p>
            <p *ngIf="task.completedAt" class="text-sm text-gray-500">Completed: {{ formatDate(task.completedAt) }}</p>
          </div>
        </div>
      </main>
    </div>
  `
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask(id);
  }

  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.router.navigate(['/tasks']);
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Todo': 'bg-yellow-100 text-yellow-800',
      'InProgress': 'bg-blue-100 text-blue-800',
      'Done': 'bg-green-100 text-green-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}
