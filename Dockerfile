FROM node:16.11.1

# When running as a GitHub Action, the WORKDIR is controlled by GitHub.
# Furthermore, they recommend NOT setting it in the Dockerfile, which makes running locally difficult.
# Thus we copy files to another directory and cd into it before running (regardless of the environment).
COPY . /github-contribution-graph-action

# Executing a shell is required for environment variable substitution when running as a GitHub Action.
ENTRYPOINT ["sh", "-c", "cd /github-contribution-graph-action && npm install --production && npm start"]
