import process from 'process';
import {setEnvToBashrc, setEnvToBashProfile} from './set-env-to-bash-config';
import {setEnvOnWindows} from './set-env-on-windows';

function isMac() {
    return /darwin/.test(process.platform);
}
function isWin() {
    return /^win/.test(process.platform);
}
function isLinux() {
    return /(freebsd)|(linux)|(sunos)/.test(process.platform);
}

export default function setOsEnv(envs/**@type Object*/, {log = true/** whether output process info */}) {
    if (isMac()) {
        return setEnvToBashProfile(envs, {log});
    } else if (isLinux()) {
        return setEnvToBashrc(envs, {log});
    } else if (isWin()) {
        return setEnvOnWindows(envs, {log});
    } else {
        return Promise.reject('setOsEnv: Unknown os platform: ' + process.platform);
    }
}