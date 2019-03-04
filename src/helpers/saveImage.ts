import * as fs from "fs";
import * as mkdirp from "mkdirp";

export function saveImage(snapshotsDir: string, baselineSnapshotPath: string, receivedImageBuffer: Buffer) {
    mkdirp.sync(snapshotsDir);
    fs.writeFileSync(baselineSnapshotPath, receivedImageBuffer);
}
