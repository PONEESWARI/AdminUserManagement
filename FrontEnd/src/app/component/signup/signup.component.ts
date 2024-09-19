// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import {MatInputModule} from '@angular/material/input';
// import {MatSelectModule} from '@angular/material/select';
// import {MatCardModule} from '@angular/material/card';
// import { UserService } from '../../services/user.service'; 
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [MatInputModule,ReactiveFormsModule,MatSelectModule,MatCardModule],
//   templateUrl: './signup.component.html',
//   styleUrl: './signup.component.css'
// })
// export class SignupComponent {
//   signupForm: FormGroup;

//   constructor(private fb: FormBuilder,
//     private route: Router,private userService: UserService,

//   ) {
//     this.signupForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       mobile: ['', [Validators.required , Validators.pattern('^[0-9]{10}$')]],
//       password: ['', Validators.required],
//       role: ['', Validators.required]
//     });
//   }
  
//   onSubmit() {
//     console.log("submittt",this.signupForm.valid);
//     if (this.signupForm.valid) {
//       console.log('Form Submitted', this.signupForm.value);
//       this.userService.signup(this.signupForm.value).subscribe({
//         next: (response) => {
//           console.log('Signup successful', response);
//           this.route.navigate(['login']); // Navigate to login page upon successful signup
//         },
//         error: (error) => {
//           console.error('Signup error', error);
//         }
//       });
//     }
//   }
//   loginpage(){
//     this.route.navigate(['login'])
//   }
// }
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatCardModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')], [this.mobileAsyncValidator()]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  // Async validator for checking if the email is taken
  emailAsyncValidator(): AsyncValidatorFn {
    console.log("fdnvjkfn");
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return control.value ? this.userService.isEmailTaken(control.value).pipe(
        debounceTime(300),
        map(isTaken => (isTaken ? { emailTaken: true } : null)),
        catchError(() => of(null))
      ) : of(null);
    };
  }

  // Async validator for checking if the mobile number is taken
  mobileAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return control.value ? this.userService.isMobileTaken(control.value).pipe(
        debounceTime(300),
        map(isTaken => (isTaken ? { mobileTaken: true } : null)),
        catchError(() => of(null))
      ) : of(null);
    };
  }

  // Submit form
  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
      this.userService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.route.navigate(['login']); // Navigate to login page upon successful signup
        },
        error: (error) => {
          console.error('Signup error', error);
        }
      });
    }
  }

  // Navigate to login page
  loginpage() {
    this.route.navigate(['login']);
  }
}
