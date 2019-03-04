import * as path from "path";
import { kebabCase } from "lodash";

export function generateSnapshotIdentifier(testPath: string, currentTestName: string, snapshotState: any) {
    return kebabCase(`${path.basename(testPath)}-${currentTestName}-${snapshotState._counters.get(currentTestName)}`);
}
