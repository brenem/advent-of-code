# Advent Of Code

Advent of Code in Typescript

## Overview

This project is a TypeScript implementation for solving Advent of Code challenges. It includes various utilities and services to scaffold, run, and test the challenges.

## Commands

### Run a Challenge

To run a specific challenge, use the `run` command:
```sh
npm run aoc -- run [--day <day>] [--year <year>] [--part <part>] [--sample]
```
 - `--day` (required/optional): The day of the challenge to run. Required if not running during the month of December. If no value is provided, defaults to the current day.
 - `--year` (optional): The year of the challenge. Defaults to the previous year if not running during December, otherwise defaults to the current year.
 - `--part` (optional): The part to run. If not provided, part 1 and part 2 are run subsequently.
 - `--sample` (optional): If provided, runs the challenge with sample input data.

### Scaffold a Challenge
To scaffold a new challenge, use the scaffold command:
```sh
npm run aoc -- scaffold [--day <day>] [--year <year>]
```
 - `--day` (required/optional): The day of the challenge to scaffold. Required if not scaffolding during the month of December. If no value is provided, defaults to the current day.
 - `--year` (optional): The year of the challenge. Defaults to the previous year if not running during December, otherwise defaults to the current year.

### Download an input

###### *The `run` command will download input automatically if it's never been downloaded. This command is useful if you want to view the input before running the challenge.*

To download input for a specific challenge use the download command:
```sh
npm run aoc -- download [--day <day>] [--year <year>]
```
 - `--day` (required/optional): The day of the challenge to download input for. Required if not downloading during the month of December. If no value is provided, defaults to the current day.
 - `--year` (optional): The year of the challenge to download input for. Defaults to the previous year if not running during December, otherwise defaults to the current year.

### Project Structure
 - `src/algorithms/`: Contains algorithms used in the challenges.
 - `src/challenges/`: Contains the challenge implementations.
 - `src/commands/`: Contains the configured commands.
 - `src/config/`: Contains the config files.
 - `src/helpers/`: Contains various helpers for solving challenges.
 - `src/models/`: Contains data models like LinkedList.
 - `src/services/`: Contains various services like Executor, InputProvider, Scaffolder, etc.
 - `inputs/`: Contains input data for the challenges.
 - `samples/`: Contains sample input data for testing.

### Building the Project
To build the project, use the following command:
```sh
npm run build
```

### Debugging the code
To start a debug session, just add `:debug` to all commands that use `npm run aoc ...`
```sh
npm run aoc:debug -- run ...
```
##### For VS Code debugging, use the Command Palette to turn configure "Auto Attach". I find it's simplest to use the "Auto Attach: With Flag" feature. Then it will only auto attach when `aoc:debug` is used, and not when `aoc` is used.

![image](https://github.com/user-attachments/assets/178fc068-0fda-405e-ad40-ece402936bd1)

![image](https://github.com/user-attachments/assets/aae6e03e-77dc-4290-8083-7046a148fb42)

### Configuration
The project uses environment variables for configuration. You can set these variables in the `.env` file.

Example `.env` file:
```conf
APP_ENVIRONMENT=development
APP_AOC_SESSION_COOKIE=your_session_cookie_here
```

### Dependencies
The project relies on several dependencies, including:

 - `axios`
 - `commander`
 - `dotenv`
 - `heap-js`
 - `typedi`

For a complete list of dependencies, refer to the `package.json` file.

