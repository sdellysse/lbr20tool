import type { NodeSSH } from "node-ssh";
import getImei from "./get-imei";

describe("ssh-commands/get-imei", () => {
  it("should throw result data when code is not zero", async () => {
    expect.assertions(1);

    try {
      await getImei({
        sshClient: {
          execCommand: () =>
            Promise.resolve({
              code: 1,
              stderr: "foo",
              stdout: "bar",
            }),
        } as unknown as NodeSSH,
      });
    } catch (e) {
      expect(e).toMatchInlineSnapshot(
        `[Error: {"code":1,"stderr":"foo","stdout":"bar"}]`
      );
    }
  });

  it("should throw result data when stdout doesn't match regexp", async () => {
    expect.assertions(1);

    try {
      await getImei({
        sshClient: {
          execCommand: () =>
            Promise.resolve({
              code: 0,
              stderr: "foo",
              stdout: "bar",
            }),
        } as unknown as NodeSSH,
      });
    } catch (e) {
      expect(e).toMatchInlineSnapshot(
        `[Error: {"code":0,"stderr":"foo","stdout":"bar"}]`
      );
    }
  });

  it("should be executing the correct command", async () => {
    const execCommandMock = jest.fn();
    execCommandMock.mockImplementation(() =>
      Promise.resolve({
        code: 0,
        stdout: "AT+CGSN\r\r\n1234567890\r\n\r\nOK",
      })
    );

    const imei = await getImei({
      sshClient: {
        execCommand: execCommandMock,
      } as unknown as NodeSSH,
    });

    expect(imei).toBe("1234567890");
    expect(execCommandMock).toHaveBeenCalledWith(
      `/bin/echo -ne "AT+CGSN\r\n" | /usr/bin/microcom -X -t 1000 /dev/ttyUSB2`
    );
  });
});
