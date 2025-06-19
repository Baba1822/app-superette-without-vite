CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE, -- Link to the original order, if applicable
    date DATETIME NOT NULL,
    client_id INT,
    client_name VARCHAR(255),
    products_json JSON NOT NULL, -- Storing products as JSON
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    customer_address VARCHAR(255),
    customer_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) -- Assuming a clients table exists
); 