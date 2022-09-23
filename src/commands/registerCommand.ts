import { musicCommand } from './musicCommand'
import { fanyiCommand } from './fanyiCommand'
import { backgroundCommand } from './backgroundCommand'
import { helpCommand } from './helpCommand';
import { clearCommand } from './clearCommand';
import { biliCommand } from './biliCommand';
import { historyCommand } from './historyCommand';
import { logCommand } from './logCommand';
import { Command } from '../interface/interface';
import { markCommand } from './markCommand';

const commandMap: Command[] = [
    musicCommand,
    fanyiCommand,
    backgroundCommand,
    helpCommand,
    clearCommand,
    biliCommand,
    historyCommand,
    logCommand,
    markCommand,
]

export {
    commandMap
}

