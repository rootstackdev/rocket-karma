# Karma

Karma is a free and open source [Rocket.Chat](https://rocket.chat/) bot designed to let users reward each other with kudos.

Karma was created by [Rootstack S.A.](https://www.rootstack.com/en).

## Development Guide

### Recommended IDEs

- [Jetbrains' Webstorm](https://www.jetbrains.com/webstorm/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Requirements

- [Node.js 10+](https://nodejs.org/en/)
- [MongoDB 4](https://docs.mongodb.com/manual/installation/)

### Setup

__Clone the project with git:__

<!-- TODO: Update project URL once (and if) it changes to Github -->
```bash
git clone https://gitlab.com/rootstack/bot-on-air/karma.git
```

__Navigate to the project's root directory:__

```bash
cd karma
```

__Install dependencies:__

```bash
npm install

# Or, if you prefer Yarn:

yarn install
```

__Provide environment variables:__

```bash
touch .env
# Then open .env with your favorite editor and type:
KARMA_HOST=my.rocketchat-server.com
KARMA_USERNAME=my@username.com
KARMA_PASSWORD=mypassword
KARMA_DATABASE_HOST=localhost/karmatesting
```

__Start a development server:__

```bash
npm start

# Or

yarn start
```
