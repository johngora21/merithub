-- Create saved_items table
CREATE TABLE IF NOT EXISTS saved_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_type ENUM('job', 'tender', 'opportunity', 'course') NOT NULL,
    job_id INT,
    tender_id INT,
    opportunity_id INT,
    course_id INT,
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_item_type (item_type),
    UNIQUE KEY unique_saved_job (user_id, job_id),
    UNIQUE KEY unique_saved_tender (user_id, tender_id),
    UNIQUE KEY unique_saved_opportunity (user_id, opportunity_id),
    UNIQUE KEY unique_saved_course (user_id, course_id)
);
