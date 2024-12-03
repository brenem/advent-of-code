import { DayChallenge } from "../challenges/day-challenge";

export class ChallengeLocator {
    findChallenge(day: number, year: number): Promise<DayChallenge> {
        return new Promise((resolve, reject) => {
            import(`../challenges/${year}/Day${day}`).then((module) => {
                const challenge = new module[`Day${day}`](day, year);
                resolve(challenge);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}