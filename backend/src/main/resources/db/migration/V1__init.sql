-- Flyway baseline migration: initial schema
-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(64) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  country VARCHAR(100) NOT NULL,
  role VARCHAR(32) NOT NULL,
  is_enabled BOOLEAN,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

-- Passengers
CREATE TABLE IF NOT EXISTS passengers (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  passport_number VARCHAR(64),
  citizenship VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(16),
  bonus_miles NUMERIC,
  created_at TIMESTAMP,
  user_id BIGINT,
  CONSTRAINT fk_passenger_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Airports
CREATE TABLE IF NOT EXISTS airports (
  id BIGSERIAL PRIMARY KEY,
  iata_code VARCHAR(8) NOT NULL UNIQUE,
  icao_code VARCHAR(8) NOT NULL UNIQUE,
  name VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  timezone TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longtitude DOUBLE PRECISION
);

-- Airplanes
CREATE TABLE IF NOT EXISTS airplanes (
  id BIGSERIAL PRIMARY KEY,
  model VARCHAR(255),
  registration_number VARCHAR(64) UNIQUE,
  economy_seats_amount INTEGER,
  business_seats_amount INTEGER
);

-- Flights
CREATE TABLE IF NOT EXISTS flights (
  id BIGSERIAL PRIMARY KEY,
  flight_number VARCHAR(64),
  airplane_id BIGINT,
  departure_airport_id BIGINT,
  arrival_airport_id BIGINT,
  scheduled_departure TIMESTAMP,
  scheduled_arrival TIMESTAMP,
  economy_seat_price DOUBLE PRECISION,
  business_seat_price DOUBLE PRECISION,
  remaining_economy_seats INTEGER,
  booked_economy_seats INTEGER,
  remaining_business_seats INTEGER,
  booked_business_seats INTEGER,
  CONSTRAINT fk_flight_airplane FOREIGN KEY (airplane_id) REFERENCES airplanes(id) ON DELETE SET NULL,
  CONSTRAINT fk_flight_departure_airport FOREIGN KEY (departure_airport_id) REFERENCES airports(id) ON DELETE SET NULL,
  CONSTRAINT fk_flight_arrival_airport FOREIGN KEY (arrival_airport_id) REFERENCES airports(id) ON DELETE SET NULL
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_reference VARCHAR(64) UNIQUE,
  flight_id BIGINT,
  user_id BIGINT,
  booking_date DATE,
  status VARCHAR(32),
  seat_class VARCHAR(32),
  CONSTRAINT fk_booking_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE SET NULL,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Booking-Passengers join table
CREATE TABLE IF NOT EXISTS bookings_passengers (
  booking_id BIGINT NOT NULL,
  passenger_id BIGINT NOT NULL,
  PRIMARY KEY (booking_id, passenger_id),
  CONSTRAINT fk_bp_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bp_passenger FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
);
