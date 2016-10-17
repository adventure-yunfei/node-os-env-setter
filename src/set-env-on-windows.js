import _ from 'lodash';
import {execCmd, sequencePromises, logWrittenEnvs} from './utils';

function hasSetx() {
    return execCmd('setx');
}

export default function setEnvOnWindows(envs, {log = true}) {
    const writtenEnvs = _.map(envs, (val, key) => ({key: key, value: val}));
    return hasSetx().then(() => {
        return sequencePromises(_.map(writtenEnvs, ({key, value}) => () => {
            return execCmd(`setx ${key} ${value}`)
        }));
    }).then(() => {
        if (writtenEnvs.length && log) {
            logWrittenEnvs(writtenEnvs);
        }
        return writtenEnvs;
    });
}