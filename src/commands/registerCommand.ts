import { command as musicCommand } from './musicCommand'
import { command as fanyiCommand } from './fanyiCommand'
import { command as backgroundCommand } from './backgroundCommand'
import { command as helpCommand } from './helpCommand';
import { command as clearCommand } from './clearCommand';
import { command as biliCommand } from './biliCommand';
import { command as historyCommand } from './historyCommand';
import { Command } from '../interface/interface';

const commandMap: Command[] = [
    musicCommand,
    fanyiCommand,
    backgroundCommand,
    helpCommand,
    clearCommand,
    biliCommand,
    historyCommand,
]

export {
    commandMap
}

