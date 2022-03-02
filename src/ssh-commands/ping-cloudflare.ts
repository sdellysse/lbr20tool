import { NodeSSH } from "node-ssh";

type Input = {
  readonly sshClient: NodeSSH;
};

type Output = {
  readonly durationMilliseconds: number;
  readonly success: boolean;
};

export default async ({ sshClient }: Input): Promise<Output> => {
  const startTime = new Date().getTime();
  const result = await sshClient.execCommand(
    "/usr/bin/curl --fail --output /dev/null --max-time 5 --silent http://1.1.1.1"
  );
  const durationMilliseconds = new Date().getTime() - startTime;

  return { durationMilliseconds, success: result.code === 0 };
};
