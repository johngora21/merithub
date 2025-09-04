-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_type ENUM('free', 'premium', 'enterprise') NOT NULL,
    status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'free'),
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_id VARCHAR(255),
    features JSON,
    limits JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_subscription_type (subscription_type),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
);
