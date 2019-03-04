import * as fs from "fs";
import * as path from "path";
import { checkSnapshotUpdateState, updateSnapshotState } from "../helpers/updateSnapshotState";
import { SNAPSHOTS_DIR } from "../helpers/const";
import { saveImage } from "../helpers/saveImage";
import { generateSnapshotIdentifier } from "../helpers/generateSnapshotIdentifier";

export interface ToMatchImageBufferConfig {
    customSnapshotIdentifier?: string;
    customSnapshotsDir?: string;
}

export function toMatchImageBuffer(this: any, receivedImageBuffer: Buffer, config: ToMatchImageBufferConfig = {}) {
    const {
        testPath,
        currentTestName,
        isNot,
        snapshotState,
    } = this;

    const {
        customSnapshotIdentifier,
        customSnapshotsDir,
    } = config;

    if (isNot) {
        throw new Error('Jest: `.not` cannot be used with `.toMatchImageBuffer()`.');
    }

    updateSnapshotState(
        snapshotState,
        {
            _counters: snapshotState._counters.set(
                currentTestName,
                (snapshotState._counters.get(currentTestName) || 0) + 1,
            )
        }
    );

    const snapshotIdentifier = customSnapshotIdentifier || generateSnapshotIdentifier(testPath, currentTestName, snapshotState);
    const snapshotsDir = customSnapshotsDir || path.join(path.dirname(testPath), SNAPSHOTS_DIR);
    const baselineSnapshotPath = path.join(snapshotsDir, `${snapshotIdentifier}-snap.png`);

    let result: { added?: boolean; updated?: boolean } = {};

    if (!fs.existsSync(baselineSnapshotPath)) {
        saveImage(snapshotsDir, baselineSnapshotPath, receivedImageBuffer);
        result = { added: true };
    }

    const snapshotUpdateState = checkSnapshotUpdateState(snapshotState, baselineSnapshotPath);

    if (snapshotUpdateState) {
        return snapshotUpdateState;
    }

    if (result.updated) {
        updateSnapshotState(snapshotState, { updated: snapshotState.updated + 1 });
    } else if (result.added) {
        updateSnapshotState(snapshotState, { added: snapshotState.added + 1 });
    }

    const baseLineImageBuffer = fs.readFileSync(baselineSnapshotPath);
    return {
        pass: baseLineImageBuffer.equals(receivedImageBuffer),
        message: () => `Image buffers are different`,
    }
}
