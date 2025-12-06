-- Create cohort_retention table
CREATE TABLE IF NOT EXISTS cohort_retention (
    id SERIAL PRIMARY KEY,
    cohort_date DATE NOT NULL,
    week_0 INTEGER NOT NULL,
    week_1 INTEGER NOT NULL,
    week_2 INTEGER NOT NULL,
    week_3 INTEGER NOT NULL,
    week_4 INTEGER NOT NULL
);

-- Create conversion_funnel table
CREATE TABLE IF NOT EXISTS conversion_funnel (
    id SERIAL PRIMARY KEY,
    step VARCHAR(50) NOT NULL,
    users INTEGER NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL
);

-- Create top_products table
CREATE TABLE IF NOT EXISTS top_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    revenue INTEGER NOT NULL,
    units INTEGER NOT NULL
);

-- Create user_segments table
CREATE TABLE IF NOT EXISTS user_segments (
    id SERIAL PRIMARY KEY,
    segment_name VARCHAR(50) NOT NULL,
    user_count INTEGER NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    color VARCHAR(20) NOT NULL
);

-- Create high_value_users table
CREATE TABLE IF NOT EXISTS high_value_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    purchases INTEGER NOT NULL,
    ltv INTEGER NOT NULL,
    segment VARCHAR(50) NOT NULL,
    last_purchase DATE NOT NULL
);

-- Insert sample cohort data for November 2025
INSERT INTO cohort_retention (cohort_date, week_0, week_1, week_2, week_3, week_4) VALUES
('2025-11-03', 15, 11, 8, 6, 5),
('2025-11-10', 18, 13, 10, 7, 6),
('2025-11-17', 20, 15, 11, 9, 7),
('2025-11-24', 25, 19, 14, 11, 9),
('2025-11-27', 22, 17, 13, 10, 8);

-- Insert conversion funnel data
INSERT INTO conversion_funnel (step, users, percentage) VALUES
('Page View', 57, 100.0),
('Add to Cart', 41, 71.9),
('Checkout', 28, 49.1),
('Purchase', 19, 33.3);

-- Insert top products data
INSERT INTO top_products (name, category, revenue, units) VALUES
('iPhone 15 Pro', 'Electronics', 450000, 18),
('Samsung 4K TV', 'Electronics', 380000, 22),
('Nike Air Max', 'Footwear', 180000, 45),
('Dyson Vacuum', 'Home', 165000, 15),
('Sony Headphones', 'Electronics', 145000, 32),
('MacBook Air M3', 'Electronics', 320000, 8),
('Levi''s Jeans', 'Apparel', 95000, 38),
('Instant Pot', 'Kitchen', 78000, 26);

-- Insert user segments data
INSERT INTO user_segments (segment_name, user_count, percentage, color) VALUES
('New Users', 20, 35.0, '#3B82F6'),
('Active Users', 23, 40.0, '#10B981'),
('At-Risk Users', 9, 15.0, '#F59E0B'),
('Churned Users', 5, 10.0, '#EF4444');

-- Insert high value users data
INSERT INTO high_value_users (user_id, name, email, purchases, ltv, segment, last_purchase) VALUES
(1001, 'Rahul Sharma', 'rahul.sharma@email.com', 5, 68500, 'VIP', '2025-11-28'),
(1002, 'Priya Patel', 'priya.patel@email.com', 4, 52000, 'Power User', '2025-11-27'),
(1003, 'Amit Kumar', 'amit.kumar@email.com', 3, 45000, 'High-Value', '2025-11-26'),
(1004, 'Sneha Reddy', 'sneha.reddy@email.com', 4, 58000, 'VIP', '2025-11-25'),
(1005, 'Vikram Singh', 'vikram.singh@email.com', 2, 32000, 'High-Value', '2025-11-24'),
(1006, 'Ananya Gupta', 'ananya.gupta@email.com', 3, 41000, 'Power User', '2025-11-23'),
(1007, 'Rajesh Nair', 'rajesh.nair@email.com', 5, 72000, 'VIP', '2025-11-22'),
(1008, 'Meera Iyer', 'meera.iyer@email.com', 2, 28000, 'High-Value', '2025-11-21'),
(1009, 'Karthik Menon', 'karthik.menon@email.com', 4, 55000, 'Power User', '2025-11-20'),
(1010, 'Divya Krishnan', 'divya.krishnan@email.com', 3, 38000, 'High-Value', '2025-11-19');
