import { Challenge } from '../challenges/challenge';
import { Service } from 'typedi';

@Service()
export class ChallengeLocator {
    async findChallenge(day: number, year: number): Promise<Challenge> {
        const module = await import(`../challenges/${year}/Day${day}`);
        return new module[`Day${day}`]() as Challenge;
    }
}
