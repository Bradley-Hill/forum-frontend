# Forum API Contract

This document defines the contract between frontend and backend for all API endpoints.  
**Types are enforced via Zod schemas from `@Bradley-Hill/forum-schemas`.**

---

## **Auth Endpoints**

### POST `/api/auth/register`
- **Request:**  
  Body:  
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
  Zod: `userRegisterSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "username": "string",
      "email": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### POST `/api/auth/login`
- **Request:**  
  Body:  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
  Zod: `userLoginSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### POST `/api/auth/refresh`
- **Request:**  
  Body:  
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "accessToken": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### POST `/api/auth/logout`
- **Request:**  
  Body:  
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:**  
  Success:  
  ```json
  {
    "data": { "message": "Logged out successfully" }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

## **Category Endpoints**

### GET `/api/categories`
- **Response:**  
  Success:  
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "slug": "string",
        "name": "string",
        "description": "string"
      }
    ]
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### POST `/api/categories` (admin only)
- **Request:**  
  Body:  
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
  Zod: `categoryCreateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "slug": "string",
      "name": "string",
      "description": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/categories/:id` (admin only)
- **Request:**  
  Body:  
  ```json
  {
    "name": "string (optional)",
    "description": "string (optional)"
  }
  ```
  Zod: `categoryUpdateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "slug": "string",
      "name": "string",
      "description": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### DELETE `/api/categories/:id` (admin only)
- **Response:**  
  Success: `204 No Content`  
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### GET `/api/categories/:slug/threads`
- **Request:**  
  Query: `?page=number&pageSize=number`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "category": {
        "id": "uuid",
        "slug": "string",
        "name": "string"
      },
      "threads": [
        {
          "id": "uuid",
          "title": "string",
          "is_sticky": true,
          "is_locked": false,
          "created_at": "ISODate",
          "updated_at": "ISODate",
          "author": { "id": "uuid", "username": "string" },
          "reply_count": 0,
          "category_id": "uuid"
        }
      ],
      "pagination": {
        "page": 1,
        "pageSize": 20,
        "totalThreads": 42,
        "totalPages": 3
      }
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

## **Thread Endpoints**

### GET `/api/threads/:id`
- **Request:**  
  Query: `?page=number&pageSize=number`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "thread": {
        "id": "uuid",
        "title": "string",
        "is_sticky": true,
        "is_locked": false,
        "created_at": "ISODate",
        "updated_at": "ISODate",
        "author": { "id": "uuid", "username": "string" },
        "reply_count": 0,
        "category_id": "uuid"
      },
      "posts": [
        {
          "id": "uuid",
          "thread_id": "uuid",
          "author": { "id": "uuid", "username": "string" },
          "content": "string",
          "created_at": "ISODate",
          "updated_at": "ISODate"
        }
      ],
      "pagination": {
        "page": 1,
        "pageSize": 20,
        "totalPosts": 35,
        "totalPages": 2
      }
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### POST `/api/threads` (auth required)
- **Request:**  
  Body:  
  ```json
  {
    "category_id": "uuid",
    "title": "string",
    "content": "string"
  }
  ```
  Zod: `threadCreateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "category_id": "uuid",
      "title": "string",
      "is_sticky": false,
      "is_locked": false,
      "created_at": "ISODate",
      "updated_at": "ISODate",
      "author": { "id": "uuid", "username": "string" },
      "reply_count": 0
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/threads/:id` (auth required, author or admin)
- **Request:**  
  Body:  
  ```json
  {
    "title": "string"
  }
  ```
  Zod: `threadUpdateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "category_id": "uuid",
      "title": "string",
      "is_sticky": false,
      "is_locked": false,
      "created_at": "ISODate",
      "updated_at": "ISODate",
      "author": { "id": "uuid", "username": "string" },
      "reply_count": 0
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/threads/:id/lock` (admin only)
- **Request:**  
  Body:  
  ```json
  {
    "is_locked": true
  }
  ```
  Zod: `threadLockSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": { ...Thread }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/threads/:id/sticky` (admin only)
- **Request:**  
  Body:  
  ```json
  {
    "is_sticky": true
  }
  ```
  Zod: `threadStickySchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": { ...Thread }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### DELETE `/api/threads/:id` (auth required, author or admin)
- **Response:**  
  Success: `204 No Content`  
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

## **Post Endpoints**

### POST `/api/posts` (auth required)
- **Request:**  
  Body:  
  ```json
  {
    "thread_id": "uuid",
    "content": "string"
  }
  ```
  Zod: `postCreateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "thread_id": "uuid",
      "author": { "id": "uuid", "username": "string" },
      "content": "string",
      "created_at": "ISODate",
      "updated_at": "ISODate"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/posts/:id` (auth required, author or admin)
- **Request:**  
  Body:  
  ```json
  {
    "content": "string"
  }
  ```
  Zod: `postUpdateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "thread_id": "uuid",
      "author": { "id": "uuid", "username": "string" },
      "content": "string",
      "created_at": "ISODate",
      "updated_at": "ISODate"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### DELETE `/api/posts/:id` (auth required, author or admin)
- **Response:**  
  Success: `204 No Content`  
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

## **User Endpoints**

### GET `/api/users/me` (auth required)
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "member" | "admin",
      "created_at": "ISODate"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### GET `/api/users/:username`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "username": "string",
      "role": "member" | "admin",
      "created_at": "ISODate"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### PATCH `/api/users/me` (auth required)
- **Request:**  
  Body:  
  ```json
  {
    "email": "string (optional)",
    "currentPassword": "string (required if changing password)",
    "newPassword": "string (optional)"
  }
  ```
  Zod: `userUpdateSchema`
- **Response:**  
  Success:  
  ```json
  {
    "data": {
      "id": "uuid",
      "username": "string",
      "email": "string"
    }
  }
  ```
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

### DELETE `/api/users/me` (auth required)
- **Response:**  
  Success: `204 No Content`  
  Error:  
  ```json
  {
    "error": { "message": "string", "code": "string" }
  }
  ```

---

## **General Notes**

- All error responses:  
  ```json
  { "error": { "message": "string", "code": "string" } }
  ```
- All success responses:  
  ```json
  { "data": ... }
  ```
- Use Zod schemas from `@Bradley-Hill/forum-schemas` for validation and type inference in both frontend and backend.
- All date fields are ISO strings.

---