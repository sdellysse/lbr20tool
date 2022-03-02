import type { NodeSSH } from "node-ssh";

type Input = {
  readonly sshClient: NodeSSH;
};

type Output = string;

export default async ({ sshClient }: Input): Promise<Output> => {
  const result = await sshClient.execCommand(
    `/bin/echo -ne "AT+CGSN\r\n" | /usr/bin/microcom -X -t 1000 /dev/ttyUSB2`
  );

  if (result.code !== 0) {
    throw new Error(JSON.stringify(result));
  }

  const regexp = /AT\+CGSN\r\r\n(\d+)\r\n\r\nOK/;
  const match = regexp.exec(result.stdout);

  if (match?.length !== 2) {
    throw new Error(JSON.stringify(result));
  }

  return match[1];
};
