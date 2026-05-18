-- CREATE DATABASE

CREATE DATABASE IF NOT EXISTS ticket_booking;

USE ticket_booking;

-- USERS TABLE

CREATE TABLE users (

    user_id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE,

    password VARCHAR(100)

);

-- SHOWS TABLE

CREATE TABLE shows (

    show_id INT PRIMARY KEY AUTO_INCREMENT,

    movie_name VARCHAR(100),

    show_time DATETIME

);

-- SEATS TABLE

CREATE TABLE seats (

    seat_id INT PRIMARY KEY AUTO_INCREMENT,

    show_id INT,

    seat_number VARCHAR(10),

    status ENUM(
        'AVAILABLE',
        'BOOKED',
        'LOCKED'
    ) DEFAULT 'AVAILABLE',

    version INT DEFAULT 1,

    lock_time TIMESTAMP NULL,

    FOREIGN KEY(show_id)
    REFERENCES shows(show_id)

);

-- BOOKINGS TABLE

CREATE TABLE bookings (

    booking_id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT,

    seat_id INT,

    booking_time TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20),

    FOREIGN KEY(user_id)
    REFERENCES users(user_id),

    FOREIGN KEY(seat_id)
    REFERENCES seats(seat_id)

);