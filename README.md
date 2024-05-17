# app-template-remix

This is a template repository for quickly bootstrapping a Noona HQ app.

It is built on the popular framework Remix which makes it both simple to render complex UIs with React as well as creating API endpoints for consuming webhooks.

## Setup

The first thing before you start coding is to set up the project by running the following command:

    ./setup.sh

The project does include internal deployment and build artifacts that are not helpful outside of the Noona deployment cycle, feel free to remove those from your project.

### Environment

The inital `.env` includes configuration values for the Noona production environment and for MongoDB running locally on port 27017. The only thing you need to fill in is the `CLIENT_ID` and `CLIENT_SECRET` variables which you got when creating an app in Noona HQ.

## Prisma

The template includes [Prisma](https://www.prisma.io/) for making it easier to work with your database of choice. Prisma supports all popular database engines, but you can also use another ORM or database library.

The template is by default configured for MongoDB as that is our database of choice. We highly recommend using [MongoDB Atlas](https://www.mongodb.com/atlas/database) but you are free to use the database you prefer.

### Prisma generate client

The Prisma client is generated generated from the file `prisma/schema.prisma`. Run this command to intialize Prisma in the project:

    yarn prisma-generate

### Prisma schema changes

Run this to push schema changes to the database, this will create the collection and relevant indices.

    yarn prisma db push

## API Client

The Noona HQ API client is generated from the OpenAPI spec. Run this command to generate the API client:

    yarn orval-generate

## Development

Run the following command to run the application in development mode

    yarn dev
