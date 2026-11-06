import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createCube, applyMove, applyFaceMove, FACE_MOVES, isSolved, serializeCube, scrambleMoves } from '../src/components/hobbies/cube/logic.ts';
const initial = createCube(), baseline = serializeCube(initial);
assert.equal(initial.length, 26);
assert.equal(initial.flatMap(p => p.stickers).length, 54);
assert.equal(isSolved(initial), true);
for (const face of Object.keys(FACE_MOVES)) {
  const moved = applyFaceMove(initial, face);
  assert.equal(isSolved(moved), false, `${face} must change the solved state`);
  assert.equal(serializeCube(applyFaceMove(moved, face, true)), baseline, `${face} followed by inverse`);
  let four = initial;
  for (let i = 0; i < 4; i++) four = applyFaceMove(four, face);
  assert.equal(serializeCube(four), baseline, `${face} four turns`);
}
for (const axis of ['x', 'y', 'z']) for (const layer of [-1, 0, 1]) {
  assert.equal(serializeCube(applyMove(applyMove(initial, axis, layer), axis, layer, -1)), baseline, `${axis}/${layer} layer inverse`);
}
for (const axis of ['x', 'y', 'z']) {
  let reoriented = initial;
  for (const layer of [-1, 0, 1]) reoriented = applyMove(reoriented, axis, layer);
  assert.equal(isSolved(reoriented), true, 'A whole-cube reorientation is still solved');
}
let commutator = initial;
for (let i = 0; i < 6; i++) for (const [face, inverse] of [['R', false], ['U', false], ['R', true], ['U', true]]) {
  commutator = applyFaceMove(commutator, face, inverse);
}
assert.equal(serializeCube(commutator), baseline, 'The standard sixfold R U R′ U′ relation holds');
let seed = 761;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const scramble = scrambleMoves(120, random);
let state = initial;
for (const move of scramble) state = applyMove(state, move.axis, move.layer, move.quarter);
assert.equal(isSolved(state), false);
const stickers = state.flatMap(p => p.stickers);
assert.equal(new Set(stickers.map(s => s.id)).size, 54);
for (const color of ['U', 'D', 'L', 'R', 'F', 'B']) assert.equal(stickers.filter(s => s.color === color).length, 9);
assert.equal(new Set(state.map(p => p.pos.join(','))).size, 26, 'Every cubie occupies a unique position');
for (const piece of state) for (const sticker of piece.stickers) {
  const i = sticker.normal.findIndex(v => v !== 0);
  assert.equal(piece.pos[i], sticker.normal[i], 'Every sticker is on the outside of the cube');
}
for (const move of [...scramble].reverse()) state = applyMove(state, move.axis, move.layer, -move.quarter);
assert.equal(serializeCube(state), baseline, 'Scramble followed by reversed inverse restores exact state');
assert.equal(isSolved(state), true);
assert.equal(serializeCube(initial), baseline, 'Moves preserve their input state');
assert.throws(() => applyMove(initial, 'q', 1), /Invalid cube layer/);
assert.throws(() => applyFaceMove(initial, 'Z'), /Unknown cube face/);
console.log('Cube model: 6 faces, all 9 slices, 120-turn scramble/inverse, geometry and sticker inventory passed.');
for (const file of ['cube/logic.ts', 'cube/Cube.tsx']) {
  const source = await fs.readFile(new URL(`../src/components/hobbies/${file}`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|document\.cookie)/, `${file} must not persist anything`);
}
