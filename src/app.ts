import 'reflect-metadata';
import 'dotenv/config';

import { Command } from 'commander';
import { runCommand } from './commands/run';
import { scaffoldCommand } from './commands/scaffold';
import { downloadInputCommand } from './commands/download-input';

const program = new Command();

program
    .addCommand(downloadInputCommand)
    .addCommand(runCommand)
    .addCommand(scaffoldCommand)

program.parse(process.argv);