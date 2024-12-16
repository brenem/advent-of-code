import * as fs from 'node:fs';
import { Service } from "typedi";

@Service()
export class FileHandler {
    async exists(path: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.access(path, fs.constants.F_OK, (err) => {
                resolve(!err);
            });
        });
    }

    async readAllText(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    async writeText(path: string, data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // if folder at path does not exist, create it before writing the file
            const folder = path.substring(0, path.lastIndexOf('/'));
            if (!fs.existsSync(folder)) {
                // create folder
                fs.mkdirSync(folder, { recursive: true }); 
            }
            
            fs.writeFile(path, data, 'utf8', (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }

    async writeBuffer(path: string, data: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            // if folder at path does not exist, create it before writing the file
            const folder = path.substring(0, path.lastIndexOf('/'));
            if (!fs.existsSync(folder)) {
                // create folder
                fs.mkdirSync(folder, { recursive: true }); 
            }
            
            fs.writeFile(path, data,  'utf8', (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }
}