import _ from 'lodash';
import {execCmd, sequencePromises, logWrittenEnvs} from './utils';

function hasExport() {
    return execCmd('export')
        .catch(() => Promise.reject('No cmd "export"'));
}

export default function setEnvOnCurrentNoWinShell(envs) {
    const writtenEnvs = _.map(envs, (val, key) => ({key: key, value: val}));
    return hasExport().then(() => {
        return sequencePromises(_.map(writtenEnvs, ({key, value}) => () => {
            return execCmd(`export ${key} ${value}`)
        }));
    }).then(() => {
        return {
            writtenFile: null,
            writtenEnvs: writtenEnvs
        };
    });
}
