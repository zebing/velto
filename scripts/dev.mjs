import { globSync } from "glob";
import path from "path";
import { execSync } from "child_process";

const dirPath = path.resolve(process.cwd(), "./packages");

const paths = globSync("*", {
  cwd: dirPath,
  absolute: true,
  nodir: false,
  dot: false,
});

const filterPaths = paths.map(
  (p) => `--filter ./${path.relative(process.cwd(), p)}`
);

const command = `pnpm ${filterPaths.join(" ")} dev`;

execSync(command, {
  stdio: "inherit",
  shell: true,
});
