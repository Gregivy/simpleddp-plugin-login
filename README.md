[![npm version](https://badge.fury.io/js/simpleddp-plugin-login.svg)](https://badge.fury.io/js/simpleddp-plugin-login)
[![Build Status](https://travis-ci.org/Gregivy/simpleddp-plugin-login.svg?branch=master)](https://travis-ci.org/Gregivy/simpleddp-plugin-login)
[![Dependency Status](https://david-dm.org/gregivy/simpleddp-plugin-login.svg)](https://david-dm.org/gregivy/simpleddp-plugin-login)
[![devDependency Status](https://david-dm.org/gregivy/simpleddp-plugin-login/dev-status.svg)](https://david-dm.org/gregivy/simpleddp-plugin-login#info=devDependencies)

# simpleddp-plugin-login (SimpleDDP Meteor.Accounts Login Plugin)

This is plugin for [simpleDDP](https://github.com/gregivy/simpleddp) js library.
Use it to authenticate with any **Meteor.Accounts** login provider (also custom).

## Version 3.0.0

Plugin is for `simpleDDP` >= 2.0.0.
For previous versions [see](https://github.com/Gregivy/simpleddp-plugin-login/tree/master).

## Install

`npm install simpleddp-plugin-login --save`

## Usage

Extends `simpleDDP` instance.

```javascript
const simpleDDP = require("simpleddp");
const simpleDDPLogin = require("simpleddp-plugin-login").simpleDDPLogin;

const opts = {
    endpoint: "ws://someserver.com/websocket",
    SocketConstructor: WebSocket,
    reconnectInterval: 5000
};
const server = new simpleDDP(opts,[simpleDDPLogin]);
```

Adds events (`login`, `logout`, `loginResume`, `loginSessionLost`, `loginResumeFailed`),methods (`login`, `logout`) and `userId` property
which is `undefined` when user is not logged in or is equal to *user.\_id* when user is logged in.
Also `token` property when user is logged in.
Plugin automatically resumes authentication if connection with server was lost and then restored back.

### simpleDDP.login(auth)

Call this method to login with any **Meteor.Accounts** login provider.

#### Returns

A *Promise* which resolves to the object with userId of the logged in user when the login succeeds, or rejects when it fails.

#### Example for Accounts Password

```javascript
server.userId; // undefined, we are not logged in

const password = "somepassword";
const username = "admin";
const email = "admin@admin";

// you must pass password and at least one of username or email
const userAuth = await server.login({
  password,
  user: {
      username,
      email
  }
});

// userAuth will be something like this
// { id: 'd6PqCAKk2QZeqZHWy',
//   token: 'N50Gmknk__geP63YD9pHKdl07b8XXxNGpB_cz5Lte4d',
//   tokenExpires: { '$date': 1548525528846 },
//   type: 'password' }

server.userId; // now equals to 'd6PqCAKk2QZeqZHWy'
server.token; // now equals to 'N50Gmknk__geP63YD9pHKdl07b8XXxNGpB_cz5Lte4d'
```

### simpleDDP.logout()

Call this method to logout.

#### Returns

A *Promise* which resolves to undefined when the logout succeeds, or rejects when it fails.

#### Example

```javascript
await server.logout();
```

### Events Example

```javascript
server.on('login', user => console.log('User logged in as', user));

server.on('logout', () => console.log('User logged out'));

server.on('loginSessionLost', id => console.log(`User ${id} lost connection to server, will auto resume by default with token`))

server.on('loginResume', user => console.log('User resumed (logged in by token)', user));

server.on('loginResumeFailed', user => console.log('Failed to resume authorization with token after reconnection ', user));
```
