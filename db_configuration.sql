CREATE DATABASE IF NOT EXISTS users_database;

USE users_database;

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(64) NOT NULL,
    lastname VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    confirmed_email BOOLEAN DEFAULT false,
    first_login BOOLEAN DEFAULT false,
    tfa_secret VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);


