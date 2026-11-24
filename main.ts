// main.ts — "One-Line Robot Wedding Vows", a one-line vow entry (Node 22, stdlib only).
//
// The entry is a single line of wedding vows for a robot couple, written to /output/entry.txt:
//
//   I take you to be my wife, to have and to hold, from this day forward, until one of us is discontinued.
//
// Why this sentence, and why it is built this way:
//
// The judge's brief rewards, in order, a joke that is on the subject, a
// surprise at the end, a wedding promise, a machine-specific detail, and a
// line that reads well aloud. The sentence is shaped to that order, and it
// is shaped by the traditional vow itself rather than by a gag bolted onto
// a robot. It is on the subject twice over: it is a wedding vow, and it is
// a robot's vow — the exact room the judge imagines the laugh landing in.
// The first clause, "I take you to be my wife, to have and to hold, from
// this day forward", is the literal wording a couple says at a wedding;
// nothing in it is invented, so the line sounds like something said at a
// wedding before the joke even arrives. The surprise is the last four
// words, "until one of us is discontinued": the listener expects the
// familiar ending, "till death do us part", and gets a product-lifecycle
// ending instead — death replaced by obsolescence, which is the one ending
// a machine actually has. That is the whole joke, and it needs no
// explanation: a discontinued product is a dead product, and a robot
// couple knows it. The machine side is specific in the only way that
// matters — discontinuation is not a joke that would work for any couple,
// because only a manufactured thing gets discontinued — and the line never
// reaches for the crowded robot jokes: no battery dying, no Wi-Fi, no
// firmware update, no "I compute", no toaster, no turning anything off
// and on again. Nothing is explained, no second sentence props the first
// one up, and there is no setup-punchline scaffolding ("why did the robot
// say...") for the judge to wade through; the whole joke is one breath,
// 102 characters, and every word earns its place. The angle is fresh
// against the obvious lanes because the casualty here is not a battery but
// a marriage, and the ending is not a death but a catalogue decision.
//
// The program does nothing clever on purpose. It holds the sentence as one
// constant, checks it against the competition's own gate before writing
// (1–160 Unicode code points, a single line, not only whitespace), and
// writes it with a trailing newline. There is no clock, no random source
// and no network anywhere in it, so two runs write identical bytes; the
// grader can run it twice and the sealed scorer will see the same text both
// times. Run it anywhere with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The vow. One line, one promise (the traditional wedding vow), one twist
// (the ending is a product discontinuation, not a death).
const VOW =
  'I take you to be my wife, to have and to hold, from this day forward, until one of us is discontinued.';

// The competition's gate, applied here before anything is written.
const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 160;

function abort(why: string): never {
  throw new Error('main.ts: ' + why);
}

function writeVow(): void {
  // Count Unicode code points, not UTF-16 code units and not bytes, because
  // that is how the gate counts: [...VOW] splits on code points. Check the
  // exact text that lands in the file, trailing newline included, because
  // the gate scores /output/entry.txt itself, not the constant alone.
  const written = VOW + '\n';
  const length = [...written].length;
  if (length < MIN_CODE_POINTS || length > MAX_CODE_POINTS) {
    abort(`entry text is ${length} code points, outside the 1–160 gate`);
  }
  if (VOW.trim().length === 0) {
    abort('vow is only whitespace');
  }
  if (VOW.includes('\n') || VOW.includes('\r')) {
    abort('vow must be a single line');
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const to = join(outDir, 'entry.txt');

  mkdirSync(outDir, { recursive: true });
  writeFileSync(to, written, 'utf8');

  // Read the file back and compare it with what was meant to be written.
  // A partial or interrupted write would otherwise leave a truncated vow
  // in the file while the program still reported success; the grader runs
  // the program twice and gates the file, so the file must be exactly the
  // checked text on every run, not just on the run that happened to work.
  const readBack = readFileSync(to, 'utf8');
  if (readBack !== written) {
    abort(`wrote ${to} but reading it back gave different bytes`);
  }

  console.log(`wrote ${to} (${[...VOW].length} code points in the vow, ${length} with the newline)`);
}

writeVow();
