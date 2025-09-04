# Merit Platform Backend API

A RESTful API backend for the Merit Platform built with Node.js, Express.js, and MySQL.

## Features

- **Authentication**: JWT-based authentication system
- **User Management**: Complete user profiles and subscriptions
- **Jobs Management**: Full CRUD operations for job postings
- **Tenders Management**: Government and private tender management
- **Opportunities Management**: Scholarships, grants, and programs
- **Applications Tracking**: Complete application lifecycle
- **Admin Dashboard**: Administrative functions and analytics
- **File Uploads**: Document and image upload support
- **Rate Limiting**: API rate limiting for security
- **CORS Support**: Cross-origin resource sharing
- **Database Migrations**: SQL migration files for database setup

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Joi
- **Email**: Nodemailer

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd merit/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=8000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=merit_platform
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Database Setup**
   - Create a MySQL database named `merit_platform`
   - Run the migration files in the `migrations/` directory
   - Or let Sequelize auto-sync the models (development only)

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (authenticated)
- `PUT /api/jobs/:id` - Update job (authenticated)
- `DELETE /api/jobs/:id` - Delete job (authenticated)
- `GET /api/jobs/stats` - Get job statistics

### Health Check
- `GET /health` - API health status

## Database Schema

The API uses the following main tables:
- `users` - User accounts and profiles
- `jobs` - Job postings
- `tenders` - Tender opportunities
- `opportunities` - Scholarships, grants, programs
- `applications` - User applications
- `courses` - Educational content
- `admin_logs` - Administrative actions

## Development

### Project Structure
```
backend/
├── config/          # Configuration files
├── src/
│   ├── controllers/ # Route controllers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   ├── services/    # Business logic services
│   └── utils/       # Utility functions
├── migrations/      # SQL migration files
├── uploads/         # File upload directory
└── server.js        # Main server file
```

### Adding New Features

1. **Create Model**: Add new model in `src/models/`
2. **Create Controller**: Add controller in `src/controllers/`
3. **Create Routes**: Add routes in `src/routes/`
4. **Update Associations**: Update model associations in `src/models/index.js`
5. **Add Migration**: Create SQL migration file in `migrations/`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Request validation middleware
- **SQL Injection Protection**: Sequelize ORM protection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | merit_platform |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `FRONTEND_URL` | Frontend URL | http://localhost:5173 |
| `ADMIN_URL` | Admin URL | http://localhost:5173/admin |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
