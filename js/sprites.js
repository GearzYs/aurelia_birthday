/* =========================================================================
   sprites.js — Pixel-art sprites "Sims 4 en pixel art"
   Chaque sprite = tableau de chaines, 1 caractere = 1 pixel.
   ' ' (espace) = transparent. Voir PALETTE pour les couleurs.
   ========================================================================= */

const PALETTE = {
  ' ': null, '.': null,
  // contour / sombre
  'K': '#241c2b',
  // peau
  'S': '#f3c9a0', 's': '#d9a17c',
  // cheveux brun
  'H': '#4a2f1b', 'h': '#6e4628',
  // yeux bleus + blanc
  'B': '#39a7ff', 'W': '#ffffff',
  // levres + joues (blush)
  'p': '#d8607a', 'q': '#e89a86',
  // haut teal (Sims) + arme
  'T': '#1ba9e1', 't': '#1488b8',
  // jean
  'J': '#3f5e9c', 'j': '#314a7d',
  // chaussures
  'O': '#3a2a1a',
  // plumbob (verts Sims)
  'g': '#9be84a', 'G': '#4fae0a', 'd': '#2f6b06',
  // bloc "?"
  'b': '#2bb3e6', 'L': '#bfefff', 'D': '#13658f', 'r': '#0d4a6b',
  // metal / gris (montre, couverts)
  'c': '#d3dae4', 'C': '#7c8593', 'e': '#7a4a2a',
  // couleurs cadeaux
  'R': '#e8456b', 'Y': '#ffd23f', 'P': '#ff8fb0',
  'n': '#7bd957', 'm': '#3f9e2f', 'w': '#f4f1e8',
};

function makeSprite(rows) {
  return { rows: rows, w: rows[0].length, h: rows.length };
}

/* ---------------------------------------------------------------- Personnage
   La brune aux yeux bleus (= le "Mario"). 12 x 21. */
const SPRITES = {};

SPRITES.girlIdle = makeSprite([
  '      HHHH      ',
  '    HHHHHHHH    ',
  '   HHHHHHHHHH   ',
  '  HHHHHHHHHHHH  ',
  '  HHhhhhhhhhHH  ',
  ' HHhSSSSSSSShHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHSHHSSSSHHSHH ',
  ' HHSWWWSSWWWSHH ',
  ' HHSWBWSSWBWSHH ',
  ' HHqSSSssSSSqHH ',
  ' HHSSSppppSSSHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHHSSSSSSSSHHH ',
  ' HHHHsSSSSsHHHH ',
  ' HHHTTTTTTTTHHH ',
  '  TTTTTTTTTTTT  ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' sTTTTTTTTTTTTs ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJ  JJJJJ  ',
  '  JJJJJ  JJJJJ  ',
  '  OOOOO  OOOOO  ',
  '  OOOOO  OOOOO  ',
]);

SPRITES.girlWalk = makeSprite([
  '      HHHH      ',
  '    HHHHHHHH    ',
  '   HHHHHHHHHH   ',
  '  HHHHHHHHHHHH  ',
  '  HHhhhhhhhhHH  ',
  ' HHhSSSSSSSShHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHSHHSSSSHHSHH ',
  ' HHSWWWSSWWWSHH ',
  ' HHSWBWSSWBWSHH ',
  ' HHqSSSssSSSqHH ',
  ' HHSSSppppSSSHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHHSSSSSSSSHHH ',
  ' HHHHsSSSSsHHHH ',
  ' HHHTTTTTTTTHHH ',
  '  TTTTTTTTTTTT  ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' sTTTTTTTTTTTTs ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJ  JJJJJ  ',
  ' JJJJJ    JJJJJ ',
  ' OOOO      JJJJ ',
  'OOOO        OOOO',
]);

SPRITES.girlJump = makeSprite([
  '      HHHH      ',
  '    HHHHHHHH    ',
  '   HHHHHHHHHH   ',
  '  HHHHHHHHHHHH  ',
  '  HHhhhhhhhhHH  ',
  ' HHhSSSSSSSShHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHSHHSSSSHHSHH ',
  ' HHSWWWSSWWWSHH ',
  ' HHSWBWSSWBWSHH ',
  ' HHqSSSssSSSqHH ',
  ' HHSSSppppSSSHH ',
  ' HHSSSSSSSSSSHH ',
  ' HHHSSSSSSSSHHH ',
  ' HHHHsSSSSsHHHH ',
  ' HHHTTTTTTTTHHH ',
  '  TTTTTTTTTTTT  ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' STTTTTTTTTTTTS ',
  ' sTTTTTTTTTTTTs ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  JJJJJJJJJJJJ  ',
  '  OOOOOOOOOOOO  ',
  '   OOOOOOOOOO   ',
]);

