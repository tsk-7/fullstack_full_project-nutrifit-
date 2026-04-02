# Nutrifit Backend - Spring Boot Setup Guide

## Prerequisites

1. **Java 17+** installed
2. **Maven 3.6+** installed
3. **MySQL 8.0+** running on `localhost:3306`
4. MySQL username: `root`, password: `root`

## Database Setup

### Step 1: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS nutrifit_db;
USE nutrifit_db;
```

### Step 2: Create Tables

Run the following SQL to create all tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INT NULL,
  gender VARCHAR(30) NULL,
  height DECIMAL(5,2) NULL,
  weight DECIMAL(5,2) NULL,
  date_of_birth DATE NULL,
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  profile_complete TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  specialty VARCHAR(120) NULL,
  experience_years INT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  total_ratings INT NOT NULL DEFAULT 0,
  avatar VARCHAR(4) NULL,
  available TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NULL,
  calories DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
  fat DECIMAL(8,2) NOT NULL DEFAULT 0,
  iron DECIMAL(8,2) NOT NULL DEFAULT 0,
  calcium DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_c DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_d DECIMAL(8,2) NOT NULL DEFAULT 0,
  fiber DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_b12 DECIMAL(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  food_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  meal_time VARCHAR(30) NULL,
  calories DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
  fat DECIMAL(8,2) NOT NULL DEFAULT 0,
  iron DECIMAL(8,2) NOT NULL DEFAULT 0,
  calcium DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_c DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_d DECIMAL(8,2) NOT NULL DEFAULT 0,
  fiber DECIMAL(8,2) NOT NULL DEFAULT 0,
  vit_b12 DECIMAL(8,2) NOT NULL DEFAULT 0,
  consumed_on DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_meals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_meals_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
  INDEX idx_meals_user_date (user_id, consumed_on)
);

CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  doctor_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_conversation_pair (user_id, doctor_id),
  CONSTRAINT fk_conv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_conv_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('USER', 'DOCTOR') NOT NULL,
  sender_user_id BIGINT UNSIGNED NULL,
  sender_doctor_id BIGINT UNSIGNED NULL,
  text TEXT NOT NULL,
  rated TINYINT(1) NOT NULL DEFAULT 0,
  rating TINYINT UNSIGNED NULL,
  feedback TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_user_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_messages_doctor_sender FOREIGN KEY (sender_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_messages_conversation (conversation_id, created_at),
  INDEX idx_messages_doctor_sender (sender_doctor_id)
);
```

### Step 3: Seed Sample Data (Optional)

Run this to add sample doctors and foods:

```sql
INSERT INTO doctors (name, email, password_hash, specialty, experience_years, rating, total_ratings, avatar, available)
VALUES
  ('Dr. Sarah Johnson', 'sarah@nutrifit.com', '$2a$10$NHx6s6V7xWHV2qKv6QaM5egN6ivQxD50s0xBfQ8egw2xszmvF1c7i', 'Clinical Nutritionist', 12, 4.80, 156, 'SJ', 1),
  ('Dr. Michael Chen', 'michael@nutrifit.com', '$2a$10$NHx6s6V7xWHV2qKv6QaM5egN6ivQxD50s0xBfQ8egw2xszmvF1c7i', 'Sports Nutrition', 8, 4.60, 98, 'MC', 1),
  ('Dr. Emily Davis', 'emily@nutrifit.com', '$2a$10$NHx6s6V7xWHV2qKv6QaM5egN6ivQxD50s0xBfQ8egw2xszmvF1c7i', 'Pediatric Nutrition', 10, 4.90, 203, 'ED', 1);

INSERT INTO foods (name, category, calories, protein, carbs, fat, iron, calcium, vit_c, vit_d, fiber, vit_b12)
VALUES
  ('Oats', 'Grains', 150, 5.0, 27.0, 3.0, 1.7, 54, 0.0, 0.0, 4.0, 0.0),
  ('Egg', 'Protein', 78, 6.0, 0.6, 5.0, 0.9, 28, 0.0, 1.1, 0.0, 0.6),
  ('Chicken Breast', 'Protein', 165, 31.0, 0.0, 3.6, 0.9, 15, 0.0, 0.2, 0.0, 0.3),
  ('Apple', 'Fruit', 95, 0.5, 25.0, 0.3, 0.2, 11, 8.4, 0.0, 4.4, 0.0),
  ('Broccoli', 'Vegetable', 55, 3.7, 11.2, 0.6, 0.7, 89, 89.2, 0.0, 2.4, 0.0),
  ('Salmon', 'Protein', 280, 25.0, 0.0, 20.0, 0.8, 13, 0.0, 570.0, 0.0, 3.2);
```

