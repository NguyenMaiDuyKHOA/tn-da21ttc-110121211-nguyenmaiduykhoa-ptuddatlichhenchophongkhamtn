# Booking Medical Application

## Table Of Contents
- [Overview](#overview)
  - [Introduction](#introduction)
  - [Target](#target)
  - [Features](#features)
- [Architecture of project](#architecture-of-project)
- [Build With](#build-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Docker Installation](#docker-installation)

## Overview
### Introduction
  This project was created as a learning exercise during my early days of exploring web programming. It is not intended for commercial use or enterprise-grade deployment. As a result, the code may contain vulnerabilities, as the focus was on simplicity and functionality rather than robustness or security.
  
  If you’d like to customize or improve the project, feel free to fork it and make your own changes. Please note that I am unable to dedicate time to refactoring or enhancing this project further.
  
  Thank you for understanding!

### Target
Booking Medical Application is an online medical appointment booking system that connects patients with medical facilities quickly and conveniently. The application allows users to register an account, search for doctors, view available schedules, and book appointments with just a few steps. For both patients and administrators, the system supports efficient management of appointment schedules, doctor information, specialties, and medical history.

### Features
- Authentication & Authorization
- Booking medical
- Manage doctor
- Etc

## Architecture Of Project
1. Client - Server.
2. Admin: serving admin dashboard
   - `public/`: image, favicon,...
   - `src/`: main source code;
   - `.env`: environment variables;
   - `tailwind.config.js`: config for tailwindCSS;
   - `vite.config.js`: config for vite.
   - `Dockerfile`: create container for Admin.
3. Frontend: serving for end users
   - `public/`: image, favicon,...
   - `src/`: main source code;
   - `.env`: environment variables;
   - `tailwind.config.js`: config for tailwindCSS;
   - `vite.config.js`: config for vite.
   - `Dockerfile`: create container for Frontend.
4. Backend:
   - `config/`: config for database, cloudinary;
   - `middleware/`: authentication file, config middleware for upload file;
   - `models/`: mongoose model for connect to DB;
   - `controllers/`: main processing functions;
   - `routes/`: API routing;
   - `.env`: environment variables;
   - `server.js`: server config file
   - `Dockerfile`: create container for Backend.

## Build With
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Node.Js](https://nodejs.org/en)
- [TailwindCSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)

## Getting Started
### Prerequisites
- Node.js
- Docker desktop

### Local Installation
To run the application, follow these steps:
1. Clone this repository to your computer.
2. Open the folder with name backend and open a terminal in this folder.
3. Run the command:
   ```bash
   $ npm install
   ```
4. Set eviroment (`.env` file):
   ```env
   MONGODB_URI = "your mongodb URI"
   CLOUDINARY_API_KEY = "your cloudinary API key"
   CLOUDINARY_SECRET_KEY = "your cloudinary secret key"
   ```
5. After it finishes, run the command:
   ```bash
   $ npm run server
   ```
6. Open the folder with name fronend and open a terminal in this folder.
7. Run the command:
   ```bash
   $ npm install
   ```
8. Run the command:
   ```bash
   $ npm run dev
   ```
9. Open browser and visit `http://localhost:5175` to see your application.
10. Do the same with the admin folder as with the frontend folder.
11. Open browser and visit `http://localhost:5176` to see your admin dashboard.

### Docker Installation
To run the application on docker, follow these steps:
1. Clone this repository to your computer.
2. Open your docker desktop
3. Open a terminal in the repository directory and run the command:
   ```bash
   $ docker compose up --build
   ```
4. Wait for docker run all container success
5. Open browser and visit `http://localhost:5175` to see your application or `http://localhost:5176` to see your admin dashboard.
