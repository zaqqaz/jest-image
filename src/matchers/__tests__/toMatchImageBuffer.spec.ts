import * as fs from "fs";
import { toMatchImageBuffer } from "../toMatchImageBuffer";

expect.extend({ toMatchImageBuffer });

describe("toMatchImageBuffer", () => {
    it("Should match", async () => {
        const baseLineImageBuffer = fs.readFileSync("./src/matchers/__tests__/assets/1.png");
        (expect(baseLineImageBuffer) as any).toMatchImageBuffer();
    });

    it("Should not match", async () => {
        const baseLineImageBuffer = fs.readFileSync("./src/matchers/__tests__/assets/2.png");
        let hasError = false;

        try {
            (expect(baseLineImageBuffer) as any).toMatchImageBuffer();
        } catch {
            hasError = true;
        }

        expect(hasError).toBe(true);
    });
});
