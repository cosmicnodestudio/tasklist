import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { CategoryService } from '../../../core/services/category.service';
import { Task, TaskStatus, TaskPriority } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <a routerLink="/dashboard" class="text-gray-600 hover:text-gray-900">← Back</a>
            <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
          </div>
          <button (click)="logout()" class="btn btn-secondary">Logout</button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters and New Task Button -->
        <div class="mb-6 flex justify-between items-center">
          <div class="flex space-x-4">
            <select [(ngModel)]="filterPriority" (change)="applyFilters()" class="input max-w-xs">
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <button (click)="showTaskForm = true" class="btn btn-primary">+ New Task</button>
        </div>

        <!-- Task Form Modal -->
        <div *ngIf="showTaskForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-semibold mb-4">{{ editingTask ? 'Edit Task' : 'New Task' }}</h3>
            <form [formGroup]="taskForm" (ngSubmit)="saveTask()">
              <div class="space-y-4">
                <div>
                  <label class="label">Title</label>
                  <input type="text" formControlName="title" class="input" />
                </div>
                <div>
                  <label class="label">Description</label>
                  <textarea formControlName="description" rows="3" class="input"></textarea>
                </div>
                <div>
                  <label class="label">Priority</label>
                  <select formControlName="priority" class="input">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div *ngIf="editingTask">
                  <label class="label">Status</label>
                  <select formControlName="status" class="input">
                    <option value="Todo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label class="label">Due Date</label>
                  <input type="date" formControlName="dueDate" class="input" />
                </div>
                <div>
                  <label class="label">Category</label>
                  <select formControlName="categoryId" class="input">
                    <option [ngValue]="null">No Category</option>
                    <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>
              <div class="flex space-x-3 mt-6">
                <button type="submit" [disabled]="!taskForm.valid" class="btn btn-primary flex-1">
                  {{ editingTask ? 'Update' : 'Create' }}
                </button>
                <button type="button" (click)="closeTaskForm()" class="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button *ngIf="editingTask" type="button" (click)="deleteTask(editingTask.id)" class="btn bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Kanban Board -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- To Do Column -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-gray-900 flex items-center">
                <span class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                To Do
                <span class="ml-2 text-sm text-gray-500">({{ getTasksByStatus('Todo').length }})</span>
              </h2>
              <button (click)="showTaskForm = true" class="text-gray-600 hover:text-gray-900 text-xl font-bold w-6 h-6 flex items-center justify-center">
                +
              </button>
            </div>
            <div class="space-y-3">
              <div *ngFor="let task of getTasksByStatus('Todo')"
                   class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div class="flex gap-3">
                  <div (click)="editTask(task)" class="cursor-pointer flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-gray-900 text-sm">{{ task.title }}</h3>
                      <span [class]="'text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ' + getPriorityClass(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <p *ngIf="task.description" class="text-xs text-gray-600 mb-2 line-clamp-2">{{ task.description }}</p>
                    <div class="flex flex-wrap gap-2 items-center">
                      <span *ngIf="task.categoryName" class="text-xs px-2 py-0.5 rounded-full"
                            [style.background-color]="task.categoryColor" [style.color]="'white'">
                        {{ task.categoryName }}
                      </span>
                      <span *ngIf="task.dueDate" class="text-xs text-gray-500">
                        📅 {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </div>
                  <button (click)="moveTask(task, 'InProgress'); $event.stopPropagation()"
                          class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded h-fit transition-colors flex-shrink-0">
                    ▶
                  </button>
                </div>
              </div>
              <div *ngIf="getTasksByStatus('Todo').length === 0"
                   class="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                No tasks
              </div>
            </div>
          </div>

          <!-- In Progress Column -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-gray-900 flex items-center">
                <span class="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                In Progress
                <span class="ml-2 text-sm text-gray-500">({{ getTasksByStatus('InProgress').length }})</span>
              </h2>
            </div>
            <div class="space-y-3">
              <div *ngFor="let task of getTasksByStatus('InProgress')"
                   class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div class="flex gap-3">
                  <div (click)="editTask(task)" class="cursor-pointer flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-gray-900 text-sm">{{ task.title }}</h3>
                      <span [class]="'text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ' + getPriorityClass(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <p *ngIf="task.description" class="text-xs text-gray-600 mb-2 line-clamp-2">{{ task.description }}</p>
                    <div class="flex flex-wrap gap-2 items-center">
                      <span *ngIf="task.categoryName" class="text-xs px-2 py-0.5 rounded-full"
                            [style.background-color]="task.categoryColor" [style.color]="'white'">
                        {{ task.categoryName }}
                      </span>
                      <span *ngIf="task.dueDate" class="text-xs text-gray-500">
                        📅 {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </div>
                  <button (click)="moveTask(task, 'Done'); $event.stopPropagation()"
                          class="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded h-fit transition-colors flex-shrink-0">
                    ✓
                  </button>
                </div>
              </div>
              <div *ngIf="getTasksByStatus('InProgress').length === 0"
                   class="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                No tasks
              </div>
            </div>
          </div>

          <!-- Done Column -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-gray-900 flex items-center">
                <span class="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                Done
                <span class="ml-2 text-sm text-gray-500">({{ getTasksByStatus('Done').length }})</span>
              </h2>
            </div>
            <div class="space-y-3">
              <div *ngFor="let task of getTasksByStatus('Done')"
                   (click)="editTask(task)"
                   class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer opacity-75">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-semibold text-gray-900 text-sm line-through">{{ task.title }}</h3>
                  <span [class]="'text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ' + getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </div>
                <p *ngIf="task.description" class="text-xs text-gray-600 mb-2 line-clamp-2">{{ task.description }}</p>
                <div class="flex flex-wrap gap-2 items-center">
                  <span *ngIf="task.categoryName" class="text-xs px-2 py-0.5 rounded-full"
                        [style.background-color]="task.categoryColor" [style.color]="'white'">
                    {{ task.categoryName }}
                  </span>
                  <span *ngIf="task.dueDate" class="text-xs text-gray-500">
                    📅 {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
              <div *ngIf="getTasksByStatus('Done').length === 0"
                   class="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                No tasks
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="tasks.length === 0" class="text-center text-gray-500 py-12">
          <p class="text-lg">No tasks found</p>
          <p class="text-sm mt-2">Create your first task to get started!</p>
        </div>
      </main>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  showTaskForm = false;
  editingTask: Task | null = null;
  taskForm: FormGroup;
  filterPriority = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['Medium', Validators.required],
      status: ['Todo'],
      dueDate: [''],
      categoryId: [null]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const priorityMatch = !this.filterPriority || task.priority === this.filterPriority;
      return priorityMatch;
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      if (this.editingTask) {
        this.taskService.updateTask(this.editingTask.id, this.taskForm.value).subscribe({
          next: () => {
            this.loadTasks();
            this.closeTaskForm();
          },
          error: (error) => console.error('Error updating task:', error)
        });
      } else {
        this.taskService.createTask(this.taskForm.value).subscribe({
          next: () => {
            this.loadTasks();
            this.closeTaskForm();
          },
          error: (error) => console.error('Error creating task:', error)
        });
      }
    }
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      categoryId: task.categoryId
    });
    this.showTaskForm = true;
  }

  moveTask(task: Task, newStatus: string): void {
    const updatedTask = {
      ...task,
      status: newStatus as TaskStatus
    };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => console.error('Error moving task:', error)
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.editingTask = null;
    this.taskForm.reset({ priority: 'Medium', status: 'Todo' });
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
    return new Date(date).toLocaleDateString();
  }

  logout(): void {
    this.authService.logout();
  }
}
