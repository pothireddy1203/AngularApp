// src/app/services/user.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all users from the API via GET', () => {
    const dummyUsers: User[] = [
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should retrieve a user by id from the API via GET', () => {
    const dummyUser: User = { id: 1, username: 'user1', email: 'user1@example.com' };

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should create a user via POST', () => {
    const newUser: User = { id: 3, username: 'user3', email: 'user3@example.com' };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should update a user via PUT', () => {
    const updatedUser: User = { id: 1, username: 'user1_updated', email: 'user1_updated@example.com' };

    service.updateUser(updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should delete a user via DELETE', () => {
    service.deleteUser(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
