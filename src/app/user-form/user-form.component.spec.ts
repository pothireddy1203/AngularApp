// src/app/user-form/user-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/core';
import { of } from 'rxjs';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [UserFormComponent, MatError],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jasmine.createSpy('getUserById').and.returnValue(of({ id: 1, username: 'user1', email: 'user1@example.com' })),
            createUser: jasmine.createSpy('createUser').and.returnValue(of({ id: 1, username: 'user1', email: 'user1@example.com' })),
            updateUser: jasmine.createSpy('updateUser').and.returnValue(of({ id: 1, username: 'user1', email: 'user1@example.com' })),
            deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(null))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with username and email controls', () => {
    expect(component.userForm.contains('username')).toBeTrue();
    expect(component.userForm.contains('email')).toBeTrue();
  });

  it('should make the username control required', () => {
    const control = component.userForm.get('username');
    control.setValue('');
    expect(control?.valid).toBeFalse();
  });

  it('should make the email control required and validate email format', () => {
    const control = component.userForm.get('email');
    control.setValue('');
    expect(control?.valid).toBeFalse();
    control.setValue('invalid-email');
    expect(control?.valid).toBeFalse();
    control.setValue('valid-email@example.com');
    expect(control?.valid).toBeTrue();
  });

  it('should call createUser when the form is valid and submitted', () => {
    component.userForm.setValue({ username: 'user1', email: 'user1@example.com' });
    component.onSubmit();
    expect(userService.createUser).toHaveBeenCalled();
  });

  it('should call updateUser when the form is valid and submitted in edit mode', () => {
    component.isEdit = true;
    component.userId = 1;
    component.userForm.setValue({ username: 'user1', email: 'user1@example.com' });
    component.onSubmit();
    expect(userService.updateUser).toHaveBeenCalled();
  });
});
