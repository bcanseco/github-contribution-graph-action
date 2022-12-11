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
   $ cp .env.schema .env
   ```
1. Fill in the values.
   * `GITHUB_ACTOR`: Set this to your GitHub username.
     * e.g. `bcanseco`
     * Note that when running as a GitHub Action, the user doesn't need to provide this.
   * `GITHUB_REPOSITORY`: Set this to your username followed by a slash and your repository name.
     * e.g. `bcanseco/github-contribution-graph-action`
     * Again, this is only necessary when running locally.
   * `GITHUB_TOKEN`: Set this to [your personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
     * Make sure to check the **Repo** boxes.
     * Note that the personal access token has more permissions than the `GITHUB_TOKEN` provided by the Actions runner. Read more about this [here](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token).
   * `GIT_EMAIL`: Set this to [an email associated with your GitHub account](https://github.com/settings/emails).
   * `GIT_BRANCH`: Set this to `master`.
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

[inputs]: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs

Two reasons:

1. GitHub transforms input parameter casing and prepends `INPUT_`, so additional code would be necessary to revert this before processing them.
1. Input parameters are expected to be documented in the [action definition](../action.yml), which would be yet another source of truth to maintain.

### Why not add a cool `CUSTOM_TEXT` feature for writing on the grid? 🎨

This is a great idea! In theory, this GitHub Action could re-draw your custom string of text every week or so. That way it stays in the center of your contribution graph.

Unfortunately though, commits made on a GitHub repository will always show on the graph even if those commits are later removed through a force push. This means that every time we would try to re-draw, the old text would remain on your graph.

You can already imagine the consequences:

* Text overlapping
* Seeing last year's strings cut-off
* Repeated text

A workaround involves deleting and recreating the GitHub repo for the user on each run, but that requires permissions that the `GITHUB_TOKEN` doesn't provide. For now I'm calling this out-of-scope, but feel free to open an issue if you have any ideas.
