import child_process from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { promisify } from 'util';
import { inc as semverInc } from 'semver';
import { ReleaseParams } from './index.d';

const exec = promisify(child_process.exec);

const run = async (command: string) => {
  console.log(chalk.green(command));
  return await exec(command);
};

const getNextVersions = (currentVersion: string): Record<string, any> => ({
  major: semverInc(currentVersion, 'major'),
  minor: semverInc(currentVersion, 'minor'),
  patch: semverInc(currentVersion, 'patch'),
  premajor: semverInc(currentVersion, 'premajor'),
  preminor: semverInc(currentVersion, 'preminor'),
  prepatch: semverInc(currentVersion, 'prepatch'),
  prerelease: semverInc(currentVersion, 'prerelease')
});

const promptNextVersion = async (currentVersion: string) => {
  const nextVersions = getNextVersions(currentVersion);
  const { nextVersion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextVersion',
      message: `Please select the next version (current version is ${currentVersion})`,
      choices: Object.keys(nextVersions).map((name) => ({
        name: `${name} => ${nextVersions[name]}`,
        value: nextVersions[name]
      }))
    }
  ]);
  return nextVersion;
};

const updatePkgVersion = async (nextVersion: string) => {
  await run(
    `npm version ${nextVersion} -m "release ${nextVersion}" -no-git-tag-version`
  );
};
//TODO:do test
// const test = async () => {
//   logTime('Test', 'start')
//   await run(`yarn test:coverage`)
//   logTime('Test', 'end')
// }

const genChangelog = async () => {
  await run('npx conventional-changelog -p angular -i CHANGELOG.md -s');
};

const push = async (nextVersion: string, mainBranch: string) => {
  const curBranch = await run('git rev-parse --abbrev-ref HEAD');
  const curBranchName = curBranch.stdout.toString().replace(/\s+/g, '');
  console.log();
  console.log('当前分支名:', curBranchName);
  await run('git add .');
  await run(`git commit -m "ci: 🎡 release v${nextVersion}" -n`);
  await run('git push');
  await run(`git checkout ${mainBranch}`);
  await run(
    `git merge ${curBranchName} && git push && git checkout ${curBranchName}`
  );
};

const tag = async (nextVersion: string) => {
  await run(`git tag v${nextVersion}`);
  await run(`git push origin v${nextVersion}`);
};

const build = async () => {
  await run(`npm run build`);
};

const publish = async (npmRegistry: string, npmAuthToken: string) => {
  // get domain of registry
  const tmp = npmRegistry.split('://');
  await run(`npm set //${tmp[1]}/:_authToken ${npmAuthToken}`);
  await run(`npm publish --registry ${npmRegistry}`);
};

const main = async (params: ReleaseParams) => {
  const {
    currentVersion,
    npmRegistry,
    npmAuthToken,
    mainBranch = 'master',
    needPublish = false
  } = params;
  try {
    const nextVersion = await promptNextVersion(currentVersion);

    // await test();
    await updatePkgVersion(nextVersion);
    await genChangelog();
    const { needBuild } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'needBuild',
        message: `Do you want to building? If you want to build, please make sure you include the 'build' script`
      }
    ]);
    if (needBuild) {
      await build();
    }
    await push(nextVersion, mainBranch);
    await tag(nextVersion);
    if (needPublish && npmRegistry && npmAuthToken) {
      await publish(npmRegistry, npmAuthToken);
    }

    console.log(chalk.green(`Release Success`));
  } catch (err) {
    console.log(chalk.red(`Release Fail: ${err}`));
  }
};

export type { ReleaseParams };

export default main;
