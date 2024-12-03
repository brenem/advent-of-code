import { Logger } from "@deepkit/logger";
import { Filesystem, FilesystemLocalAdapter} from '@deepkit/filesystem';
import axios from 'axios';
import { AppConfig } from "../config";

export class Downloader {
    inputDir: Filesystem;

    constructor(private logger: Logger, private config: AppConfig) {
        const adapter = new FilesystemLocalAdapter({root: __dirname + '/src/app/inputs'}); // root is the directory where the files will be saved
        this.inputDir = new Filesystem(adapter);
    }

    async downloadInput(day: number, year?: number): Promise<string> {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const url = this.config.aocChallengeUrlTemplate.replace(':year', year.toString()).replace(':day', day.toString());
        const result = await this.get<string>(`${url}/input`);
        return result;
    }

    private async get<T>(url: string) {
        const response = await axios.request<T>({
            url,
            method: 'GET',
            headers: {
                cookie: `session=${this.config.aocSessionCookie}`
            }
        });

        return response.data as T;
    }
}