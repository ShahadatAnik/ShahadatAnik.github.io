import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {ArenaGame, segmentDistanceSquared, intersectsCone, dashDestination, simulationSteps, advanceRoundClock} from '../src/components/hobbies/arena/logic.ts';

const source = (await Promise.all(['logic.ts', 'draw.ts', 'Arena.tsx'].map(file => fs.readFile(new URL(`../src/components/hobbies/arena/${file}`, import.meta.url), 'utf8')))).join(' ');

// Projectile collision checks the entire path, not just its final position.
assert.equal(segmentDistanceSquared(10, 10, 0, 0, 20, 0), 100);
assert.equal(segmentDistanceSquared(50, 0, 0, 0, 100, 0), 0);
assert.equal(segmentDistanceSquared(5, 5, 0, 0, 0, 0), 50);
assert.equal(segmentDistanceSquared(30, 0, 0, 0, 20, 0), 100);

const cone = {x: 0, y: 0, angle: 0, spread: Math.PI / 6, radius: 100};
assert.ok(intersectsCone({x: 40, y: 0, radius: 5}, cone));
assert.ok(!intersectsCone({x: -20, y: 0, radius: 5}, cone));
assert.ok(!intersectsCone({x: 120, y: 0, radius: 5}, cone));
assert.ok(intersectsCone({x: 104, y: 0, radius: 5}, cone));
assert.ok(intersectsCone({x: 50, y: 31, radius: 5}, cone)); // Clips a radial edge.
assert.ok(!intersectsCone({x: 50, y: 41, radius: 5}, cone));
assert.ok(intersectsCone({x: 0, y: 0, radius: 5}, cone));
assert.ok(intersectsCone({x: -40, y: 0, radius: 5}, {...cone, angle: Math.PI})); // Angle wrapping.

const player = {x: 450, y: 260, radius: 12};
const destination = dashDestination(player, {x: 3, y: 4});
assert.ok(Math.abs(Math.hypot(destination.x - player.x, destination.y - player.y) - 135) < 1e-9);
assert.deepEqual(dashDestination({x: 60, y: 60, radius: 12}, {x: -1, y: -1}), {x: 52, y: 52});
assert.deepEqual(dashDestination(player, {x: 0, y: 0}), {x: 450, y: 260});

// The real round clock does not slow down, auto-pause or replay invisible attacks on slow frames.
for (const fps of [1, 4, 10, 20, 30, 60, 120]) {
  let state = {elapsed: 0, cooldown: 5};
  for (let frame = 0; frame < 45 * fps; frame++) {
    const steps = simulationSteps(1 / fps);
    assert.ok(steps.every(dt => dt <= 1 / 120 + 1e-12));
    assert.ok(steps.reduce((sum, dt) => sum + dt, 0) <= .25 + 1e-12);
    state = advanceRoundClock(state.elapsed, state.cooldown, 1 / fps);
  }
  assert.ok(Math.abs(state.elapsed - 45) < 1e-9, `Round duration drifted at ${fps} fps`);
  assert.equal(state.cooldown, 0);
}
assert.equal(simulationSteps(1).length, 30);
assert.ok(Math.abs(simulationSteps(10).reduce((sum, dt) => sum + dt, 0) - .25) < 1e-12);
assert.deepEqual(simulationSteps(NaN), []);
assert.deepEqual(simulationSteps(0), []);
assert.deepEqual(advanceRoundClock(10, 3, 1), {elapsed: 11, cooldown: 2});
assert.deepEqual(advanceRoundClock(44, 3, 2), {elapsed: 45, cooldown: 1});
assert.ok(!/localStorage|sessionStorage|document\.cookie/.test(source));

// Exercise the real game state machine (the same one the React component drives) with a deterministic clock.
// This catches Start->stall->Pause regressions that isolated geometry/timestep tests cannot detect.
let seed = 2;
const random = () => {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296;};
const game = new ArenaGame({reducedMotion: true, random});
const tick = seconds => game.advance(seconds);
const key = (k, extra = {}) => game.keyDown({key: k, code: k === ' ' ? 'Space' : k, ...extra});

assert.equal(game.mode, 'ready');
game.start();
assert.equal(game.mode, 'running');
tick(.25); assert.equal(game.timeText, '44.8'); assert.equal(game.mode, 'running');
tick(1); assert.equal(game.timeText, '43.8'); assert.equal(game.mode, 'running', '1-second frames must not auto-pause');
const beforeKeyboard = {...game.player};
assert.equal(key('ArrowRight', {targetIsButton: true}), true, 'Movement works even if a game control has focus');
tick(.25); assert.ok(game.player.x > beforeKeyboard.x);
game.releaseKey('ArrowRight');
assert.equal(key('ArrowLeft', {targetIsEditable: true}), false, 'Do not hijack editable fields');
assert.equal(key(' ', {targetIsButton: true}), false, 'Keep native Pause/Close button activation');

const beforeMouse = {...game.player};
game.setTarget(10 / 720 * 900, 10 / 416 * 520);
tick(.25); assert.ok(game.player.x < beforeMouse.x && game.player.y < beforeMouse.y);
const beforeTouch = {...game.player};
game.setTarget(650 / 720 * 900, 360 / 416 * 520);
tick(.25); assert.ok(game.player.x > beforeTouch.x && game.player.y > beforeTouch.y);

const beforeDash = {...game.player}; game.dash();
assert.ok(Math.hypot(game.player.x - beforeDash.x, game.player.y - beforeDash.y) > 100);
assert.equal(game.cooldown.toFixed(1), '5.0'); assert.equal(game.dashReady, false);
game.keys.add('arrowup'); game.clearKeys(); tick(1); // a window blur only clears held keys
assert.equal(game.mode, 'running', 'Window focus changes must not pause gameplay');
assert.equal(game.cooldown.toFixed(1), '4.0');

game.pause(); const pausedTime = game.timeText;
assert.equal(game.mode, 'paused');
tick(10); assert.equal(game.timeText, pausedTime, 'A paused round does not advance');
game.resume(); tick(1);
assert.equal(game.mode, 'running'); assert.equal(Number(game.timeText), Number(pausedTime) - 1);
game.pause(true); assert.equal(game.automaticPause, true); const hiddenTime = game.timeText;
tick(10); assert.equal(game.timeText, hiddenTime);
game.resume(true); assert.equal(game.mode, 'paused', 'A hidden tab never resumes');
game.resume(false);
for (let i = 0; i < 3; i++) tick(1);
assert.equal(game.dashReady, true, 'Dash cooldown recharges in real active seconds');
assert.equal(key('p'), true); assert.equal(game.mode, 'paused', 'P pauses');
assert.equal(key('p'), true); assert.equal(game.mode, 'running', 'P resumes');

tick(45);
assert.equal(game.timeText, '0.0'); assert.equal(game.mode, 'result');
assert.equal(game.result.won, true);
game.start(); assert.equal(game.timeText, '45.0'); assert.equal(game.mode, 'running'); assert.equal(game.dashReady, true);
for (let i = 0; i < 45 * 60 && game.mode === 'running'; i++) tick(1 / 60);
assert.equal(game.mode, 'result');
assert.equal(game.hp, 0, 'Standing still takes three real hits and ends the round');
assert.equal(game.result.won, false);
game.start(); assert.equal(game.mode, 'running'); assert.equal(game.timeText, '45.0'); assert.equal(game.hp, 3);
assert.equal(game.hazards.length + game.particles.length + game.trails.length, 0, 'A new round starts clean');
console.log('Arena: geometry, real low-fps clock, state-machine start/input/dash/pause/visibility/end/replay and no-save checks passed.');
