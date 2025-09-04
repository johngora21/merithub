-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    country VARCHAR(100),
    skills JSON,
    experience_level ENUM('entry', 'junior', 'mid', 'senior', 'executive'),
    industry VARCHAR(100),
    subscription_type ENUM('free', 'premium', 'enterprise') DEFAULT 'free',
    subscription_expires_at TIMESTAMP NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_subscription (subscription_type),
    INDEX idx_location (location),
    INDEX idx_industry (industry)
);
