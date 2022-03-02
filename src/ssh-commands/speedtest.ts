import { z } from "zod";
import type { NodeSSH } from "node-ssh";

type Input = {
  readonly sshClient: NodeSSH;
};

const Output = z.object({
  serverId: z.string(),
  providerName: z.string(),
  latencyMilliseconds: z.number(),
  uploadBitsPerSecond: z.number(),
  downloadBitsPerSecond: z.number(),
});
type Output = z.infer<typeof Output>;

export default async ({ sshClient }: Input): Promise<Output> => {
  const result = await sshClient.execCommand(
    "/bin/ookla --configurl=http://www.speedtest.net/api/embed/netgear/config"
  );
  if (result.code !== 0) {
    throw new Error(JSON.stringify(result));
  }

  const pairs = result.stdout.split("\n").map((line) => {
    const [key, value] = line.split(":");
    return [key.trim(), value.trim()];
  });

  const pairsObj = Object.fromEntries(pairs);

  return Output.parse({
    serverId: pairsObj["serverid"],
    providerName: pairsObj["isp"],
    latencyMilliseconds: parseInt(pairsObj["latency"], 10),
    uploadBitsPerSecond: parseInt(pairsObj["upload"], 10),
    downloadBitsPerSecond: parseInt(pairsObj["download"], 10),
  });
};
