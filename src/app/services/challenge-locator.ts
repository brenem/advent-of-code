import { Challenge } from '../challenges/challenge';

export class ChallengeLocator {
    findChallenge(day: number, year: number): Promise<Challenge> {
        return import(`../challenges/${year}/Day${day}`).then(
            (module) => new module[`Day${day}`]() as Challenge
        );
    }
}
