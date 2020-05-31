# Contributing guide

Thanks for considering a contribution to this project! 🙏

## Local development with Docker 🐳

### Requirements 📝

* [git](https://git-scm.com)
* [Docker](https://docs.docker.com/get-docker/)

### Setup 🛠

1. Clone and navigate to the repo:
   ```console
   $ git clone https://github.com/bcanseco/github-contribution-graph-action.git
   $ cd github-contribution-graph-action
   ```
1. Create an `.env` file:
   ```console
   $ cp .env.example .env
   ```
1. Fill in the values.
   * `GITHUB_ACTOR`: Set this to your GitHub username.
     * e.g. `bcanseco`
     * Note that when running as a GitHub Action, the user doesn't need to provide this.
   * `GITHUB_REPOSITORY`: Set this to your username followed by a slash and your repository name.
     * e.g. `bcanseco/github-contribution-graph-action`
     * Again, this is only necessary when running locally.
   * `GITHUB_TOKEN`: Set this to [your personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).
     * Make sure to check the **Repo** boxes.
     * Note that the personal access token has more permissions than the `GITHUB_TOKEN` provided by the Actions runner. Read more about this [here](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token).
   * `GIT_EMAIL`: Set this to [an email associated with your GitHub account](https://github.com/settings/emails).
1. Make sure your Docker daemon is running.

### Running 👟

Use the commands below to build and run a container:

```console
$ docker build -t github-contribution-graph-action .
$ docker run --rm github-contribution-graph-action
```

You can alternatively run `npm start` directly without Docker, but this isn't recommended.

## Q&A 🤔

### Why is this a Docker action and not a JavaScript action? 📦

Two reasons:

1. For things like this that mess with the `git` CLI directly, it's easier to test with containers.
1. You cannot currently specify an [npm run-script](https://docs.npmjs.com/cli/run-script) (e.g. `npm start`) as an entrypoint with JavaScript actions.

### Why go with Unix rather than ISO for `ORIGIN_TIMESTAMP`? ⌚

For some reason, the GitHub Actions runner mutates ISO timestamp strings passed as environment variables into something unparseable by the `date-fns` library.

### Why use environment variables instead of [inputs][inputs]? 🔌

[inputs]: https://help.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs

Two reasons:

1. GitHub transforms input parameter casing and prepends `INPUT_`, so additional code would be necessary to revert this before processing them.
1. Input parameters are expected to be documented in the [action definition](../action.yml), which would be yet another source of truth to maintain.
