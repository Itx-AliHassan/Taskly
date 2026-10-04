# React Native Todo App — Class Assignment

A complete, full-stack Todo application built with React Native (Expo) and Node.js/Express + MongoDB. Features user authentication with JWT, secure user-isolated todo management, and a modern dark theme.

---

## 📱 Tech Stack

### Mobile Application (`mobile/`)
* **Framework**: React Native with Expo (Expo Go)
* **Language**: JavaScript (ES6+)
* **Navigation**: React Navigation (Native Stack)
* **HTTP Client**: Axios (with Bearer Token Interceptor)
* **Persistence**: AsyncStorage (JWT authentication tokens)
* **Styling**: React Native StyleSheet with custom dark palette

### Backend API (`backend/`)
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Security & Auth**: JSON Web Tokens (JWT) & bcrypt password hashing
* **Configuration**: dotenv, CORS

---

## 📁 Project Structure

```text
TodoApp/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── todo.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Todo.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── todo.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── mobile/
│   ├── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppButton.jsx
│   │   │   ├── EmptyTodos.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── TodoInput.jsx
│   │   │   └── TodoItem.jsx
│   │   ├── constants/
│   │   │   └── colors.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── navigation/
│   │   │   └── AppNavigator.jsx
│   │   ├── screens/
│   │   │   ├── AddTodoScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   └── TodoScreen.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── storage.js
│   ├── App.jsx
│   ├── app.json
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Backend Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure your MongoDB connection string in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=supersecretjwtkey_todo_app_class_assignment_2026
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   You will see:
   ```text
   🚀 Server running on http://0.0.0.0:5000
   📱 Local network access: http://192.168.100.167:5000
   ✅ MongoDB Connected
   ```

---

### 2. Mobile Setup (Android + Expo Go)

1. Open a new terminal in the `mobile/` directory:
   ```bash
   cd mobile
   ```
2. Verify that `mobile/src/services/api.js` points to your laptop's LAN IP address:
   ```javascript
   export const API_BASE_URL = 'http://192.168.100.167:5000/api';
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```
4. Open **Expo Go** on your Android phone (connected to the same Wi-Fi) and tap **Scan QR code**.

---

## 🔒 Security Architecture

* **Password Hashing**: Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (10 rounds) before persistence.
* **User Isolation**: Every todo is linked to a specific user via `userId`. The backend strictly uses `req.user._id` derived from the verified JWT token to perform queries (`find`, `create`, `update`, `delete`). Users can never access or modify another user's tasks.
* **Token Verification**: Protected routes use the `protect` middleware to reject invalid, expired, or missing tokens.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user account
* `POST /api/auth/login` — Sign in and receive JWT token
* `GET /api/auth/me` — Get current logged-in user profile (Protected)

### Todos (`/api/todos`) — All Protected
* `GET /api/todos` — Get all todos belonging to logged-in user
* `POST /api/todos` — Create a new todo (`title`, `description`)
* `PUT /api/todos/:id` — Update todo details (`title`, `description`)
* `PATCH /api/todos/:id/toggle` — Toggle completion status
* `DELETE /api/todos/:id` — Delete todo

---

## 🎓 Teacher Viva & Demonstration Questions

### 1. What is React Native?
React Native is an open-source framework by Meta that allows developers to build native iOS and Android mobile apps using JavaScript and React. It renders native platform UI components rather than webviews.

### 2. What is Expo?
Expo is an ecosystem and framework built on top of React Native that streamlines development. It provides pre-configured native modules and tools like Expo Go, eliminating the need to write complex native code or install Android Studio during development.

### 3. Why can't a physical phone use `localhost`?
`localhost` (127.0.0.1) refers to the loopback address of the device making the request. When your phone calls `localhost:5000`, it asks itself for the server. To reach your laptop where the backend runs, the phone must call your laptop's Local Area Network (LAN) IP (e.g., `http://192.168.100.167:5000`).

### 4. How does a Todo belong to a User?
In the MongoDB schema, each Todo document contains a `userId` field referencing the `_id` of the User document. When a request is made, the verified JWT supplies `req.user._id`, and the backend queries `Todo.find({ userId: req.user._id })`.

### 5. Why can't we trust the `userId` from the mobile app?
If the backend trusted a `userId` sent in the request body, a malicious user could tamper with the request and send another person's user ID to view, modify, or delete their private tasks. By extracting the ID from a cryptographically signed JWT, we guarantee identity integrity.

### 6. Why do we use AsyncStorage?
Mobile applications do not have browser `localStorage` or `sessionStorage`. `AsyncStorage` is an asynchronous, unencrypted, key-value storage system for React Native used to persist data across app restarts, such as the JWT token.
