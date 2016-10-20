import os from 'os';
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

module.exports = function setOsEnv(envs/**@type Object*/, outputLog = false/** whether output process info */) {
    let promise;
    if (isMac()) {
        promise = setEnvToBashProfile(envs);
    } else if (isLinux()) {
        promise = setEnvToBashrc(envs);
    } else if (isWin()) {
        promise = setEnvOnWindows(envs);
    } else {
        promise = Promise.reject('setOsEnv: Unknown os platform: ' + process.platform);
    }

    return promise
        .then(({writtenFile, writtenEnvs}) => {
            if (outputLog) {
                if (writtenEnvs.length) {
                    console.log(`# os-env-setter # Write into # ${path.basename(writtenFile)} #:`);
                    writtenEnvs.forEach(({key, value}) => {
                        console.log(`  - ${key} = ${value}`);
                    });
                } else {
                    console.log(`# os-env-setter # Env variables already set.`);
                }
                console.log('# os-env-setter # Success.');
            }
            return {writtenFile, writtenEnvs};
        })
        .catch(err => {
            if (outputLog) {
                console.error('# os-env-setter # Failed:');
                console.error(err);
            }
            return Promise.reject(err);
        });
}
