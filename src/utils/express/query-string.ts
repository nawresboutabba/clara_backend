import qs from "qs";

export function parseQueryString(value: string) {
  return parseObject(qs.parse(value, {}));
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val.constructor === Object;
}

function isNumber(val: unknown): val is number {
  return !isNaN(parseFloat(val as string)) && isFinite(val as number);
}

function isBoolean(val: unknown): val is boolean {
  return val === "false" || val === "true";
}

function isArray(val: unknown): val is Array<unknown> {
  return Array.isArray(val);
}

function parseValue(val: unknown) {
  if (typeof val == "undefined" || val == "") {
    return null;
  } else if (isBoolean(val)) {
    return parseBoolean(val);
  } else if (isArray(val)) {
    return parseArray(val);
  } else if (isObject(val)) {
    return parseObject(val);
  } else if (isNumber(val)) {
    return parseNumber(val);
  } else {
    return val;
  }
}

function parseObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result = {};
  let key, val;
  for (key in obj) {
    val = parseValue(obj[key]);
    if (val !== null) {
      result[key] = val;
    } // ignore null values
  }
  return result;
}

function parseArray(arr: unknown[]) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = parseValue(arr[i]);
  }
  return result;
}

function parseNumber(val: unknown) {
  return Number(val);
}

function parseBoolean(val: unknown) {
  return val === "true";
}
