import { generateUUIDv4 } from '@bitjourney/uuid-v4';

export function uuid(len = 5) {
    return generateUUIDv4().slice(0, len); // id 截断处理
}

export function invariant(check: boolean, message: string, thing?: string) {
  if (!check) {
    throw new Error(
      '[ide-view] Invariant failed: ' +
        message +
        (thing ? " in '" + thing + "'" : '')
    );
  }
}

export function isExist(val: any): boolean {
  return typeof val !== 'undefined' && val !== null;
}

// from mobx
export function uniq(arr: any[]) {
  var res: any[] = [];
  arr.forEach(function(item) {
    if (res.indexOf(item) === -1) res.push(item);
  });
  return res;
}
