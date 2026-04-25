import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  private readonly http = inject(HttpClient);
  value = '';
  response = signal<string | null>(null);
  error = signal<string | null>(null);

  submit() {
    const inputValue = this.value;

    if (!inputValue) {
      this.error.set('Please enter a number.');
      this.response.set(null);
      return;
    }

    this.error.set(null);
    this.response.set('Loading...');

    this.http
      .get('http://localhost:8080/api/trading/login', {
        params: { clientCode: inputValue },
        responseType: 'text',
      })
      .subscribe({
        next: (result) => this.response.set(this.formatResult(result)),
        error: (err) => this.error.set(err?.message ?? 'Request failed'),
      });
  }

  private formatResult(result: unknown) {
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  }
}
