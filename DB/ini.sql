-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todolist;

-- Switch to the 'todolist' database
USE todolist;

-- Drop the user if it exists
DROP USER IF EXISTS 'todolist'@'%';

-- Create the user with the specified password
CREATE USER 'todolist'@'%' IDENTIFIED WITH mysql_native_password BY 'todolist-2024';

-- Grant all privileges to the 'todolist' user on the 'todolist' database
GRANT ALL PRIVILEGES ON todolist.* TO 'todolist'@'%';

-- Apply the changes to privileges
FLUSH PRIVILEGES;

-- Create the 'todos' table if it doesn't exist
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,        
  description VARCHAR(255) NOT NULL,  
  status ENUM('pending', 'completed', 'in-progress') DEFAULT 'pending',
  aborted BOOLEAN DEFAULT FALSE,             
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data into the 'todos' table
INSERT INTO todos (description, status, aborted)
VALUES 
  ('Finish writing the report', 'pending', FALSE),
  ('Buy groceries', 'completed', FALSE),
  ('Complete the project presentation', 'in-progress', FALSE),
  ('Take the dog for a walk', 'pending', FALSE),
  ('Schedule the team meeting', 'pending', TRUE);