/* ----------------------------------------------------------------- Plumbob */
/* Losange Sims : diamant allonge, facette claire a gauche / foncee a droite,
   pointe en haut et en bas. 7 x 9. */
SPRITES.plumbob = makeSprite([
  '   g   ',
  '  gWG  ',
  ' gggGG ',
  'ggggGGG',
  'ggggGGG',
  'ggggGGG',
  ' gggGG ',
  '  ggG  ',
  '   d   ',
]);

/* ------------------------------------------------------------- Bloc "?" 14x14 */
SPRITES.blockQ = makeSprite([
  'DDDDDDDDDDDDDD',
  'DrLbbbbbbbbLrD',
  'DbbbbbbbbbbbbD',
  'DbbbWWWWWWbbbD',
  'DbbWWbbbbWWbbD',
  'DbbbbbbbbWWbbD',
  'DbbbbbbbWWbbbD',
  'DbbbbbbWWbbbbD',
  'DbbbbbbWWbbbbD',
  'DbbbbbbbbbbbbD',
  'DbbbbbbWWbbbbD',
  'DbbbbbbbbbbbbD',
  'DrLbbbbbbbbLrD',
  'DDDDDDDDDDDDDD',
]);

/* Bloc vide (apres impact) — brun facon Mario */
SPRITES.blockUsed = makeSprite([
  'CCCCCCCCCCCCCC',
  'CCeeeeeeeeeeCC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CeeeeeeeeeeeeC',
  'CCeeeeeeeeeeCC',
  'CCCCCCCCCCCCCC',
]);

/* ------------------------------------------------------------- Cadeaux 12x12 */
// 1 — Bouquet de fleurs
SPRITES.giftFlowers = makeSprite([
  ' RR  YY  PP ',
  ' RYR YYY PRP',
  '  R  nYn  P ',
  '   n nn n   ',
  '    nnnn    ',
  '    nmmn    ',
  '   wmmmmw   ',
  '   wwwwww   ',
  '   wwwwww   ',
  '    wwww    ',
  '     ww     ',
  '            ',
]);

// 2 — Montre
SPRITES.giftWatch = makeSprite([
  '     ee     ',
  '     ee     ',
  '    cccc    ',
  '   cWWWWc   ',
  '   cWKWWc   ',
  '   cWKKWc   ',
  '   cWWWWc   ',
  '    cccc    ',
  '     ee     ',
  '     ee     ',
  '            ',
  '            ',
]);

// 3 — Robe
SPRITES.giftDress = makeSprite([
  '    TTTT    ',
  '    TTTT    ',
  '   TTTTTT   ',
  '   TtTTtT   ',
  '  TTTTTTTT  ',
  '  TTPPPPTT  ',
  ' TTTTTTTTTT ',
  ' TtTTTTTTtT ',
  'TTTTTTTTTTTT',
  'TtTTTTTTTTtT',
  '            ',
  '            ',
]);

// 4 — Restaurant (assiette + couverts + coeur)
SPRITES.giftResto = makeSprite([
  ' C        C ',
  ' c        c ',
  ' c        c ',
  '   wwwwww   ',
  '  wwwwwwww  ',
  '  wwRRRRww  ',
  '  wwRRRRww  ',
  '  wwwwwwww  ',
  '   wwwwww   ',
  '            ',
  '            ',
  '            ',
]);

/* ----------------------------------------------------------------- Decor */
SPRITES.heart = makeSprite([
  ' RR RR ',
  'RRRRRRR',
  'RRRRRRR',
  ' RRRRR ',
  '  RRR  ',
  '   R   ',
]);

SPRITES.cloud = makeSprite([
  '    wwww    ',
  '  wwwwwwww  ',
  ' wwwwwwwwww ',
  ' wwwwwwwwww ',
  '  wwwwwwww  ',
]);

SPRITES.bush = makeSprite([
  '     nnnn     ',
  '   nnnnnnnn   ',
  '  nnnnnnnnnn  ',
  ' nnnnnnnnnnnn ',
  ' nmnmnmnmnmnm ',
  ' nnnnnnnnnnnn ',
]);

/* -------------------------------------------------------------- drawSprite
   Peint un sprite sur le contexte canvas.
   x,y = coin haut-gauche (px monde) ; scale = taille d'un pixel ; flipX = miroir. */
function drawSprite(ctx, sprite, x, y, scale, flipX) {
  scale = scale || 1;
  x = Math.round(x); y = Math.round(y);
  const rows = sprite.rows, w = sprite.w;
  for (let ry = 0; ry < rows.length; ry++) {
    const row = rows[ry];
    for (let rx = 0; rx < w; rx++) {
      const color = PALETTE[row[rx]];
      if (!color) continue;
      const drawX = flipX ? (w - 1 - rx) : rx;
      ctx.fillStyle = color;
      ctx.fillRect(x + drawX * scale, y + ry * scale, scale, scale);
    }
  }
}
