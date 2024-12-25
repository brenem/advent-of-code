import { Direction } from "./directions";
import { Point } from "./point";

export interface Heading {
    location: Point;
    direction: Direction;
}