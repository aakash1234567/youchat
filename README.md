# You Chat Application

This is a simple group chat POC built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Login, Logout)
- Admin User Management (Create, Edit Users)
- Group Management (Create, Delete, Search, Add Members)
- Messaging in Groups (Send Messages, Like Messages)

## Prerequisites

- Node.js >= 18 LTS
- MongoDB

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aakash1234567/youchat.git
cd youchat
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
MONGO_URI=mongodb://localhost:27017/youchat
JWT_SECRET=very_secret_token
```

4. Please Ensure MongoDB is running on your system.

5. Start the server:

```
npm start
```

## Testing

```
npm test
```
