create database todolist;
use todolist;
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,        
  description VARCHAR(255) NOT NULL,  
  status ENUM('pending', 'completed', 'in-progress') DEFAULT 'pending',
  aborted BOOLEAN DEFAULT FALSE,             
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);