import { Service } from "typedi";

@Service()
export class Logger {
    error(message: string) {
        console.error(message);
    }

    log(message: string) {
        console.log(message);
    }

    warn(message: string) {
        console.warn(message);
    }    
}