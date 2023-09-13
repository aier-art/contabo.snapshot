#!/usr/bin/env -S node --loader=@w5/jsext --trace-uncaught --expose-gc --unhandled-rejections=strict
var CPU_CORES_SNAPSHOT_LIMIT;

import api from './api';

CPU_CORES_SNAPSHOT_LIMIT = {
  8: 3,
  6: 2,
  4: 1
};

(async() => {
  var cpuCores, createdDate, data, displayName, instanceId, limit, n, ref, results, snapshotId, x, y;
  // 没做分页
  ({data} = (await api('compute/instances')));
  results = [];
  for (x of data) {
    ({instanceId, displayName, cpuCores} = x);
    limit = CPU_CORES_SNAPSHOT_LIMIT[cpuCores];
    ({data} = (await api(`compute/instances/${instanceId}/snapshots`)));
    n = data.length;
    console.log('❯', displayName, 'snapshots limit', limit);
    ref = data.reverse();
    for (y of ref) {
      ({snapshotId, createdDate} = y);
      if (n < limit) {
        break;
      }
      console.log(n--, 'rm', snapshotId, createdDate);
      await api(`compute/instances/${instanceId}/snapshots/${snapshotId}`, {
        method: "DELETE"
      });
    }
    results.push((await api.post(`compute/instances/${instanceId}/snapshots`, {
      name: (new Date()).toISOString().slice(0, 19)
    })));
  }
  return results;
})();
