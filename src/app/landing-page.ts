import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-landing-page',
  template: `
    <section class="landing-page">
      <h1>Landing Page</h1>
      <form (ngSubmit)="submit()" class="landing-form">
        <label>
          Number
          <input
            type="String"
            [(ngModel)]="value"
            name="numberInput"
            required
            autocomplete="off"
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      <p *ngIf="response() as res" class="response">Response: {{ res }}</p>
      <p *ngIf="error() as err" class="error">{{ err }}</p>
    </section>
  `,
  styles: [
    `
      .landing-page {
        max-width: 460px;
        margin: 3rem auto;
        padding: 1.5rem;
        border: 1px solid #d0d0d0;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        font-family: Inter, system-ui, sans-serif;
        background: #fff;
      }

      .landing-page h1 {
        margin: 0 0 1rem;
        font-size: 1.9rem;
      }

      .landing-form {
        display: grid;
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-weight: 600;
      }

      input {
        width: 100%;
        padding: 0.85rem 1rem;
        border-radius: 12px;
        border: 1px solid #c6c6c6;
        font-size: 1rem;
      }

      button {
        padding: 0.95rem 1.25rem;
        border: none;
        border-radius: 12px;
        background: #2563eb;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      button:hover {
        background: #1d4ed8;
      }

      .response,
      .error {
        margin: 0;
        white-space: pre-wrap;
      }

      .error {
        color: #b91c1c;
      }
    `,
  ],
})
export class LandingPage {
  private readonly http = inject(HttpClient);
  value = "";
  response = signal<string | null>(null);
  error = signal<string | null>(null);

  submit() {
    const inputValue = this.value.trim();

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
      responseType: 'text'
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
