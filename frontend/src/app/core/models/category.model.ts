export interface Category {
  id: number;
  name: string;
  color: string;
  createdAt: Date | string;
  taskCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}
