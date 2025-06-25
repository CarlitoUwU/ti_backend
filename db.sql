-- ========================
-- SCRIPT PARA LA CREACIÓN DE LA BASE DE DATOS: LL_TI
-- ========================

-- 0. ELIMINAR BASE DE DATOS
DROP DATABASE IF EXISTS "LL_TI";

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE "LL_TI";

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Crear objetos dentro de la base de datos "LL_TI"

-- Tipo ENUM para el mes
CREATE TYPE month_enum AS ENUM (
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
);

-- Tabla: districts
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    fee_kwh DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    district_id INT REFERENCES districts(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at DATE,
    last_login DATE
);

-- Tabla: videos
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    duration_seg INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: savings
CREATE TABLE savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    month month_enum,
    year INT,
    savings_kwh DOUBLE PRECISION,
    savings_sol DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: devices
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    consumption_kwh_h INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: users_videos
CREATE TABLE users_videos (
    user_id UUID REFERENCES users(id),
    video_id INT REFERENCES videos(id),
    date_seen DATE,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, video_id)
);

-- Tabla: user_profiles
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR,
    last_name VARCHAR,
    tastes TEXT[],
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: medals
CREATE TABLE medals (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    url_img VARCHAR,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: users_medals
CREATE TABLE users_medals (
    user_id UUID REFERENCES users(id),
    melda_id INT REFERENCES medals(id),
    achievement_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, melda_id)
);

-- Tabla: monthly_consumptions
CREATE TABLE monthly_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    month month_enum,
    year INT,
    kwh_total DOUBLE PRECISION,
    kwh_cost DOUBLE PRECISION,
    amount_paid DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR,
    description VARCHAR,
    created_at DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    month month_enum,
    year INT,
    goal_kwh DOUBLE PRECISION,
    estimated_cost DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: daily_consumptions
CREATE TABLE daily_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    device_id UUID REFERENCES devices(id),
    date DATE,
    hours_use DOUBLE PRECISION,
    estimated_consumption DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE
);
