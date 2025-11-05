-- defects table
CREATE TABLE IF NOT EXISTS defects (
id SERIAL PRIMARY KEY,
vehicle_id VARCHAR(64) NOT NULL,
description TEXT NOT NULL,
status VARCHAR(32) NOT NULL DEFAULT 'open',
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- simple admin table for manager login (email + password hash)
CREATE TABLE IF NOT EXISTS managers (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL
);
