import axios from 'axios';
import { AppConfig } from '../config/config';
import { Service } from 'typedi';

@Service()
export class Downloader {
    constructor(private config: AppConfig) { }

    async downloadInput(day: number, year?: number): Promise<string> {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const url = this.config.aocChallengeUrlTemplate
            .replace(':year', year.toString())
            .replace(':day', day.toString());
        const result = await this.get<string>(`${url}/input`);
        return result;
    }

    private async get<T>(url: string) {
        if (!this.config.aocSessionCookie) {
            throw new Error('Missing AOC session cookie');
        }

        const response = await axios.request<T>({
            headers: {
                cookie: `session=${this.config.aocSessionCookie}`
            },
            method: 'GET',
            url
        });

        return response.data as T;
    }
}
