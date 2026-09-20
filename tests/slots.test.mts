import { test } from "node:test";
import assert from "node:assert/strict";
import { nextAvailability, slotsFor, ymd } from "../lib/slots.ts";

const at = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

test("an hour that has already passed today is never bookable", () => {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const s of slotsFor(at(0))) {
    const min = Number(s.time.slice(0, 2)) * 60 + Number(s.time.slice(3));
    if (s.free) assert.ok(min > nowMin, `${s.time} is bookable but already passed`);
  }
});

test("the same future day always looks the same", () => {
  const a = slotsFor(at(3)).map((s) => `${s.time}:${s.free}`);
  const b = slotsFor(at(3)).map((s) => `${s.time}:${s.free}`);
  assert.deepEqual(a, b);
});

test("Sunday closes earlier than a weekday", () => {
  let sunday = at(0);
  for (let i = 0; i < 7 && sunday.getDay() !== 0; i++) sunday = at(i + 1);
  const last = slotsFor(sunday).at(-1)!.time;
  assert.ok(last <= "15:00", `Sunday runs until ${last}`);
});

test("the next availability is a real free slot on that day", () => {
  const next = nextAvailability(3);
  assert.ok(next, "no availability at all in the next two weeks");
  assert.ok(next!.times.length > 0);
  const free = slotsFor(next!.date).filter((s) => s.free).map((s) => s.time);
  for (const time of next!.times) assert.ok(free.includes(time), `${time} is not free`);
});

test("ymd formats a date the way the ics file needs it", () => {
  assert.equal(ymd(new Date(2026, 8, 21)), "2026-09-21");
});
