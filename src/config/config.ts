import { Service } from "typedi";

@Service()
export class AppConfig {
    aocChallengeUrlTemplate = 'https://adventofcode.com/:year/day/:day';
    aocSessionCookie = process.env.APP_AOC_SESSION_COOKIE || '';
    environment: 'development' | 'production' = 'development';
    userAgent = 'github.com/brenem/advent-of-code by brenem';
}
