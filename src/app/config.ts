export class AppConfig {
    environment: 'production' | 'development' = 'development';
    aocSessionCookie: string = '';
    aocChallengeUrlTemplate = 'https://adventofcode.com/:year/day/:day'
}
