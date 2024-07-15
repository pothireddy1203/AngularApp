// src/app/user-form/user-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEdit = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.isEdit = true;
        this.userService.getUserById(this.userId).subscribe((user: User) => {
          this.userForm.patchValue(user);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (this.isEdit) {
        this.userService.updateUser({ ...user, id: this.userId! }).subscribe(() => this.router.navigate(['/users']));
      } else {
        this.userService.createUser(user).subscribe(() => this.router.navigate(['/users']));
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
