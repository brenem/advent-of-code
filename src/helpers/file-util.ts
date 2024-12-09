import * as fs from 'node:fs';

export class FileUtil {
    private constructor() {}

    static async exists(path: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.access(path, fs.constants.F_OK, (err) => {
                resolve(!err);
            });
        });
    }

    static async readAllText(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    static async writeText(path: string, data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, 'utf8', (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }
}
