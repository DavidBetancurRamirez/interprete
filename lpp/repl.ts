import { Program } from './ast';
import { evaluate } from './evaluator';
import Lexer from './lexer';
import { Environment } from './object';
import Parser from './parser';
import * as readline from "readline"

function printParseErrors(errors: string[]): void {
    for (const error of errors) {
        console.log(error);
    }
}

// Definición de una función asincrónica para iniciar el interprete
async function startRepl(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const env : Environment = new Environment()

    
    // Bucle para leer las lineas de entrada del usuario
    for await (const source of rl) {
        rl.setPrompt('>> ');

        if (source === 'salir()') {
            rl.close();
            return;
        }

        const lexer: Lexer = new Lexer(source);
        const parser: Parser = new Parser(lexer);

        const program: Program = parser.parseProgram();

        if (parser.errors.length > 0) {
            printParseErrors(parser.errors);
            continue;
        }

        const evaluated = evaluate(program, env);
        
        if (evaluated !== null && evaluated !== undefined) {
            console.log(evaluated?.inspect());
        }

        rl.prompt();
    }
}

export default startRepl;