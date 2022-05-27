const utils = require("../utils");

test("fails on missing name", () => {
  expect(utils.boatValid({"status":"Docked"})).toBe(false);
});

test("fails on missing status", () => {
  expect(utils.boatValid({"name":"Boaty"})).toBe(false);
});

test("fails on invalid status", () => {
  expect(utils.boatValid({"name":"Boaty","status":"In the sky"})).toBe(false);
});

test("passes on correct boat data", () => {
  expect(utils.boatValid({"name":"Boaty","status":"Docked"})).toBe(true);
});