# ReachInbox – Email Scheduling System

**Developed by: Induja B**

A full-stack email scheduling system that allows users to compose, schedule, and send emails automatically.

## 🚀 Features

* User login interface
* Compose new emails
* Schedule emails for a specific date and time
* Background worker for processing scheduled emails
* Automatic email sending using Gmail SMTP
* Sent email tracking
* Scheduled email management
* Prisma database integration
* Prisma Studio for database management
* REST API backend
* React frontend

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL

### Email Service

* Gmail SMTP
* Nodemailer
* Gmail App Password

## 📁 Project Structure

```text
reachinbox-assignment/
│
├── backend/
│   ├── src/
│   │   ├── workers/
│   │   │   └── emailWorker.ts
│   │   ├── services/
│   │   └── ...
│   ├── prisma/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── ...
│
└── README.md
```

## ⚙️ How It Works

```text
User
  ↓
Compose Email
  ↓
Schedule Email
  ↓
Database
  ↓
Scheduled
  ↓
Background Worker
  ↓
Gmail SMTP
  ↓
SENT
```

The application stores scheduled emails in the database. The background worker continuously checks for emails that are ready to be sent and sends them through Gmail SMTP.

Once successfully sent, the email status is updated from:

```text
SCHEDULED → SENT
```

## 🧪 Testing

The system was tested by:

1. Creating scheduled emails through the frontend.
2. Checking the emails in Prisma Studio.
3. Running the email worker.
4. Confirming that the worker successfully sends the emails.
5. Checking the email records through the backend API.
6. Confirming that the email status changes to `SENT`.
7. Displaying sent emails in the frontend.

## 🔑 Environment Variables

Create a `.env` file inside the backend folder and add the required database and Gmail configuration.

```env
DATABASE_URL="your_database_url"

GMAIL_USER="your_gmail_address"
GMAIL_APP_PASSWORD="your_16_character_app_password"
```

**Important:** Never upload your `.env` file or Gmail App Password to GitHub.

## ▶️ Running the Project

### Backend

Open a terminal and go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run dev
```

### Email Worker

Run the worker separately:

```bash
npx ts-node src/workers/emailWorker.ts
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Then open the local URL provided by Vite in your browser.

## 🗄️ Database

Prisma is used to manage the database.

To open Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio allows you to view and manage records such as:

* Users
* Senders
* Emails
* Email status
* Scheduled time
* Sent time

## 📌 Email Status Flow

```text
SCHEDULED
     ↓
  Worker
     ↓
   SEND
     ↓
   SENT
```

## 👩‍💻 Author

**Induja B**

Full-Stack Email Scheduling System
