import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Task } from '../../core/models/task.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">TaskList</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ currentUser?.username }}</span>
            <button (click)="logout()" class="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div class="text-sm opacity-90">Total Tasks</div>
            <div class="text-3xl font-bold mt-2">{{ tasks.length }}</div>
          </div>
          <div class="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div class="text-sm opacity-90">To Do</div>
            <div class="text-3xl font-bold mt-2">{{ getTaskCountByStatus('Todo') }}</div>
          </div>
          <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div class="text-sm opacity-90">In Progress</div>
            <div class="text-3xl font-bold mt-2">{{ getTaskCountByStatus('InProgress') }}</div>
          </div>
          <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div class="text-sm opacity-90">Completed</div>
            <div class="text-3xl font-bold mt-2">{{ getTaskCountByStatus('Done') }}</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="flex space-x-4">
            <button (click)="openNewTaskModal()" class="btn btn-primary">
              + New Task
            </button>
            <a routerLink="/tasks" class="btn btn-secondary">
              View All Tasks
            </a>
          </div>
        </div>

        <!-- Recent Tasks -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 class="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div class="space-y-3">
              <div *ngFor="let task of recentTasks" class="card hover:shadow-lg transition-shadow cursor-pointer" (click)="viewTask(task.id)">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                    <div class="flex items-center space-x-2 mt-2">
                      <span [class]="'text-xs px-2 py-1 rounded-full ' + getStatusClass(task.status)">
                        {{ task.status }}
                      </span>
                      <span [class]="'text-xs px-2 py-1 rounded-full ' + getPriorityClass(task.priority)">
                        {{ task.priority }}
                      </span>
                      <span *ngIf="task.categoryName" class="text-xs px-2 py-1 rounded-full" [style.background-color]="task.categoryColor" [style.color]="'white'">
                        {{ task.categoryName }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div *ngIf="recentTasks.length === 0" class="text-center text-gray-500 py-8">
                No tasks yet. Create your first task!
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Categories</h2>
              <button (click)="showCategoryForm = true" class="text-sm btn btn-primary">+ New Category</button>
            </div>
            <div class="space-y-3">
              <div *ngFor="let category of categories" class="card hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 rounded-full" [style.background-color]="category.color"></div>
                    <span class="font-medium">{{ category.name }}</span>
                  </div>
                  <button (click)="deleteCategory(category.id)" class="text-red-600 hover:text-red-800 text-sm">×</button>
                </div>
              </div>
              <div *ngIf="categories.length === 0" class="text-center text-gray-500 py-8">
                No categories yet. Click "New Category" to create one!
              </div>
            </div>
          </div>
        </div>

        <!-- Category Form Modal -->
        <div *ngIf="showCategoryForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-semibold mb-4">New Category</h3>
            <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
              <div class="space-y-4">
                <div>
                  <label class="label">Name</label>
                  <input type="text" formControlName="name" class="input" placeholder="e.g., Work, Personal, Shopping" />
                </div>
                <div>
                  <label class="label">Color</label>
                  <div class="flex gap-2 flex-wrap">
                    <button *ngFor="let color of colorOptions" type="button"
                            (click)="categoryForm.patchValue({color: color})"
                            [class]="'w-8 h-8 rounded-full border-2 transition-all ' + (categoryForm.value.color === color ? 'border-gray-900 scale-110' : 'border-transparent')"
                            [style.background-color]="color">
                    </button>
                  </div>
                  <input type="text" formControlName="color" class="input mt-2" placeholder="Or enter custom hex color" />
                </div>
              </div>
              <div class="flex space-x-3 mt-6">
                <button type="submit" [disabled]="!categoryForm.valid" class="btn btn-primary flex-1">
                  Create
                </button>
                <button type="button" (click)="closeCategoryForm()" class="btn btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  recentTasks: Task[] = [];
  categories: Category[] = [];
  currentUser = this.authService.getCurrentUser();
  showCategoryForm = false;
  categoryForm: FormGroup;
  colorOptions = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3B82F6', Validators.required]
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
        this.recentTasks = tasks.slice(0, 5);
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

  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
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

  viewTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  openNewTaskModal(): void {
    this.router.navigate(['/tasks']);
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryForm();
        },
        error: (error) => console.error('Error creating category:', error)
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }

  closeCategoryForm(): void {
    this.showCategoryForm = false;
    this.categoryForm.reset({ color: '#3B82F6' });
  }

  logout(): void {
    this.authService.logout();
  }
}
