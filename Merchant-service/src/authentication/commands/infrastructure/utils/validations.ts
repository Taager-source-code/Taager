import mongoose from 'mongoose';
import { isValid } from 'date-fns';

export const isString = val => typeof val === 'string';

export const isNumber = val => !Number.isNaN(val);

export const isBoolean = val => val === true || val === false || toString.call(val) === '[object Boolean]';

export const isDate = val => isValid(val);

export const isObject = val => typeof val === 'object';

export const isArray = val => Array.isArray(val);

export const isObjectId = val => mongoose.Types.ObjectId.isValid(val);

export const matchesRegex = (val, regex) => regex.test(val);

export const isEmptyObject = object => Object.keys(object).length === 0;


