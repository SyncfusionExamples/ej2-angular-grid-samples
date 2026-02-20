import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('angular-client');
  private router = inject(Router);
  ngOnInit(): void {
    this.router.navigate(['doctors']);
  }
} 