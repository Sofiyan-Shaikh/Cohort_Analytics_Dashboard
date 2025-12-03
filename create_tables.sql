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
