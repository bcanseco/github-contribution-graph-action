# This version of Node.js or later is required for top-level await.
FROM node:14.3.0

# When running as a GitHub Action, the WORKDIR is controlled by GitHub.
# Furthermore, they recommend NOT setting it in the Dockerfile, which makes running locally difficult.
# Thus we copy files to an /app directory to also be used when running Docker outside GitHub Actions.
COPY . /app

# Executing a shell is required for environment variable substitution when running as a GitHub Action.
ENTRYPOINT ["sh", "-c", "cd /app && npm install --production && npm start"]
