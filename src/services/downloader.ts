import axios from 'axios';
import { AppConfig } from '../config/config';
import { Service } from 'typedi';

@Service()
export class Downloader {
    constructor(private config: AppConfig) { }

    async downloadInput(day: number, year?: number): Promise<Buffer> {
        if (!year) {
            const now = new Date();
            year = now.getMonth() < 11 ? now.getFullYear() - 1 : now.getFullYear();
        }

        const url = this.config.aocChallengeUrlTemplate
            .replace(':year', year.toString())
            .replace(':day', day.toString());
        const result = await this.get(`${url}/input`);
        return Buffer.from(result);
    }

    private async get(url: string): Promise<ArrayBuffer> {
        if (!this.config.aocSessionCookie) {
            throw new Error('Missing AOC session cookie');
        }

        const response = await axios.get(url, {
            headers: {
                ['Accept']: 'application/octet-stream, application/json, text/plain, */*',
                cookie: `session=${this.config.aocSessionCookie}`,
                ['User-Agent']: this.config.userAgent
            },
            responseType: 'arraybuffer'
        });

        return response.data;
    }
}
