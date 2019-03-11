import * as fs from "fs";
import { toMatchImageSnapshot } from "../toMatchImageSnapshot";

expect.extend({ toMatchImageSnapshot });

describe("toMatchImageSnapshot", () => {
    it("Should match", async () => {
        const baseLineImageBuffer = fs.readFileSync("./src/matchers/__tests__/assets/1.png");
        (expect(baseLineImageBuffer) as any).toMatchImageSnapshot();
    });
});
