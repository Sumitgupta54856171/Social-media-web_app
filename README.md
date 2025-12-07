# Instagram Clone - Social Media Web Application

A full-stack Instagram clone built with modern web technologies, featuring real-time messaging, post sharing, user profiles, and more.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chakra UI** - Component library
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Apollo Client** - GraphQL client

### Backend
- **Express.js 5** - Web framework
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (JSON Web Tokens)** - Authentication
- **Kafka** - Message broker for asynchronous communication
- **Socket.io** - Real-time bidirectional communication
- **GraphQL** - Query language with Apollo Server
- **Redis** - Caching and session management
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📋 Features

- 🔐 **User Authentication** - JWT-based authentication with secure login/register
- 📸 **Post Management** - Create, view, and manage posts with image uploads
- 👤 **User Profiles** - View and edit user profiles
- 🔍 **Search** - Search for users and content
- 👥 **Follow System** - Follow/unfollow users
- 💬 **Real-time Chat** - Instant messaging with Socket.io and Kafka
- 📱 **Status Updates** - Share temporary status updates
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Chakra UI
- 🌓 **Theme Support** - Dark/light mode support
- 📊 **GraphQL API** - Flexible data fetching with GraphQL

## 🏗️ Project Structure

```
Social-media-web_app/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── redis.js       # Redis connection
│   ├── controller/
│   │   ├── chat.js        # Chat controller
│   │   ├── jwt.js         # JWT verification
│   │   ├── login.js       # Authentication
│   │   ├── Save.js        # Post and follow operations
│   │   ├── search.js      # Search functionality
│   │   ├── Status.js      # Status updates
│   │   └── Uploads.js     # File upload handling
│   ├── model/
│   │   ├── chat.js        # Chat model
│   │   ├── message.js     # Message model
│   │   ├── post.js        # Post model
│   │   ├── usersigma.js   # User model
│   │   ├── Status.js      # Status model
│   │   └── graphsql.js    # GraphQL schema and resolvers
│   ├── uploads/           # Uploaded images
│   ├── views/             # HTML views
│   ├── node.js            # Main server file
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── component/     # React components
│   │   ├── components/    # UI components
│   │   ├── App.jsx        # Main app component
│   │   ├── Dashboard.jsx # Dashboard page
│   │   ├── Home.jsx       # Home page
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml     # Kafka and Zookeeper setup
└── README.md
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or MongoDB Atlas)
- **Redis** (optional, for caching)
- **Docker** and **Docker Compose** (for Kafka)

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Social-media-web_app
```

### 2. Start Kafka and Zookeeper

```bash
docker-compose up -d
```

This will start:
- Zookeeper on port `2181`
- Kafka on port `9092`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/instagram-clone

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=3003

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka Configuration
KAFKA_BROKER=localhost:9092
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
nodemon node.js
```

The backend server will run on `http://localhost:3003`

### 4. Frontend Setup

```bash
cd frontend
npm install
# or
pnpm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3003
VITE_SOCKET_URL=http://localhost:3003
```

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Running the Application

1. **Start Kafka and Zookeeper:**
   ```bash
   docker-compose up -d
   ```

2. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

3. **Start Redis** (if using locally):
   ```bash
   redis-server
   ```

4. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

5. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `GET /api/verify` - Verify JWT token

### Posts
- `POST /api/poststatus` - Create a new post
- `GET /api/getpost` - Get all posts

### User Management
- `GET /api/getprofile` - Get user profile
- `POST /api/search` - Search for users
- `POST /api/following` - Follow/unfollow a user
- `GET /api/getuser` - Get user information

### Status
- `POST /api/addstatus` - Add a status update
- `GET /api/getstatus` - Get status updates

### Chat
- `GET /api/chats/:userId` - Get user chats
- `POST /api/chats` - Create a new chat
- `GET /api/messages/:chatId` - Get messages for a chat

### GraphQL
- `POST /graphql` - GraphQL endpoint

## 🔐 Authentication Flow

1. User registers/logs in through `/api/register` or `/api/login`
2. Server generates a JWT token
3. Token is stored in HTTP-only cookies or localStorage
4. Protected routes verify the token using `/api/verify`
5. Token is included in subsequent requests

## 📨 Kafka Integration

Kafka is used for asynchronous message processing in the chat system:

- **Producer**: Publishes messages to the `chat-topic` when users send messages
- **Consumer**: Consumes messages from `chat-topic` and broadcasts them via Socket.io
- **Topic**: `chat-topic` - Used for real-time chat message distribution

## 💬 Real-time Features

The application uses **Socket.io** for real-time features:

- **Real-time Chat**: Instant message delivery
- **Online Status**: Track user online/offline status
- **Typing Indicators**: Show when users are typing
- **Live Updates**: Real-time post and status updates

## 🧪 Testing

Run tests for the backend:

```bash
cd backend
npm test
```

## 🐳 Docker Support

### Backend Dockerfile
The backend includes a Dockerfile for containerization.

### Frontend Dockerfile
The frontend includes a Dockerfile for containerization.

## 📝 Environment Variables

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your_secret_key
PORT=3003
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3003
VITE_SOCKET_URL=http://localhost:3003
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Instagram for inspiration
- All the open-source libraries and frameworks used in this project

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Note**: This is a clone project for educational purposes. Make sure to configure all environment variables properly before running the application.
