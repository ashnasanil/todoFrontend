import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TaskService, TaskItem } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tasks = signal<TaskItem[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  errorMessage = signal<string>('');

  taskForm: FormGroup;
  
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.currentPage()).subscribe({
      next: (res) => {
        this.tasks.set(res.items);
        this.currentPage.set(res.currentPage);
        this.totalPages.set(res.totalPages);
        this.totalItems.set(res.totalItems);
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadTasks();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadTasks();
    }
  }

  addTask() {
    this.errorMessage.set('');
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const data = {
        title: formValue.title,
        description: formValue.description || ''
      };
      
      this.taskService.addTask(data).subscribe({
        next: () => {
          this.taskForm.reset({ title: '', description: '' });
          this.currentPage.set(1); // Go to first page to see new task
          this.loadTasks();
        },
        error: (err) => this.errorMessage.set('Failed to add task: ' + (err.error?.message || err.message))
      });
    }
  }

  completeTask(id: number) {
    this.errorMessage.set('');
    this.taskService.completeTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => this.errorMessage.set('Failed to complete task: ' + (err.error?.message || err.message))
    });
  }

  deleteTask(id: number) {
    this.errorMessage.set('');
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        if (err.status === 404 || err.status === 500) {
           this.loadTasks();
        } else {
           this.errorMessage.set('Failed to delete task: ' + (err.error?.message || err.message));
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}