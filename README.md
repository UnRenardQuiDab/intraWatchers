# intraWatcher

intraWatcher is a web application to help **watchers** of the 42 Lyon school register for exam sessions and to provide statistics and history about past exams.

The project is open source and contributions are welcome: new features, bug fixes, or issue reports.

## Features

- Watchers can browse upcoming exams and register for exam supervision slots.
- Overview of past and upcoming exams.
- Statistics pages to track participation and activity over time.
- Rewards automatically given on the intranet.

## Tech Stack

- **Backend**: [Express.js](https://expressjs.com/) with [MongoDB](https://www.mongodb.com/) as the database, using [Mongoose](https://mongoosejs.com/) as the ODM.
- **Frontend**: [React](https://react.dev/) with [Chakra UI](https://chakra-ui.com/) as the component library.
- **Runtime / Tooling**: Docker & Docker Compose.

## Getting Started (Development)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running on your machine.

### Environment configuration

1. In the project root, copy `.env.sample` to `.env`:
   ```bash
   cp .env.sample .env
   ```
2. Edit `.env` and replace the placeholder values with your own (database URL, secrets, etc.).

### Run the project in development mode

From the project root, start the stack with Docker Compose:

```bash
docker compose -f ./docker-compose.dev.yaml up
```

This will start both the API and the frontend.

### Accessing the application

- Frontend: http://localhost:8080
- API root: http://localhost:8080/api

If you do not already have a 42 staff account and want to grant yourself staff access in development, you can update your user directly in the database by setting the `is_staff` field to `true`. You can do this with a MongoDB client such as [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or the VS Code extension ["MongoDB for VS Code"](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode), connecting to:

`mongodb://127.0.0.1:27017/watchers`

## Contributing

We encourage contributions of all kinds:

- **New features**: propose and implement improvements to intraWatcher.
- **Bug fixes**: help us identify and resolve issues.
- **Issues**: if you find a problem or have an idea, please open an issue.

Before opening a pull request, consider:

- Describing the motivation and scope of your change.
- Linking any related issues.
- Adding or updating documentation if needed.

Thank you for helping improve intraWatcher!