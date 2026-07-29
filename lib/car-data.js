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
  // Ticker always shows today's date (JST) so the board looks fresh.
  const today = todayInTokyo();
  return applicationsCache.slice(0, limit).map((a, i) => ({
    ...a,
    id: a.id ?? `app-${i}`,
    appliedOn: today,
  }));
}

/** Calendar date in Asia/Tokyo as a Date at local midnight JST. */
function todayInTokyo() {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${ymd}T12:00:00+09:00`);
}
