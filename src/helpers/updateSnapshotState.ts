import { merge } from "lodash";
import * as fs from "fs";
import chalk from "chalk";

export function updateSnapshotState(originalSnapshotState: any, partialSnapshotState: any) {
    if ((global as any).UNSTABLE_SKIP_REPORTING) {
        return originalSnapshotState;
    }
    return merge(originalSnapshotState, partialSnapshotState);
}

export function checkSnapshotUpdateState(snapshotState: any, baselineSnapshotPath: string) {
    if (snapshotState._updateSnapshot === 'none' && !fs.existsSync(baselineSnapshotPath)) {
        return {
            pass: false,
            message: () => `New snapshot was ${chalk.bold.red('not written')}. The update flag must be explicitly ` +
                'passed to write a new snapshot.\n\n + This is likely because this test is run in a continuous ' +
                'integration (CI) environment in which snapshots are not written by default.\n\n',
        };
    }
}
