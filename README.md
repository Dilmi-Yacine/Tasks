# Overview

Tasks is a project management tool designed to help visualize the state of every piece of work at any time.

## Description

### Features

- create boards, lists, cards.
- drag and drop lists and cards.
- edit board, list ,card title.
- expand cards with description, labels, due date, checklist, assign members, comments.
- share board and work collaboratively with other users.

### Stack

- Nextjs
- SWR
- MUI (Material UI)
- Mongoose

## Getting Started

### Dependencies

- [nodejs](https://nodejs.org)
- [mongoDB](https://docs.mongodb.com/manual/installation/)

Open Tasks folder and run

```
npm install
```

### Run

1. create .env file
2. past

```
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
DB_URL=
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET="put-here-a-long-complicated-string"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

3. run mongoDb (according to your operation system)

4. run

```
npm run dev
```