**Note:** The password hash above corresponds to password `password123` (hashed with BCrypt).

## Building and Running

### Step 1: Navigate to Backend Directory

```bash
cd fullstack-frontend/backend
```

### Step 2: Build the Project

```bash
mvn clean package
```

### Step 3: Run the Application

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Query: `?age=25&gender=male`

- **POST** `/api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password" }`

- **POST** `/api/auth/doctor-register` - Register doctor
  - Body: `{ "email": "doctor@example.com", "password": "password" }`
  - Query: `?specialty=Nutritionist&experienceYears=10`

- **POST** `/api/auth/doctor-login` - Login doctor
  - Body: `{ "email": "doctor@example.com", "password": "password" }`

### Users

- **GET** `/api/users/me?userId={id}` - Get current user profile
- **PUT** `/api/users/{userId}/profile` - Update user profile
  - Query: `?name=John&age=25&gender=male&height=180&weight=75`
- **GET** `/api/users` - Get all users (admin only)
- **DELETE** `/api/users/{userId}` - Delete user

### Doctors

- **GET** `/api/doctors` - Get all doctors (sorted by rating)
- **PATCH** `/api/doctors/{doctorId}/availability?available=true` - Update availability

### Foods

- **GET** `/api/foods` - Get all foods
- **POST** `/api/foods` - Create food (admin only)
- **PUT** `/api/foods/{foodId}` - Update food
- **DELETE** `/api/foods/{foodId}` - Delete food

### Meals

- **GET** `/api/meals/today?userId={id}` - Get today's meals
- **GET** `/api/meals/totals/today?userId={id}` - Get nutrition totals for today
- **POST** `/api/meals?userId={id}` - Add meal
  - Body: `{ "name": "Breakfast", "mealTime": "Breakfast", "calories": 500, ... }`
- **DELETE** `/api/meals/{mealId}?userId={id}` - Remove meal

### Messages

- **GET** `/api/messages/conversation/{doctorId}?userId={id}` - Get conversation
- **POST** `/api/messages?userId={id}&doctorId={id}` - Send message
  - Body: `{ "text": "Hello doctor", "isFromDoctor": false }`
- **PUT** `/api/messages/{messageId}/rate?userId={id}&rating=5&feedback=Great` - Rate message

### Admin

- **GET** `/api/admin/stats` - Get system statistics
- **DELETE** `/api/admin/users/{userId}` - Delete user

### Health

- **GET** `/api/health` - Health check

## CORS Configuration

Frontend can be on any origin. Update `src/main/java/com/nutrifit/config/SecurityConfig.java` if needed:

```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "your-frontend-domain"));
```

## JWT Token

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days. Valid sample login credentials:
- Doctor: `sarah@nutrifit.com` / `password123`
- Doctor: `michael@nutrifit.com` / `password123`

## Troubleshooting

### Connection Refused Error

Ensure MySQL is running on `localhost:3306` with credentials `root:root`

### Table Not Found

Run the SQL table creation scripts in the MySQL database first

### Build Fails

Ensure Java 17+ and Maven 3.6+ are installed:

```bash
java -version
mvn -version
```

## Project Structure

```
backend/
├── pom.xml                          # Maven configuration
├── src/main/java/com/nutrifit/
│   ├── NutrifitBackendApplication.java  # Main entry point
│   ├── config/                      # Spring configurations
│   │   └── SecurityConfig.java
│   ├── controller/                  # REST endpoints
│   ├── entity/                      # Hibernate entities
│   ├── repository/                  # JPA repositories
│   ├── service/                     # Business logic with HQL
│   ├── dto/                         # Data transfer objects
│   └── security/                    # JWT utilities
└── src/main/resources/
    └── application.properties       # Configuration
```

## Database Technology Stack

- **Database:** MySQL 8.0+
- **ORM:** Hibernate (via Spring Data JPA)
- **Query Language:** HQL (Hibernate Query Language)
- **Connection:** JDBC via MySQL Connector/J 8.0.33

All data is persisted in MySQL database, not in-memory storage.
