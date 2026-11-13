import { getMessage } from "@frontal-labs/error";
import { Podyard } from "@podyard/sdk";
import { Command } from "commander";

const program = new Command();

program.name("podyard").description("Podyard CLI").version("0.1.0");

program
  .command("init")
  .description("Initialize a new project workspace")
  .option("-n, --name <name>", "project name")
  .action((opts: { name?: string }) => {
    const name = opts.name ?? "my-podyard-app";
    console.log(`Initialized ${name}`);
  });

program
  .command("sandboxes")
  .description("List sandboxes for the configured API key")
  .action(async () => {
    try {
      const client = Podyard.fromEnv();
      const sandboxes = await client.sandboxes.list();
      console.log(JSON.stringify(sandboxes, null, 2));
    } catch (err) {
      console.error(getMessage(err) ?? "Unknown error");
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(getMessage(err) ?? "Unknown error");
  process.exit(1);
});
