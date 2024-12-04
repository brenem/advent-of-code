import { Logger } from "@deepkit/logger";
import axios from 'axios';
import { AppConfig } from "../config";

export class Downloader {
    constructor(private logger: Logger, private config: AppConfig) {}

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