import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule, // Add CommonModule
    // HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ]
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]> = of([]); // Initialize with empty array
  filteredUsers: User[] = []; // Store filtered users directly
  searchForm: FormGroup;
  filterForm: FormGroup;

  roles: string[] = ['Admin', 'User']; // Example roles
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'role']; // Columns to display

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.filterForm = this.fb.group({
      role: ['']
    });

    // Initialize users$ and filteredUsers$ after the constructor is done
    this.users$ = this.http.get<User[]>('http://localhost:5000/api/auth/users').pipe(
      map(users => users || []) // Ensure it's never null
    );
  }

  ngOnInit() {
    this.users$.subscribe(users => {
      this.filteredUsers = users;
      console.log(" this.filteredUsers ", this.filteredUsers );
    });

    this.searchForm.get('search')?.valueChanges.subscribe(searchTerm => {
      console.log(searchTerm,'teee');
      
      this.apply(searchTerm, this.filterForm.get('role')?.value);
    });

    // this.filterForm.get('role')?.valueChanges.subscribe(role => {
    // });
  }

  apply(searchTerm: string, role: string): void {
    this.users$.pipe(
      map(users => {
        // If no users or null, return an empty array
        if (!users) return [];
           console.log(users);
           // Filter users based on search term and role
           this.filteredUsers = users.filter(user =>
             (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user?.mobileNo?.includes(searchTerm)) &&
               (!role || user.role === role)
        );
        console.log("filtervalueeeee",this.filteredUsers);
        return this.filteredUsers; // Ensure return value

      })
    ).subscribe(filtered => {
      // Update the filteredUsers property
      this.filteredUsers = filtered;
    });
  }
}
