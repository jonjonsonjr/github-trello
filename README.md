# github-trello

I couldn't find a really easy way to deploy GitHub integration with Trello, so I made one.

## Usage

### 1. Acquire Key

[Get your Trello API key.](https://trello.com/app-key)

Save this for later. This is your `TRELLO_KEY`.

### 2. Acquire Token

[Use that to get an OAuth token.](https://trello.com/1/authorize?response_type=token&name=github-trello&scope=read,write&expiration=never&key=) (Add your token to the end of the URL.)

Save this for later. This is your `TRELLO_TOKEN`.

### 3. Acquire List Name

Create a list on Trello with a unique name. We will be adding cards to this list.

Save this for later. This is your `TRELLO_LIST_NAME`.

### 4. Acquire Heroku App URL

Click the deploy button below. Log in (or sign up), and hit `Deploy For Free`. Get the App Name.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Your URL should be something like: `https://<app-name>.herokuapp.com`

Save this for later. This is your `Payload URL`.

### 5. Configure Webhook

Go to your GitHub repo's settings.

Click `Webhooks & services`.

Click `Add webhook`.

For Payload URL, enter your Heroku App URL.

For Content type, select application/json.

For Secret, enter a super secret password that nobody else knows.

Save this for later. This is your `GITHUB_SECRET`.

Hit `Add webhook`.

### 6. Configure Heroku

Go to your [Heroku Dashboard](https://dashboard.heroku.com/apps/).

Click on your application.

Click Settings.

Click `Reveal Config Vars`.

Add each config variable (`TRELLO_KEY`, `TRELLO_TOKEN`, `TRELLO_LIST_NAME`, `GITHUB_SECRET`).

### 7. Done!

Cards should show up in `TRELLO_LIST_NAME` whenever you push!
