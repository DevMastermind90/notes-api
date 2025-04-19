# Serverless Notes API

A serverless REST API for managing notes, built with AWS Lambda, API Gateway, and DynamoDB.

## Features

- Create, read, update, and delete notes
- Serverless architecture using AWS Lambda
- DynamoDB for data storage
- RESTful API design
- Comprehensive test coverage
- CI/CD pipeline with GitHub Actions

## Tech Stack

- **Runtime**: Node.js 18.x
- **Cloud Provider**: AWS
- **Serverless Framework**: v3
- **Database**: DynamoDB
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 18.x
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd serverless-notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
NOTES_TABLE=NotesTable
```

## Local Development

1. Start the local server:
```bash
npm run offline
```

2. The API will be available at `http://localhost:3000`

## API Endpoints

### Create Note
- **POST** `/notes`
- Request body:
```json
{
  "title": "My Note",
  "content": "Note content"
}
```

### Get All Notes
- **GET** `/notes`
- Returns a list of all notes

### Get Note by ID
- **GET** `/notes/{id}`
- Returns a specific note

### Update Note
- **PUT** `/notes/{id}`
- Request body:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Note
- **DELETE** `/notes/{id}`
- Deletes a specific note

## Testing

The project includes three types of tests:

1. **Unit Tests**
```bash
npm run test:unit
```

To run all tests with coverage:
```bash
npm run test
```

## Deployment

The application uses GitHub Actions for CI/CD. The workflow includes:

1. Running tests
2. Deploying to dev environment (on push to dev branch)
3. Deploying to production (on push to main branch)

To deploy manually:

1. Deploy to dev:
```bash
npm run deploy -- --stage dev
```

2. Deploy to production:
```bash
npm run deploy -- --stage prod
```

## Project Structure

```
.
├── src/
│   ├── functions/     # Lambda function handlers
│   ├── utils/         # Utility functions
│   └── db/            # Database configuration
├── tests/
│   ├── unit/          # Unit tests
├── .github/
│   └── workflows/     # GitHub Actions workflows
└── serverless.yml     # Serverless Framework configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
