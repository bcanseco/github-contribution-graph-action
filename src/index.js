import git from 'simple-git/promise';
import subDays from 'date-fns/fp/subDays';
import getUnixTime from 'date-fns/fp/getUnixTime';
import fromUnixTime from 'date-fns/fp/fromUnixTime';
import isWeekend from 'date-fns/fp/isWeekend';

const {
  GITHUB_ACTOR,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  GIT_EMAIL,
  GIT_BRANCH = 'master',
  GIT_HOST = 'github.com',
  GIT_COMMIT_MESSAGE = 'chore(actions): empty commit for contribution graph',
  GIT_SSH_COMMAND = 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no',

  ORIGIN_TIMESTAMP = getUnixTime(new Date()),
  MAX_DAYS = 1,
  INCLUDE_WEEKDAYS = true,
  INCLUDE_WEEKENDS = true,
} = process.env;

const repoPath = `https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@${GIT_HOST}/${GITHUB_REPOSITORY}`;
const localPath = './clone';
const secondLine = 'Committed via https://github.com/marketplace/actions/autopopulate-your-contribution-graph';
const dayOffsets = [...Array(Number(MAX_DAYS)).keys()];
const originDay = fromUnixTime(ORIGIN_TIMESTAMP);

await git().clone(repoPath, localPath, ['--single-branch', '-b', GIT_BRANCH]);
await git(localPath).env({GIT_SSH_COMMAND});
await git(localPath).addConfig('user.name', GITHUB_ACTOR);
await git(localPath).addConfig('user.email', GIT_EMAIL);

const commitCreators = dayOffsets
  .map((dayOffset) => subDays(dayOffset, originDay))
  .filter((day) => !(!JSON.parse(INCLUDE_WEEKENDS) && isWeekend(day)))
  .filter((day) => !(!JSON.parse(INCLUDE_WEEKDAYS) && !isWeekend(day)))
  .map((day) => async () => {
    const {commit: sha} = await git(localPath).commit([GIT_COMMIT_MESSAGE, secondLine], {
      '--allow-empty': null,
      '--date': `format:iso8601:${day.toISOString()}`,
    });
    console.log(`Successfully committed ${sha}`);
  });

await commitCreators.reduce((p, nextPromise) => p.then(nextPromise), Promise.resolve());
await git(localPath).push(repoPath, GIT_BRANCH);
