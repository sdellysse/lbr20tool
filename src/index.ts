import { NodeSSH } from "node-ssh";
import { z } from "zod";
import pingCloudflare from "./ssh-commands/ping-cloudflare";
import speedtest from "./ssh-commands/speedtest";

(async () => {
  const Env = z.object({
    LBR20_HOST: z.string(),
    LBR20_PASS: z.string(),
  });

  const env = Env.parse(process.env);

  const sshClient = await new NodeSSH().connect({
    host: env.LBR20_HOST,
    password: env.LBR20_PASS,
    username: "root",
  });

  console.log({ ping: await pingCloudflare({ sshClient }) });
  console.log({ speedtest: await speedtest({ sshClient }) });
})();
