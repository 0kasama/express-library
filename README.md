# <center>Library Management Server</center>

<center>A RESTful API for a library management system using Express.js and PostgreSQL.</center>
<br>

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [SQL File](#sql-file)

# Features

- List All Books with Their Current Stock
- Register New Member
- Create New Book Borrowing
- Process Book Return
- Get Member's Borrowing History
- Borrowing Process:
  - Verify book availability (stock > 0)
  - Check member's current borrowing count (≤ 3)
  - Use database transaction for:
    - Decreasing book stock
    - Creating borrowing record
- Return Process:
  - Verify borrowing record exists
  - Verify book belongs to member
  - Use database transaction for:
    - Increasing book stock
    - Updating borrowing status and return date

# Installation

## Requirements

- [Node.js >= 20.16.0 / LTS](https://nodejs.org/en/download/)
- [PostgreSQL >= 16.2](https://www.postgresql.org/download/)
- [TablePlus](https://tableplus.com/) or any other database management tools

## Step-by-step How to Run the App Locally

1. Clone the repository

```bash
git clone https://github.com/your-username/express-library.git
cd express-library
```

2. Create database and import the SQL file using your database management tools or you can do it like this

```bash
createdb -U <your-postgres-user-name> <database-name>
psql -U <your-postgres-user-name> -d <database-name> -f ./public/database.sql
```

3. Install dependencies

```bash
npm install
```

4. Copy the .env.example file to .env

```bash
cp .env.example .env
```

5. Start the server

```bash
npm run dev
```

# API Documentation

You also can find the API documentation [here](https://documenter.getpostman.com/view/33075962/2sAYHwKjuJ).

## 1. List All Books

### Request
| Metode |     URL      |               Description               |
| :----: | :----------: | :-------------------------------------: |
| `GET`  | `/api/books` | List all books with their current stock |

### Query Parameters
- `title`: Filter books by title (optional)
- `author`: Filter books by author (optional)
- `page`: Page number (default: 1)
- `limit`: Number of books per page (default: 10)

### Validations
- Check `title` case insensitive and matches with book title
- Check `author` case insensitive and matches with book author

### Response

```json
{
    "data": [
        {
            "id": "9e718d75-8ede-41ee-b61f-e2b9f566a9bc",
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "published_year": 1925,
            "stock": 5,
            "isbn": "9780743273565",
            "available": true
        },
        {
            "id": "0b6cce0b-cecf-4ced-87d6-703671e413dc",
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "published_year": 1960,
            "stock": 3,
            "isbn": "9780446310789",
            "available": true
        }
    ],
    "pagination": {
        "total": 20,
        "page": "1",
        "limit": "2",
        "totalPages": 10
    }
}
```

## 2. Register New Member

### Request
| Metode |      URL       |      Description      |
| :----: | :------------: | :-------------------: |
| `POST` | `/api/members` | Register a new member |

### Body
```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
}
```

### Validations
- `All fields are required`
- `email`: Must be unique and valid format
- `phone`: Must be valid format

### Response

```json
{
    "id": "ab1e95ee-cc70-45d3-ac56-e256e88c5801",
    "name": "New Member",
    "email": "newmember@mail.com",
    "phone": "62812345678",
    "address": "123 Main St, City",
    "created_at": "2024-12-11T20:45:17.059Z",
    "updated_at": "2024-12-11T20:45:17.059Z"
}
```

## 3. Create New Book Borrowing

### Request
| Metode |        URL        |         Description         |
| :----: | :---------------: | :-------------------------: |
| `POST` | `/api/borrowings` | Create a new book borrowing |

### Body
```json
{
    "book_id": "uuid",
    "member_id": "uuid"
}
```

### Validations
- Check book stock, `must be > 0`
- Member cannot borrow more than `3 books`
- Update book stock `- 1`
- `status`: default `BORROWED`
- `borrow_date`: default `current date`

### Response

```json
{
    "id": "dce78802-bd45-429a-baa8-c11e4cb6591d",
    "book_id": "85e02293-b59b-4705-83d0-fda0ad1845d7",
    "member_id": "8fdc38fb-4008-4e16-bdb4-f2c08e0bf971",
    "borrow_date": "2024-12-11T17:00:00.000Z",
    "return_date": null,
    "status": "BORROWED",
    "created_at": "2024-12-11T20:46:44.024Z",
    "updated_at": "2024-12-11T20:46:44.024Z"
}
```

## 4. Process Book Return

### Request
| Metode |             URL              |     Description     |
| :----: | :--------------------------: | :-----------------: |
| `PUT`  | `/api/borrowings/:id/return` | Process book return |

### Path Parameter
|  Key  |     Value      |
| :---: | :------------: |
| `id`  | `borrowing id` |

### Validations
- Check `status` is `BORROWED`
- Update `status` to `RETURNED`
- Update `return_date` to `current date`
- Update book stock `+ 1`

### Response

```json
{
    "id": "dce78802-bd45-429a-baa8-c11e4cb6591d",
    "book_id": "85e02293-b59b-4705-83d0-fda0ad1845d7",
    "member_id": "8fdc38fb-4008-4e16-bdb4-f2c08e0bf971",
    "borrow_date": "2024-12-11T17:00:00.000Z",
    "return_date": "2024-12-11T17:00:00.000Z",
    "status": "RETURNED",
    "created_at": "2024-12-11T20:46:44.024Z",
    "updated_at": "2024-12-11T20:46:44.024Z"
}
```

## 5. Get Member's Borrowing History

### Request

| Metode |              URL              |          Description           |
| :----: | :---------------------------: | :----------------------------: |
| `GET`  | `/api/members/:id/borrowings` | Get member's borrowing history |

### Path Parameter
|  Key  |    Value    |
| :---: | :---------: |
| `id`  | `member id` |

### Query Parameters
- `status`: Filter borrowings by status (optional, `BORROWED` or `RETURNED`)
- `page`: Page number (default: 1)
- `limit`: Number of borrowings per page (default: 10)

### Validations
- Check `status` is `BORROWED` or `RETURNED`
- Response includes book `title, author, published_year, isbn`

# [SQL File](./public/database.sql)
Contains the SQL schema and sample data.