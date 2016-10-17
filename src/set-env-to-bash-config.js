import os from 'os';
import process from 'process';
import path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import {execCmd, sequencePromises, logWrittenEnvs} from './utils';

const RE_EXPORT = /\s*export\s+([^=]+)=(\S+)$/;

function trimQuote(str) {
    if (str.startsWith('"')) {
        return _.trim(str, '"');
    } else if (str.startsWith('\'')) {
        return _.trim(str, '\'');
    } else {
        return str;
    }
}

function getExportConfig(configFileContent, key) {
    let result = null;
    configFileContent.split(os.EOL).some(line => {
        const match = line.match(RE_EXPORT);
        if (match) {
            const [, exportKey, val] = match;
            if (trimQuote(exportKey) === key) {
                result = trimQuote(val);
                return true;
            }
        }
    });
    return result;
}

function setEnvToBashConfigFile(bashConfigFile, envs, {log = true}) {
    const writtenEnvs = [];
    const bashConfigContent = fse.readFileSync(bashConfigFile, 'utf8');
    return Promise.resolve().then(() => {
        return sequencePromises(_.map(envs, (val, key) => () => Promise.resolve().then(() => {
            if (getExportConfig(bashConfigContent, key) == null) {
                fse.appendFileSync(bashConfigFile, `export "${key}"="${val}"${os.EOL}`);
                writtenEnvs.push({key: key, value: val});
            }
        })));
    }).then(() => {
        if (writtenEnvs.length && log) {
            logWrittenEnvs(writtenEnvs);
        }
        return writtenEnvs;
    });
}

export function setEnvToBashrc(envs, {log = true}) {
    const bashrcFile = path.resolve(os.homedir(), '.bashrc');
    return setEnvToBashConfigFile(bashrcFile, envs, {log});
}

export function setEnvToBashProfile(envs, {log = true}) {
    const bashProfileFile = path.resolve(os.homedir(), '.bash_profile');
    return setEnvToBashConfigFile(bashProfileFile, envs, {log});
}