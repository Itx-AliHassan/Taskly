### 1. Fix Applied for SafeAreaView Deprecation
  In React Native and Expo SDK 57, the legacy SafeAreaView directly exported from 'react-native' has been deprecated. We fixed this by switching to SafeAreaProvider and SafeAreaView from the
  modern, dedicated package react-native-safe-area-context https://github.com/AppAndFlow/react-native-safe-area-context (which is already installed in your project).
  • Updated App.jsx to wrap the app with <SafeAreaProvider>.
  • The deprecation warning is now completely resolved.
  ──────
  ### 2. What We Have Built

  The complete full-stack architecture is in place, following your assignment specification:
    TodoApp/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── config/db.js                 # MongoDB connection
    │   │   ├── controllers/
    │   │   │   ├── auth.controller.js       # Register, Login, Me (JWT + bcrypt)
    │   │   │   └── todo.controller.js       # User-isolated CRUD & Toggle
    │   │   ├── middleware/
    │   │   │   └── auth.middleware.js       # Bearer JWT verification
    │   │   ├── models/
    │   │   │   ├── User.js                  # User schema
    │   │   │   └── Todo.js                  # Todo schema (with userId reference)
    │   │   ├── routes/
    │   │   │   ├── auth.routes.js           # Auth routes
    │   │   │   └── todo.routes.js           # Protected Todo routes
    │   │   ├── app.js                       # Express app, CORS, error handling
    │   │   └── server.js                    # Server listening on 0.0.0.0:5000
    │   ├── .env                             # Environment variables
    │   └── package.json
    │
    ├── mobile/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── AppButton.jsx            # Reusable styled button with loading state
    │   │   │   ├── EmptyTodos.jsx           # "No todos yet. Create your first task 🚀"
    │   │   │   ├── Loading.jsx              # Reusable loading spinner
    │   │   │   ├── TodoInput.jsx            # Reusable text input with label & error
    │   │   │   └── TodoItem.jsx             # Todo card (toggle, edit, delete, badges)
    │   │   ├── constants/
    │   │   │   └── colors.js                # Modern dark palette
    │   │   ├── context/
    │   │   │   └── AuthContext.jsx          # User state, login, register, logout, restore
    │   │   ├── navigation/
    │   │   │   └── AppNavigator.jsx         # React Navigation (Auth Stack ↔ Todo Stack)
    │   │   ├── screens/
    │   │   │   ├── LoginScreen.jsx          # Login UI
    │   │   │   ├── RegisterScreen.jsx       # Register UI with confirmation validation
    │   │   │   ├── TodoScreen.jsx           # Todo list, pull-to-refresh, greeting, logout
    │   │   │   └── AddTodoScreen.jsx        # Dual-purpose Add/Edit task screen
    │   │   ├── services/
    │   │   │   └── api.js                   # Axios client with JWT interceptor & LAN IP
    │   │   └── utils/
    │   │       └── storage.js               # AsyncStorage token helpers
    │   ├── App.jsx                          # Root component with providers
    │   └── package.json
    │
    ├── README.md                            # Complete documentation & viva answers
    └── .gitignore                           # Excludes node_modules, .env, .expo
  ──────
  ### 3. How to Connect MongoDB and Run the Backend

  #### Step 1: Add your MongoDB Atlas Connection String

  Open .env and replace the MONGODB_URI with your connection string:

    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority
    JWT_SECRET=supersecretjwtkey_todo_app_class_assignment_2026

  (Replace <username> and <password> with your MongoDB Atlas database user credentials).

  #### Step 2: Start the Backend Server

  In your first terminal:

    cd backend
    npm run dev

  You will see:

    🚀 Server running on http://0.0.0.0:5000
    📱 Local network access: http://192.168.100.167:5000
    ✅ MongoDB Connected: cluster0-shard-...

  │ Tip
  │ Notice the server listens on 0.0.0.0. This ensures your laptop accepts incoming connections from your Android phone on your Wi-Fi network.
  ──────
  ### 4. Running the Mobile App on Your Phone

  1. In a second terminal, start Expo:
    cd mobile
    npx expo start

  2. Scan the QR code using Expo Go on your Android phone.
  3. api.js is already pre-configured with your laptop's Wi-Fi IP (http://192.168.100.167:5000/api), so requests will reach your backend immediately!
  ──────
  ### 5. Teacher Demonstration Walkthrough

  When presenting your assignment to your teacher, demonstrate this exact sequence:

  1. User Registration:
      • Open the app (shows the Login screen).
      • Tap "Create Account".
      • Register as Alice (alice@example.com, password: password123).
      • App automatically signs in and displays Hello, Alice 👋 and the EmptyTodos view: "No todos yet. Create your first task 🚀".
  2. Creating Tasks:
      • Tap + Add New Task.
      • Add "Study for React Native Viva" with description "Review JWT, Expo, and AsyncStorage".
      • Tap Create Task. The task appears in Alice's list.
      • Add a second task: "Buy groceries".
  3. Toggle Completion:
      • Tap the circle on "Study for React Native Viva". It toggles to a green checkmark with strikethrough text and ● Completed badge.
      • Tap it again to toggle back to pending.
  4. Edit Task:
      • Tap the ✏️ icon on "Buy groceries".
       • Change title to "Buy groceries and snacks". Tap Update Task.
  5. Delete Task:
      • Tap the 🗑️ icon on a task.
       • Confirm the alert dialog. The task is removed.
  6. User Isolation Proof (The Key Grading Requirement):
      • Tap Sign Out.
      • Register a second user: Bob (bob@example.com).
      • Notice that Bob's todo list is completely empty! Bob cannot see Alice's tasks.
      • Create a task for Bob: "Bob's Secret Task".
      • Sign out and log back in as alice@example.com.
      • Alice only sees her own tasks, never Bob's.
  7. Session Persistence:
      • Close Expo Go completely and re-open it.
      • The app reads the stored JWT from AsyncStorage and keeps you logged in without asking for credentials again.

  ──────
  ### 6. Quick Cheat-Sheet for Questions Your Teacher May Ask

  • How does a Todo belong to a User?
  Each Todo document in MongoDB stores a userId field pointing to the _id of the User document.
  • Why can't we trust the user ID from the frontend?
  If the mobile app sent { userId: "123" } in the request body, an attacker could change that ID to access or delete anyone's todos. Instead, we read the ID strictly from the verified JWT on
  the server (req.user._id).
  • Why can't a physical phone use localhost?
  localhost refers to the device running the code. On the phone, localhost means the phone itself. To connect to the backend running on your laptop, the phone must use your laptop's Wi-Fi IP
  (192.168.100.167).
  • Why do we use AsyncStorage?
  React Native doesn't have web browser localStorage. AsyncStorage provides persistent key-value storage on the device so the user remains logged in across app restarts.