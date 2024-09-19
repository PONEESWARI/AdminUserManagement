import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatCardModule, FormsModule],
  // providers:[provideHttpClient()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log('Form Submitted', this.loginForm.value);

      // Example HTTP request (adjust URL and payload as needed)
      this.http.post('http://localhost:5000/api/auth/login', this.loginForm.value).subscribe({
        next:(response:any)=>{
          console.log('Login successful', response);
          localStorage.setItem('token',response.token);
          this.router.navigate(['/users']); // Navigate to another route on success
      },
      error: (error) => {
        console.error('Login error', error);
        // Capture the error message and display it
        if (error.status === 400) {
          this.errorMessage = 'Invalid email or password'; // Custom error message
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    }
      );
    }
  }
}
