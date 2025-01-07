import { Vector } from '../types';
import type { Heuristic } from './index';

export const manhattan: Heuristic = (from: Vector, to: Vector) => {
  return Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
};