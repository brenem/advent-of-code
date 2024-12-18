import { findInSet } from '../../helpers/grid-helpers';
import { LinkedList } from '../../models/linked-list';
import { Point } from '../../models/point';
import { Queue } from '../../models/queue';
import { Challenge } from '../challenge';

export class Day12 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const gardenMap = this.dataLoader.read2DMap(input, (x) => x);
        const plotMap = this.buildPlotMap(gardenMap);

        let fencePrice = 0;

        for (const [key, value] of plotMap) {
            const plotLabel = key;
            const plotLocations = value;

            const regions = this.buildRegions(plotLocations);
            let remainingPlots = this.findPlotNotInARegion(plotLocations, regions);

            while (remainingPlots.length > 0) {
                const newRegions = this.buildRegions(remainingPlots);
                newRegions.forEach((r) => regions.add(r));

                remainingPlots = this.findPlotNotInARegion(remainingPlots, regions);
            }

            let regionPriceSum = 0;

            for (const region of regions) {
                const regionPrice = this.calculateRegionPrice(plotLabel, region);
                regionPriceSum += regionPrice;
            }

            fencePrice += regionPriceSum;
        }

        return fencePrice;
    }

    async part2(input: string): Promise<number | bigint> {
        const gardenMap = this.dataLoader.read2DMap(input, (x) => x);
        const plotMap = this.buildPlotMap(gardenMap);

        let fencePrice = 0;

        for (const [key, value] of plotMap) {
            const plotLabel = key;
            const plotLocations = value;

            const regions = this.buildRegions(plotLocations);
            let remainingPlots = this.findPlotNotInARegion(plotLocations, regions);

            while (remainingPlots.length > 0) {
                const newRegions = this.buildRegions(remainingPlots);
                newRegions.forEach((r) => regions.add(r));

                remainingPlots = this.findPlotNotInARegion(remainingPlots, regions);
            }

            let regionPriceSum = 0;

            for (const region of regions) {
                const regionPrice = this.calculateRegionPriceWithBulkDiscount(plotLabel, region);
                regionPriceSum += regionPrice;
            }

            fencePrice += regionPriceSum;
        }

        return fencePrice;
    }

    private buildPlotMap(gardenMap: string[][]): Map<string, Point[]> {
        const plotMap = new Map<string, Point[]>();
        for (let row = 0; row < gardenMap.length; row++) {
            for (let col = 0; col < gardenMap[row].length; col++) {
                const plotLabel = gardenMap[row][col];
                const plotLocation: Point = { x: col, y: row };

                if (plotMap.has(plotLabel)) {
                    plotMap.get(plotLabel)!.push(plotLocation);
                } else {
                    plotMap.set(plotLabel, [plotLocation]);
                }
            }
        }

        return plotMap;
    }

    private buildRegions(plotLocations: Point[]): Set<Point[]> {
        const regions = new Set<Point[]>();
        const queue = new Queue<Point>();
        queue.enqueue(plotLocations[0]);

        while (queue.size() > 0) {
            const currentLocation = queue.dequeue()!;
            const currentRegion = findInSet(regions, (r) =>
                r.some((p) => p.x === currentLocation.x && p.y === currentLocation.y)
            );
            if (currentRegion) {
                // find next adjacent plot
                const adjacentPlots = [
                    { x: currentLocation.x - 1, y: currentLocation.y },
                    { x: currentLocation.x + 1, y: currentLocation.y },
                    { x: currentLocation.x, y: currentLocation.y - 1 },
                    { x: currentLocation.x, y: currentLocation.y + 1 }
                ];

                for (const adjacentPlot of adjacentPlots) {
                    const plot = plotLocations.find((p) => p.x === adjacentPlot.x && p.y === adjacentPlot.y);
                    if (plot) {
                        if (!currentRegion.some((p) => p.x === plot.x && p.y === plot.y)) {
                            currentRegion.push(plot);
                            queue.enqueue(plot);
                        }
                    }
                }
            } else {
                // find next region
                const newRegion: Point[] = [currentLocation];
                regions.add(newRegion);

                const adjacentPlots = [
                    { x: currentLocation.x - 1, y: currentLocation.y },
                    { x: currentLocation.x + 1, y: currentLocation.y },
                    { x: currentLocation.x, y: currentLocation.y - 1 },
                    { x: currentLocation.x, y: currentLocation.y + 1 }
                ];

                for (const adjacentPlot of adjacentPlots) {
                    const plot = plotLocations.find((p) => p.x === adjacentPlot.x && p.y === adjacentPlot.y);
                    if (plot) {
                        if (!newRegion.some((p) => p.x === plot.x && p.y === plot.y)) {
                            newRegion.push(plot);
                            queue.enqueue(plot);
                        }
                    }
                }
            }
        }

        return regions;
    }

    private findPlotNotInARegion(plotLocations: Point[], regions: Set<Point[]>): Point[] {
        return plotLocations.filter(
            (p) => !Array.from(regions).some((r) => r.some((rp) => rp.x === p.x && rp.y === p.y))
        );
    }

    private calculateRegionPrice(plotLabel: string, region: Point[]): number {
        const regionArea = region.length;

        let perimeter = region.length * 4;

        for (const plot of region) {
            const adjacentPlots = [
                { x: plot.x - 1, y: plot.y },
                { x: plot.x + 1, y: plot.y },
                { x: plot.x, y: plot.y - 1 },
                { x: plot.x, y: plot.y + 1 }
            ];

            for (const adjacentPlot of adjacentPlots) {
                const found = region.find((p) => p.x === adjacentPlot.x && p.y === adjacentPlot.y);
                if (found) {
                    perimeter--;
                }
            }
        }

        const regionPrice = regionArea * perimeter;
        return regionPrice;
    }

    private calculateRegionPriceWithBulkDiscount(plotLabel: string, region: Point[]): number {
        let upSides = 0;
        let downSides = 0;
        let leftSides = 0;
        let rightSides = 0;

        for (const plot of region) {
            const left = plot.x - 1;
            const right = plot.x + 1;
            const up = plot.y - 1;
            const down = plot.y + 1;
            
            const rightNotInRegion = !region.some((p) => p.x === right && p.y === plot.y);
            const downNotInRegion = !region.some((p) => p.x === plot.x && p.y === down);

            if (!region.some((p) => p.x === plot.x && p.y === up)) {
                if (rightNotInRegion || region.some((p) => p.x === right && p.y === up)) {
                    upSides++;
                }
            }

            if (!region.some((p) => p.x === plot.x && p.y === down)) {
                if (rightNotInRegion || region.some((p) => p.x === right && p.y === down)) {
                    downSides++;
                }
            }

            if (!region.some((p) => p.x === left && p.y === plot.y)) {
                if (downNotInRegion || region.some((p) => p.x === left && p.y === down)) {
                    leftSides++;
                }
            }

            if (!region.some((p) => p.x === right && p.y === plot.y)) {
                if (downNotInRegion || region.some((p) => p.x === right && p.y === down)) {
                    rightSides++;
                }
            }
        }

        const regionArea = region.length;
        const sides = upSides + downSides + leftSides + rightSides;

        const regionPrice = regionArea * sides;
        return regionPrice;
    }
}
