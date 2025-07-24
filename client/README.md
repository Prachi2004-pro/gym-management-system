# Gym Management System - MVP Scope

## Project Overview
A complete gym management solution for gym owners, trainers, and members.

## Target Users
- **Admin (Gym Owner)**: Full system access, manage everything
- **Trainer**: View classes, mark attendance, view member details  
- **Member**: View profile, attendance history, payment status

## Phase 1 Features (MVP)
1. **Authentication System**
   - Login/Signup with role-based access (Admin, Trainer, Member)
   - JWT-based secure authentication
   - Admin can create Trainer and Member accounts

2. **Member Management**
   - Add/Edit/Delete Members
   - Member Details: Name, Contact, Plan (Gold/Silver/Platinum), Join Date, End Date
   - Auto-calculate remaining days
   - Status: Active/Expired/Suspended

3. **Attendance Tracking**
   - Mark daily attendance for each member
   - Filter by date, member, or trainer
   - Show attendance summary for last 7 days

4. **Trainer/Class Schedule**
   - Create trainer profiles with specializations
   - Assign classes and time slots
   - Members can view trainer schedules

5. **Payment Tracking**
   - Record payments per member
   - Track: Plan, Amount, Payment Date, Mode (Cash/UPI/Card)
   - Auto-reminder for expired or due payments

## Tech Stack
- **Frontend**: React.js + TailwindCSS + React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT tokens
- **Styling**: TailwindCSS with custom components
- **Charts**: Chart.js for analytics

## Success Criteria
- Responsive design (mobile, tablet, desktop)
- Role-based access control working
- All CRUD operations functional
- Basic dashboard with member statistics
- Secure authentication flow