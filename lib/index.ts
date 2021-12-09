import ora from 'ora';
import { execSync } from 'child_process';

// 封装loading效果
export const waitFnLoading =
  (fn: Function, messageStart: string, messageEnd: string) =>
  async (...args: any) => {
    const spinner = ora(messageStart);
    spinner.start();
    const result = await fn(...args);
    spinner.text = messageEnd;
    spinner.succeed();
    return result;
  };
// 打印logo
export const printLogo = (logo: string) => {
  try {
    execSync(`figlet -c '${logo}'`, { stdio: [0, 1, 2] });
  } catch (error) {
    console.warn("run 'brew install figlet'");
  }
};
