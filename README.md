<div align="center">

# 🎓 School Management System

**A comprehensive, full-stack school management platform with role-based access control**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-View_Application-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://scholario-zeta.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

A modern, feature-rich school management application designed to streamline educational administration. Built with Next.js 15 and TypeScript, this platform provides separate dashboards for administrators, teachers, students, and parents, enabling efficient management of classes, lessons, assignments, exams, attendance, and academic records.

> 🌐 **Try it live**: [View Demo](https://scholario-zeta.vercel.app/) - Experience the full application with all features and role-based dashboards.

### ✨ Key Highlights

- 🔐 **Role-Based Access Control** - Secure multi-role authentication with Clerk
- 📊 **Real-Time Analytics** - Interactive charts and dashboards for data visualization
- 📅 **Calendar Integration** - Event scheduling and lesson timetables
- 📝 **Complete CRUD Operations** - Full management of students, teachers, classes, and more
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and loading states
- ✅ **Type-Safe** - End-to-end TypeScript with Zod validation
- 🚀 **Server Actions** - Efficient data mutations with Next.js Server Actions
- 📱 **Responsive Design** - Optimized for all device sizes

---

## 🎯 Features

### 👥 Core Functionality

- **Multi-Role System**: Separate dashboards and permissions for Admins, Teachers, Students, and Parents
- **Student Management**: Complete student profiles with personal information, class assignments, and academic records
- **Teacher Management**: Teacher profiles with subject assignments and class supervision
- **Parent Management**: Parent accounts linked to their children's academic information
- **Class Management**: Organize students into classes with capacity management
- **Subject Management**: Create and manage subjects with teacher assignments

### 📚 Academic Features

- **Lesson Scheduling**: Weekly lesson timetables with day and time management
- **Exam Management**: Create and manage exams linked to lessons
- **Assignment Management**: Assign and track homework and projects with due dates
- **Results & Grades**: Record and view exam and assignment scores
- **Attendance Tracking**: Track student attendance per lesson with present/absent status

### 💬 Communication & Events

- **Announcements**: Class-specific announcements and school-wide notices
- **Event Calendar**: Schedule and manage school events with calendar view
- **Dashboard Analytics**: Visual charts and statistics for attendance, performance, and more

### 🎨 User Experience

- **Modern UI**: Built with Tailwind CSS and responsive design
- **Image Uploads**: Profile pictures and media management via Cloudinary
- **Real-time Notifications**: Toast notifications for user actions
- **Loading States**: Skeleton loaders and loading indicators
- **Form Validation**: Client and server-side validation with Zod schemas

---

## 🛠️ Tech Stack

### Frontend

| Category          | Technology                                                                              |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Framework**     | [Next.js 15.5.3](https://nextjs.org/) (App Router)                                      |
| **Language**      | [TypeScript 5.9.3](https://www.typescriptlang.org/)                                     |
| **UI Library**    | [React 19.1.0](https://react.dev/)                                                      |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com/)                                              |
| **Forms**         | [React Hook Form 7.63.0](https://react-hook-form.com/) + [Zod 4.1.11](https://zod.dev/) |
| **Charts**        | [Recharts 3.2.1](https://recharts.org/)                                                 |
| **Calendar**      | [React Big Calendar 1.19.4](https://jquense.github.io/react-big-calendar/)              |
| **Notifications** | [React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)                      |

### Backend & Services

| Category           | Technology                                             |
| ------------------ | ------------------------------------------------------ |
| **Database**       | [PostgreSQL](https://www.postgresql.org/)              |
| **ORM**            | [Prisma 6.17.0](https://www.prisma.io/)                |
| **Authentication** | [Clerk 6.33.7](https://clerk.com/)                     |
| **Image Upload**   | [Next Cloudinary 6.17.0](https://next.cloudinary.dev/) |
| **Deployment**     | Ready for Vercel/Netlify                               |

---

## 🚀 Getting Started

> 💡 **Quick Start**: Want to see it in action? [Visit the live demo](https://scholario-zeta.vercel.app/) to explore all features without any setup!

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) database
- [Clerk](https://clerk.com/) account (for authentication)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd school-management-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/school_db?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Cloudinary (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the development server            |
| `npm run build`    | Build the application for production    |
| `npm run start`    | Start the production server             |
| `npm run lint`     | Run ESLint to check for code issues     |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format`   | Format code using Prettier              |

---

## 📁 Project Structure

```
school-management-app/
├── prisma/
│   ├── migrations/          # Database migration files
│   ├── schema.prisma         # Prisma schema definition
│   └── seed.ts               # Database seed script
├── public/                   # Static assets (images, icons)
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (dashboard)/      # Dashboard routes (protected)
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── teacher/      # Teacher dashboard
│   │   │   ├── student/      # Student dashboard
│   │   │   ├── parent/       # Parent dashboard
│   │   │   └── list/         # List pages (students, teachers, etc.)
│   │   └── [[...sign-in]]/   # Clerk sign-in routes
│   ├── components/           # Reusable React components
│   │   └── skeletons/        # Loading skeleton components
│   ├── features/             # Feature-based modules
│   │   ├── announcements/    # Announcement feature
│   │   ├── assignments/      # Assignment feature
│   │   ├── classes/          # Class feature
│   │   ├── events/           # Event feature
│   │   ├── exams/            # Exam feature
│   │   ├── lessons/          # Lesson feature
│   │   ├── parents/          # Parent feature
│   │   ├── results/          # Result feature
│   │   ├── students/         # Student feature
│   │   ├── subjects/         # Subject feature
│   │   └── teachers/         # Teacher feature
│   ├── generated/            # Generated Prisma client
│   ├── lib/                  # Utility functions and configurations
│   └── middleware.ts         # Next.js middleware for route protection
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies
├── postcss.config.mjs        # PostCSS configuration
├── prettier.config.cjs       # Prettier configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🔐 Authentication & Roles

This application uses **Clerk** for authentication with role-based access control. Each user is assigned a role that determines their access level and available features.

### Role Permissions

| Role        | Access Level     | Key Features                                                   |
| ----------- | ---------------- | -------------------------------------------------------------- |
| **Admin**   | Full Access      | User management, system configuration, all CRUD operations     |
| **Teacher** | Class Management | Assigned classes, lessons, exams, assignments, student records |
| **Student** | Personal View    | Schedule, assignments, exams, results, attendance              |
| **Parent**  | Child Monitoring | Children's academic information, attendance, results           |

---

## 🗄️ Database Schema

The application uses **PostgreSQL** with **Prisma ORM**. The schema includes:

- **Users**: Admin, Teacher, Student, Parent
- **Academic**: Class, Subject, Grade, Lesson
- **Assessments**: Exam, Assignment, Result
- **Tracking**: Attendance
- **Communication**: Event, Announcement

See `prisma/schema.prisma` for the complete schema definition.

---

## 🎨 Screenshots

> _Add screenshots of your application here to showcase the UI and features_

<!--
Example:
![Dashboard](screenshots/dashboard.png)
![Student Management](screenshots/students.png)
![Calendar View](screenshots/calendar.png)
-->

---

## 🔧 Key Implementation Details

- **Server Actions**: Efficient data mutations without API routes
- **Middleware Protection**: Route-level authentication and authorization
- **Type Safety**: End-to-end TypeScript with Prisma-generated types
- **Form Validation**: Zod schemas for both client and server-side validation
- **Optimistic Updates**: Enhanced UX with immediate feedback
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

---

## 📝 License

This project is private and proprietary.

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

[⬆ Back to Top](#-school-management-system)

</div>
