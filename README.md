# School Achievement Recognition Bot with REST API

## Project Overview

This project involves developing a Discord bot integrated with a REST API, designed to send automated congratulatory messages to students on Discord upon completing tasks. Tailored for a school environment, it aims to boost student morale and acknowledge their achievements. It is developed as a part of the [Turing College Web Development Program](https://www.turingcollege.com/web-development).

## Key Features

- **Automated Achievement Messages:** Sends personalized messages in the Discord server when students complete tasks.
- **REST API Integration:** Manages bot activities and data interactions, triggered by the school's application.
- **Dynamic Content Generation:** Fetches celebratory GIFs from external services and selects templates from a database.
- **Data Management:** Stores messages and metadata in a database.

## Technologies Used

- **Backend:** Express.js, Node.js
- **Database:** SQLite
- **ORM:** Kysely
- **Validation:** zod
- **Testing:** Vitest/Jest
- **Code Quality:** ESLint, Prettier
- **Language:** TypeScript

## Development Approach

- Employed test-driven development with a focus on high test coverage.
- Used database migrations for schema changes and initial data setup.

## Learning Outcomes

- Enhanced skills in REST API development and integration with a Discord bot.
- Improved data management using SQLite and Kysely.
- Reinforced knowledge in test-driven development.

## Environment Variables

To run this project, you need to set the following environment variables:

```bash
DATABASE_URL=/path/to/your/database.db
DISCORD_BOT_ID=your_discord_bot_id
GUILD_ID=your_guild_id
GIPHY_API_KEY=your_giphy_api_key
```

You can set these environment variables by creating a `.env` file in the root directory of your project and adding the following lines as shown in the example.

## Migrations

We can run migrations with the following command:

```bash
npm run migrate:latest
```

We can also run migration:make to make a new migration file:

```bash
npm run migrate:make <migration_name>
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```

## Assumptions

Project will work as long as the server has a channel name `accomplishments`.
