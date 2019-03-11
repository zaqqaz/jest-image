import { PNG } from "pngjs";
import { toMatchImageBuffer, ToMatchImageBufferConfig } from "./toMatchImageBuffer";
import * as fs from "fs";
import * as path from "path";
import { generateSnapshotIdentifier } from "../helpers/generateSnapshotIdentifier";
import { SNAPSHOTS_DIR } from "../helpers/const";
import { dynamicPixelMatch, PixelPosition } from "../helpers/dynamicPixelmatch";
import * as mkdirp from "mkdirp";
import * as childProcess from "child_process";
import * as rimraf from "rimraf";
import { updateSnapshotState } from "../helpers/updateSnapshotState";
import chalk from "chalk";
import { saveImage } from "../helpers/saveImage";

interface MatcherResult {
    pass: boolean;
    message: string | (() => string);
}

export enum ThresholdType {
    Percent = "percent",
    Pixel = "pixel",
}

interface ToMatchImageSnapshotConfig extends ToMatchImageBufferConfig {
    failureThreshold?: number;
    failureThresholdType?: ThresholdType;
    verbose?: boolean;
    excludedAreas?: PixelPosition[];
    diffConfig?: any;
    withReporter?: boolean;
}

export function toMatchImageSnapshot(this: any, receivedImageBuffer: Buffer, config: ToMatchImageSnapshotConfig = {}): MatcherResult {
    const bufferResult = toMatchImageBuffer.call(this, receivedImageBuffer, config);
    if (bufferResult.pass) {
        return bufferResult;
    } else {
        const {
            testPath,
            currentTestName,
            isNot,
            snapshotState,
        } = this;

        const {
            failureThresholdType = ThresholdType.Pixel,
            customSnapshotIdentifier,
            customSnapshotsDir,
            excludedAreas = [],
            failureThreshold = 0,
            diffConfig = {
                threshold: 0.01,
            },
        } = config;

        // todo: refactor it (move to function/unify with toMatchImageBuffer)
        const snapshotIdentifier = customSnapshotIdentifier || generateSnapshotIdentifier(testPath, currentTestName, snapshotState);
        const snapshotsDir = customSnapshotsDir || path.join(path.dirname(testPath), SNAPSHOTS_DIR);
        const baselineSnapshotPath = path.join(snapshotsDir, `${snapshotIdentifier}-snap.png`);
        const baseLineImageBuffer = fs.readFileSync(baselineSnapshotPath);
        const receivedImage = PNG.sync.read(receivedImageBuffer);
        const baselineImage = PNG.sync.read(baseLineImageBuffer);
        const imageWidth = receivedImage.width;
        const imageHeight = receivedImage.height;
        const diffImage = new PNG({ width: imageWidth, height: imageHeight });

        // DIFF
        const outputDir = path.join(snapshotsDir, '__diff_output__');
        const diffOutputPath = path.join(outputDir, `${snapshotIdentifier}-diff.png`);
        rimraf.sync(diffOutputPath);

        const diffPixelCount = dynamicPixelMatch(
            receivedImage.data,
            baselineImage.data,
            diffImage.data,
            imageWidth,
            imageHeight,
            diffConfig,
            excludedAreas,
        );

        const totalPixels = imageWidth * imageHeight;
        const diffRatio = diffPixelCount / totalPixels;
        const hasSizeMismatch = (
            receivedImage.height !== baselineImage.height ||
            receivedImage.width !== baselineImage.width
        );

        let pass = false;
        if (hasSizeMismatch) {
            // Always fail test on image size mismatch
            pass = false;
        } else if (failureThresholdType === 'pixel') {
            pass = diffPixelCount <= failureThreshold;
        } else if (failureThresholdType === 'percent') {
            pass = diffRatio <= failureThreshold;
        } else {
            throw new Error(`Unknown failureThresholdType: ${failureThresholdType}. Valid options are "pixel" or "percent".`);
        }


        if (!pass) {
            mkdirp.sync(outputDir);
            const compositeResultImage = new PNG({
                width: imageWidth * 3,
                height: imageHeight,
            });
            // copy baseline, diff, and received images into composite result image
            PNG.bitblt(baselineImage, compositeResultImage, 0, 0, imageWidth, imageHeight, 0, 0);
            PNG.bitblt(diffImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth, 0);
            PNG.bitblt(receivedImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth * 2, 0);

            saveImage(".", diffOutputPath, PNG.sync.write(compositeResultImage));

            updateSnapshotState(snapshotState, { unmatched: snapshotState.unmatched + 1 });
            const differencePercentage = diffRatio * 100;

            return {
                pass: false,
                message: `Expected image to match or be a close match to snapshot but was ${differencePercentage}% different from snapshot (${diffPixelCount} differing pixels).\n`
                + `${chalk.bold.red('See diff for details:')} ${chalk.red(diffOutputPath)}`,
            };
        }

        return {
            pass: pass,
            message: "",
        };
    }
}
