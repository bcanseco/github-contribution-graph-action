import autoParse from 'auto-parse';
import dotenv from 'dotenv-extended'
import getUnixTime from 'date-fns/fp/getUnixTime';
import fromUnixTime from 'date-fns/fp/fromUnixTime';
import subDays from 'date-fns/fp/subDays';
import isWeekend from 'date-fns/fp/isWeekend';
import fs from 'fs/promises';
import git from 'simple-git';
import {getRandomInt} from './random';

const env = autoParse({
  GIT_BRANCH: process.env.GIT_BRANCH || process.env.GITHUB_REF?.replace(/^refs\/heads\//, ''),
  ORIGIN_TIMESTAMP: process.env.ORIGIN_TIMESTAMP || getUnixTime(new Date()),
  ...dotenv.load({errorOnMissing: true, includeProcessEnv: true}),
});
const localPath = './clone';
const repoPath = `https://${env.GITHUB_ACTOR}:${env.GITHUB_TOKEN}@${env.GIT_HOST}/${env.GITHUB_REPOSITORY}`;
const secondLine = 'Committed via https://github.com/marketplace/actions/autopopulate-your-contribution-graph';
const dayOffsets = [...Array(env.MAX_DAYS).keys()];

async function run() {
  try {
    await fs.mkdir(localPath);

    let gitInstance;
    if (env.FORCE_PUSH) {
      gitInstance = git(localPath);
      await gitInstance.init();
    } else {
      gitInstance = git();
      await gitInstance.clone(repoPath, localPath, ['--single-branch', '-b', env.GIT_BRANCH]);
    }

    await gitInstance.env({ GIT_SSH_COMMAND: env.GIT_SSH_COMMAND });
    await gitInstance.addConfig('user.name', env.GITHUB_ACTOR);
    await gitInstance.addConfig('user.email', env.GIT_EMAIL);

    await Promise.all(
      dayOffsets
        .map((dayOffset) => subDays(dayOffset, fromUnixTime(env.ORIGIN_TIMESTAMP)))
        .filter((day) => !(!env.INCLUDE_WEEKENDS && isWeekend(day)))
        .filter((day) => !(!env.INCLUDE_WEEKDAYS && !isWeekend(day)))
        .map(async (/** @type {Date} */ day) => {
          const commitsToMake = getRandomInt(env.MIN_COMMITS_PER_DAY, env.MAX_COMMITS_PER_DAY);
          return Promise.all(
            [...Array(commitsToMake)].map(async (_, i) => {
              try {
                const { commit: sha } = await gitInstance.commit([env.GIT_COMMIT_MESSAGE, secondLine], {
                  '--allow-empty': null,
                  '--date': `format:iso8601:${day.toISOString()}`,
                });
                console.log(`Successfully committed ${sha} on ${day.toISOString()} (${i + 1} / ${commitsToMake})`);
              } catch (error) {
                console.error(`Error committing to git: ${error.message}`);
              }
            })
          );
        })
    );

    await gitInstance.push(repoPath, `HEAD:${env.GIT_BRANCH}`, env.FORCE_PUSH && { '--force': null });
    console.log('Successfully pushed changes to git.');
  } catch (error) {
    console.error(`Error running script: ${error.message}`);
  }
}

run();
