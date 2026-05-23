Team Task Manager

This project is a full-stack Task Management System built with .NET 10 (Backend) and Angular 19 (Frontend).

## Features
- Role-Based Access Control (Admin/Member)
- Task Creation, Updating, and Deletion
- Dashboard Statistics
- Professional Light Theme UI
- Full responsiveness

## Deployment Information
This project is configured as a Monorepo. To deploy to platforms like Railway:
1. Connect this GitHub repository.
2. Railway will automatically detect the Dockerfile in the root directory.
3. The Dockerfile builds both the Angular frontend and the .NET backend into a single container.
4. ASP.NET Core automatically serves the static Angular files, requiring only 1 deployment service.

No manual configuration of Root Directories is required!
