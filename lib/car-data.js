import { readFileSync } from "fs";
import { join } from "path";

const dataDir = join(process.cwd(), "data");

function readJson(name) {
  return JSON.parse(readFileSync(join(dataDir, name), "utf8"));
}

let makersCache;
let modelsCache;
let applicationsCache;

export function getMakers() {
  if (!makersCache) makersCache = readJson("makers.json");
  return makersCache;
}

export function getCarModelsByMaker(makerCode) {
  if (!modelsCache) modelsCache = readJson("car-models.json");
  return modelsCache[makerCode] || [];
}

export function findMaker(makerCode) {
  const { domestic, imported } = getMakers();
  return (
    domestic.find((m) => m.code === makerCode) ||
    imported.find((m) => m.code === makerCode) ||
    null
  );
}

export function getApplications(limit = 30) {
  if (!applicationsCache) applicationsCache = readJson("applications.json");
  return applicationsCache.slice(0, limit).map((a) => ({
    ...a,
    appliedOn: a.appliedOn ? new Date(a.appliedOn) : null,
  }));
}
