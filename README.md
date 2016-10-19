# os-env-setter
A simple tool to setup global environment variables CROSS different os platforms.

# How to use it?

First install it: `npm install os-env-setter`.

```javascript
var osEnvSetter = require('os-env-setter');

osEnvSetter({
    JAVA_HOME: '/opt/java',
    ANOTHER_ENV_KEY: 'another env value'
});
```

# What it does?

- on `MacOs`, write env to `~/.bash_profile`
- on `Linux`, write env to `~/.bashrc`
- on `Windows`, call `setx` to set global env (**Not tested yet!**)

For `Linux`, you should be ware of defference between **login and not-login shell**. 

(If you don't, just add a line `source .bashrc;` to `~/.bash_profile` on Linux. Some Linux OS already did this.)
