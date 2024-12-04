# Advent Of Code

Advent of Code in Typescript

## Overview

This project is a TypeScript implementation for solving Advent of Code challenges. It includes various utilities and services to scaffold, run, and test the challenges.

## Commands

### Run a Challenge

To run a specific challenge, use the `run` command:
```sh
npm run aoc -- run --day <day> --year <year> [--sample]
```
 - `--day` (required/optional): The day of the challenge to run. Required if not running during the month of December. If no value is provided, defaults to the current day.
 - `--year` (optional): The year of the challenge. Defaults to the current year.
 - `--sample` (optional): If provided, runs the challenge with sample input data.

### Scaffold a Challenge
To scaffold a new challenge, use the scaffold command:
```sh
npm run aoc -- scaffold --day <day> --year <year>
```
 - `--day` (required): (required/optional): The day of the challenge to scaffold. Required if not scaffolding during the month of December. If no value is provided, defaults to the current day.
 - `--year` (optional): The year of the challenge. Defaults to the current year.

### Project Structure
 - `src/app/challenges/`: Contains the challenge implementations.
 - `src/app/services/`: Contains various services like Executor, InputProvider, Scaffolder, etc.
 - `src/app/models/`: Contains data models like LinkedList.
 - `src/app/inputs/`: Contains input data for the challenges.
 - `src/app/samples/`: Contains sample input data for testing.

### Running Tests
To run the tests, use the following command:
```sh
npm test
```

### Building the Project
To build the project, use the following command:
```sh
npm run build
```

### Configuration
The project uses environment variables for configuration. You can set these variables in the `.env` file.

Example `.env` file:
```conf
APP_ENVIRONMENT=development
APP_AOC_SESSION_COOKIE=your_session_cookie_here
```

### Dependencies
The project relies on several dependencies, including:

 - `@deepkit/app`
 - `@deepkit/logger`
 - `axios`
 - `jest`
 - `typescript`

For a complete list of dependencies, refer to the `package.json` file.

### License
This project is licensed under the MIT License.
