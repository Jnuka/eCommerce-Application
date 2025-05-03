# eCommerce-Application

# Coffee-Shop

## Overview

The project was developed as part of the [JS/FE Rolling Scopes School 2024Q4](https://rs.school/courses/javascript-ru) course and was created by a team:

1. [Jnuka](https://github.com/jnuka)
2. [Goldbergz](https://github.com/goldbergz)
3. [Alinalitvinka](https://github.com/alinalitvinka)

This project is a Single-page Application (SPA) for the sale of different types of coffee that utilizes the [CommerceTools.com](https://commercetools.com) platform.
The application allows users to register for an account and log in. Once logged in, users can add desired coffee products to their cart using filters or the website search function.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Technology stack

**Frontend**

* Angular
* TypeScript
* ESLint
* Prettier
* Tailwind CSS
* Husky and Lint-staged
* Karma tests

**Backend**

* CommerceTools

## Initialization project

To initialize the project, run:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

**___or___**

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## ESLint

```bash
ng lint
```

## Prettier

```bash
npm run format:fix
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
