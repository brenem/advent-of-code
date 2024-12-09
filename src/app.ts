import 'reflect-metadata';
import 'dotenv/config';

import { Command } from 'commander';
import { runCommand } from './commands/run';
import { scaffoldCommand } from './commands/scaffold';

const program = new Command();

program
    .addCommand(runCommand)
    .addCommand(scaffoldCommand);

program.parse(process.argv);