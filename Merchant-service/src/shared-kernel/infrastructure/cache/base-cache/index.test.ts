import { isObject } from '../../../../authentication/commands/infrastructure/utils/validations';

import MemoryLRU from './memory-lru';

const Cachers = {
  MemoryLRU,
};

function getByName(name) {
  if (!name) return null;

  const n = Object.keys(Cachers).find(n => n.toLowerCase() == name.toLowerCase());
  if (n) return Cachers[n];
}

/**
 * Resolves cache by name
 * @param opt
 * @returns {null|*}
 */
function resolve(opt) {
  if (isObject(opt)) {
    const CacherClass = getByName(opt.type || 'MemoryLRU');
    if (CacherClass) return new CacherClass(opt.options);
  }
  return null;
}

export = Object.assign(Cachers, { resolve });


