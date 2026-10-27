#!/usr/bin/env node
// Vérifie que la doc de docs/ couvre le code de src/ (voir la section « Système de documentation » d'AGENTS.md).
//   node scripts/docs-check.mjs                 couverture + sources mortes
//   node scripts/docs-check.mjs --since master  + pages dont les sources ont changé depuis la ref
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const DOCS_DIR = 'docs/';
const CODE_DIR = 'src/';
// Binaires et médias : documentés au niveau de leur dossier, pas fichier par fichier.
const IGNORED = [/^src\/assets\/(img|audio|files)\//, /^src\/favicon\.ico$/];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean);

function parseSources(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const sources = [];
  let inSources = false;
  for (const line of match[1].split(/\r?\n/)) {
    if (/^sources:\s*$/.test(line)) { inSources = true; continue; }
    if (inSources) {
      const item = line.match(/^\s+-\s+(\S+)/);
      if (item) sources.push(item[1]);
      else if (/^\S/.test(line)) inSources = false;
    }
  }
  return sources;
}

// Un dossier (slash final) couvre son contenu ; un fichier couvre aussi son .spec.ts.
function covers(source, file) {
  if (source.endsWith('/')) return file.startsWith(source);
  return file === source || file === source.replace(/\.ts$/, '.spec.ts');
}

// Fichiers suivis + nouveaux fichiers non ignorés, pour que la vérification marche avant le commit.
const tracked = git('ls-files', '--cached', '--others', '--exclude-standard');
const docs = tracked.filter(f => f.startsWith(DOCS_DIR) && f.endsWith('.md') && !f.endsWith('_template.md'));
const pages = docs.map(path => ({ path, sources: parseSources(readFileSync(path, 'utf8')) }));

let errors = 0;
const report = (msg) => { errors++; console.log(`  ✗ ${msg}`); };

console.log('Frontmatter');
for (const page of pages.filter(p => p.sources === null)) report(`${page.path} : pas de frontmatter avec « sources »`);

console.log('Sources mortes');
for (const page of pages.filter(p => p.sources)) {
  for (const source of page.sources) {
    if (!tracked.some(f => covers(source, f))) report(`${page.path} → ${source} ne correspond à aucun fichier suivi`);
  }
}

console.log('Code non documenté');
const code = tracked.filter(f => f.startsWith(CODE_DIR) && !IGNORED.some(re => re.test(f)));
for (const file of code) {
  if (!pages.some(p => p.sources?.some(s => covers(s, file)))) report(file);
}

const sinceIndex = process.argv.indexOf('--since');
if (sinceIndex !== -1) {
  const ref = process.argv[sinceIndex + 1];
  if (!ref) { console.error('--since attend une ref git (ex. master)'); process.exit(2); }
  // Modifs commitées depuis la ref + modifs locales non commitées + nouveaux fichiers.
  const changed = new Set([
    ...git('diff', '--name-only', `${ref}...HEAD`),
    ...git('diff', '--name-only', 'HEAD'),
    ...git('ls-files', '--others', '--exclude-standard'),
  ]);
  console.log(`Pages à relire (sources modifiées depuis ${ref})`);
  for (const page of pages.filter(p => p.sources && !changed.has(p.path))) {
    const touched = [...changed].filter(f => page.sources.some(s => covers(s, f)));
    if (touched.length) report(`${page.path} ← ${touched.join(', ')}`);
  }
}

console.log(errors ? `\n${errors} problème(s).` : '\nDocumentation à jour.');
process.exit(errors ? 1 : 0);
