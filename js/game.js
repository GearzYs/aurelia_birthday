/* =========================================================================
   game.js — Mini-jeu d'anniversaire "Sims 4 en pixel art"
   Machine a etats HOME -> GAME -> FINAL, physique, blocs "?", cadeaux, messages.
   ========================================================================= */
(function () {
  'use strict';

  // ---- Canvas / resolution interne (gros pixels via upscale CSS) ----------
  const VIEW_W = 320, VIEW_H = 180;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  ctx.imageSmoothingEnabled = false;

  // ---- Physique -----------------------------------------------------------
  const GRAVITY = 0.4;
  const MOVE_SPEED = 1.6;
  const JUMP_VEL = -7.0;
  const GROUND_Y = 152;            // haut du sol
  const PLAYER_W = 24, PLAYER_H = 42;

  // ---- Cadeaux (MESSAGES PERSONNALISABLES ICI) ---------------------------
  const GIFTS = [
    { sprite: 'giftFlowers', name: 'Bouquet de fleurs', emoji: '💐',
      msg: "Pour toi, mon amour. 🌷 Des fleurs qui ne faneront jamais autant que mon amour pour toi." },
    { sprite: 'giftWatch', name: 'Une montre', emoji: '⌚',
      msg: "Le temps passe… mais chaque seconde passée avec toi est un cadeau. ⌚❤️" },
    { sprite: 'giftDress', name: 'Une robe', emoji: '👗',
      msg: "Une robe magnifique pour la plus belle des brunes aux yeux bleus. 👗 Tu vas être éblouissante." },
    { sprite: 'giftResto', name: 'Un restaurant', emoji: '🍽️',
      msg: "Réserve ta soirée : je t'emmène dîner en amoureux. 🍽️ Rien que toi et moi, mon Ciccio Bello Bobo." },
  ];

  // ---- Etat global --------------------------------------------------------
  const STATE = { HOME: 'home', GAME: 'game', PAUSED: 'paused', FINAL: 'final' };
  let state = STATE.HOME;
  let tick = 0;

  const player = {};
  let blocks = [];
  let gifts = [];          // cadeaux actifs (entites a l'ecran)
  let collected = 0;
  let confetti = [];
  let hearts = [];

  // ---- DOM ----------------------------------------------------------------
  const $ = function (id) { return document.getElementById(id); };
  const homeEl = $('home'), hudEl = $('hud'), countEl = $('count');
  const cardEl = $('card'), cardTitle = $('cardTitle'), cardText = $('cardText');
  const cardCanvas = $('cardCanvas'), cctx = cardCanvas.getContext('2d');
  const finalEl = $('final'), muteBtn = $('muteBtn');

  // ---- Decor (positions fixes) -------------------------------------------
  const clouds = [
    { x: 28, y: 20 }, { x: 190, y: 14 }, { x: 262, y: 34 }, { x: 110, y: 40 },
  ];
  const bushes = [{ x: 6, y: GROUND_Y - 6 }, { x: VIEW_W - 50, y: GROUND_Y - 6 }];

  // =========================================================================
  // INITIALISATION / RESET
  // =========================================================================
  function resetGame() {
    player.x = 20;
    player.y = GROUND_Y - PLAYER_H;
    player.vx = 0; player.vy = 0;
    player.onGround = true; player.facing = 1;
    player.frame = 0; player.animT = 0;

    // 4 blocs alignes et centres
    const centers = [VIEW_W * 0.20, VIEW_W * 0.40, VIEW_W * 0.60, VIEW_W * 0.80];
    blocks = centers.map(function (cx, i) {
      return {
        x: Math.round(cx - 7), y: 50, w: 14, h: 14,
        used: false, bump: 0, giftIndex: i,
      };
    });

    gifts = [];
    collected = 0;
    confetti = [];
    hearts = [];
    updateHUD();
  }

  function updateHUD() {
    countEl.textContent = collected + ' / 4';
  }

  // =========================================================================
  // ENTREE CLAVIER
  // =========================================================================
  const keys = {};
  window.addEventListener('keydown', function (e) {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].indexOf(k) !== -1) {
      e.preventDefault();
    }
    if (state === STATE.GAME && (k === ' ' || k === 'arrowup' || k === 'w')) tryJump();
  });
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

  function tryJump() {
    if (player.onGround) {
      player.vy = JUMP_VEL;
      player.onGround = false;
      Sound.jump();
    }
  }

  // =========================================================================
  // BOUTONS UI
  // =========================================================================
  $('playBtn').addEventListener('click', function () {
    Sound.start();
    homeEl.classList.add('hidden');
    hudEl.classList.remove('hidden');
    resetGame();
    state = STATE.GAME;
  });

  $('cardBtn').addEventListener('click', function () {
    cardEl.classList.add('hidden');
    if (collected >= 4) { goFinal(); }
    else { state = STATE.GAME; }
  });

  $('replayBtn').addEventListener('click', function () {
    finalEl.classList.add('hidden');
    hudEl.classList.remove('hidden');
    resetGame();
    state = STATE.GAME;
  });

  muteBtn.addEventListener('click', function () {
    const muted = Sound.toggleMute();
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.classList.toggle('off', muted);
  });

  // =========================================================================
  // LOGIQUE DE JEU
  // =========================================================================
  function update() {
    tick++;
    if (state === STATE.GAME) updateGame();
    else if (state === STATE.FINAL) updateFinal();
  }

  function updateGame() {
    // --- deplacement horizontal ---
    let move = 0;
    if (keys['arrowleft'] || keys['a']) move -= 1;
    if (keys['arrowright'] || keys['d']) move += 1;
    player.vx = move * MOVE_SPEED;
    if (move !== 0) player.facing = move;

    player.x += player.vx;
    // bords de l'ecran
    if (player.x < 0) player.x = 0;
    if (player.x + PLAYER_W > VIEW_W) player.x = VIEW_W - PLAYER_W;
    resolveBlocksX();

    // --- gravite / saut ---
    player.vy += GRAVITY;
    if (player.vy > 9) player.vy = 9;
    player.y += player.vy;

    // sol
    if (player.y + PLAYER_H >= GROUND_Y) {
      player.y = GROUND_Y - PLAYER_H;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.onGround = false;
    }
    resolveBlocksY();

    // --- animation ---
    if (move !== 0 && player.onGround) {
      player.animT++;
      if (player.animT > 8) { player.frame ^= 1; player.animT = 0; }
    } else { player.frame = 0; }

    // --- blocs : decroissance du rebond ---
    blocks.forEach(function (b) { if (b.bump > 0) b.bump = Math.max(0, b.bump - 1); });

    // --- cadeaux ---
    updateGifts();
  }

  // Collisions horizontales avec les blocs (solides)
  function resolveBlocksX() {
    blocks.forEach(function (b) {
      if (overlap(player.x, player.y, PLAYER_W, PLAYER_H, b.x, b.y, b.w, b.h)) {
        if (player.vx > 0) player.x = b.x - PLAYER_W;
        else if (player.vx < 0) player.x = b.x + b.w;
      }
    });
  }

  // Collisions verticales : tete contre bloc (=> cadeau), atterrissage sur bloc
  function resolveBlocksY() {
    blocks.forEach(function (b) {
      if (!overlap(player.x, player.y, PLAYER_W, PLAYER_H, b.x, b.y, b.w, b.h)) return;
      if (player.vy < 0) {
        // tape par en dessous
        player.y = b.y + b.h;
        player.vy = 1;
        hitBlock(b);
      } else if (player.vy > 0) {
        // atterrit sur le bloc
        player.y = b.y - PLAYER_H;
        player.vy = 0;
        player.onGround = true;
      }
    });
  }

  function hitBlock(b) {
    b.bump = 6;
    if (b.used) return;
    b.used = true;
    Sound.coin();
    spawnGift(b);
  }

  function spawnGift(b) {
    const g = GIFTS[b.giftIndex];
    const sp = SPRITES[g.sprite];
    // direction d'envol : vers le centre de l'ecran pour rester atteignable
    const dir = (b.x + b.w / 2 < VIEW_W / 2) ? 1 : -1;
    gifts.push({
      giftIndex: b.giftIndex,
      sprite: sp,
      x: b.x + (b.w - sp.w) / 2,
      y: b.y - sp.h,
      w: sp.w, h: sp.h,
      vx: dir * 1.1, vy: -3.0,
      grounded: false,
    });
  }

  function updateGifts() {
    for (let i = gifts.length - 1; i >= 0; i--) {
      const g = gifts[i];
      // physique facon champignon Mario
      g.vy += GRAVITY * 0.7;
      if (g.vy > 6) g.vy = 6;
      g.x += g.vx;
      g.y += g.vy;

      // murs
      if (g.x < 0) { g.x = 0; g.vx = Math.abs(g.vx); }
      if (g.x + g.w > VIEW_W) { g.x = VIEW_W - g.w; g.vx = -Math.abs(g.vx); }

      // sol
      if (g.y + g.h >= GROUND_Y) {
        g.y = GROUND_Y - g.h;
        g.vy = 0;
        g.grounded = true;
        g.vx *= 0.9;
        if (Math.abs(g.vx) < 0.05) g.vx = 0;
      }

      // ramassage par le perso
      if (overlap(player.x, player.y, PLAYER_W, PLAYER_H, g.x, g.y, g.w, g.h)) {
        gifts.splice(i, 1);
        collected++;
        updateHUD();
        Sound.collect();
        showCard(g.giftIndex);
        break;
      }
    }
  }

  function overlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  // =========================================================================
  // CARTE-MESSAGE (panneau Sims)
  // =========================================================================
  function showCard(index) {
    state = STATE.PAUSED;
    const g = GIFTS[index];
    cardTitle.textContent = g.emoji + '  ' + g.name + '  ' + g.emoji;
    cardText.textContent = g.msg;
    // dessine le cadeau en pixel art dans la carte
    const sp = SPRITES[g.sprite];
    const sc = 9;
    cardCanvas.width = sp.w * sc;
    cardCanvas.height = sp.h * sc;
    cctx.imageSmoothingEnabled = false;
    cctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);
    drawSprite(cctx, sp, 0, 0, sc, false);
    cardEl.classList.remove('hidden');
  }

  // =========================================================================
  // ECRAN FINAL
  // =========================================================================
  function goFinal() {
    state = STATE.FINAL;
    hudEl.classList.add('hidden');
    finalEl.classList.remove('hidden');
    spawnConfetti();
    Sound.fanfare();
  }

  const CONFETTI_COLORS = ['#e8456b', '#ffd23f', '#1ba9e1', '#9be84a', '#ff8fb0', '#ffffff'];
  function spawnConfetti() {
    confetti = [];
    for (let i = 0; i < 90; i++) {
      confetti.push({
        x: Math.random() * VIEW_W,
        y: Math.random() * VIEW_H - VIEW_H,
        vy: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.8,
        size: 2 + Math.floor(Math.random() * 3),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
    }
    hearts = [];
    for (let i = 0; i < 6; i++) {
      hearts.push({ x: Math.random() * VIEW_W, y: VIEW_H + Math.random() * 60, vy: 0.4 + Math.random() * 0.5 });
    }
  }

  function updateFinal() {
    confetti.forEach(function (c) {
      c.y += c.vy; c.x += c.vx;
      if (c.y > VIEW_H) { c.y = -4; c.x = Math.random() * VIEW_W; }
    });
    hearts.forEach(function (h) {
      h.y -= h.vy;
      if (h.y < -8) { h.y = VIEW_H + 8; h.x = Math.random() * VIEW_W; }
    });
  }

  // =========================================================================
  // RENDU
  // =========================================================================
  function drawSky(top, bottom) {
    const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  function drawGround() {
    ctx.fillStyle = '#b07a43';                       // terre
    ctx.fillRect(0, GROUND_Y, VIEW_W, VIEW_H - GROUND_Y);
    ctx.fillStyle = '#7bd957';                       // herbe
    ctx.fillRect(0, GROUND_Y, VIEW_W, 5);
    ctx.fillStyle = '#5fb53f';                       // ombre herbe
    ctx.fillRect(0, GROUND_Y + 5, VIEW_W, 2);
  }

  function drawClouds() {
    clouds.forEach(function (c) { drawSprite(ctx, SPRITES.cloud, c.x, c.y, 1, false); });
  }

  function drawPlumbob(centerX, baseY) {
    const sp = SPRITES.plumbob;
    const bob = Math.sin(tick * 0.12) * 1.4;
    drawSprite(ctx, sp, Math.round(centerX - sp.w / 2), Math.round(baseY + bob), 1, false);
  }

  function render() {
    if (state === STATE.HOME) { renderHome(); return; }
    if (state === STATE.FINAL) { renderFinal(); return; }
    renderGame();
  }

  function renderGame() {
    drawSky('#79c9f2', '#cdeeff');
    drawClouds();
    bushes.forEach(function (b) { drawSprite(ctx, SPRITES.bush, b.x, b.y, 1, false); });
    drawGround();

    // blocs
    blocks.forEach(function (b) {
      const sp = b.used ? SPRITES.blockUsed : SPRITES.blockQ;
      drawSprite(ctx, sp, b.x, b.y - b.bump, 1, false);
    });

    // cadeaux + etincelle
    gifts.forEach(function (g) {
      drawSprite(ctx, g.sprite, g.x, g.y, 1, false);
      if (Math.floor(tick / 6) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(g.x + g.w), Math.round(g.y - 2), 1, 1);
        ctx.fillRect(Math.round(g.x - 1), Math.round(g.y + 2), 1, 1);
      }
    });

    // personnage + plumbob
    drawPlayer();
  }

  function drawPlayer() {
    let frame = SPRITES.girlIdle;
    if (!player.onGround) frame = SPRITES.girlJump;
    else if (player.frame === 1) frame = SPRITES.girlWalk;
    const flip = player.facing < 0;
    drawSprite(ctx, frame, player.x, player.y, 1, flip);
    drawPlumbob(player.x + PLAYER_W / 2, player.y - SPRITES.plumbob.h - 2);
  }

  function renderHome() {
    drawSky('#5bb8ec', '#bfe6ff');
    drawClouds();
    drawGround();
    bushes.forEach(function (b) { drawSprite(ctx, SPRITES.bush, b.x, b.y, 1, false); });
    // la brune (echelle 1 : laisse la place au plumbob + titre au-dessus)
    const sc = 1;
    const gw = SPRITES.girlIdle.w * sc, gh = SPRITES.girlIdle.h * sc;
    const gx = Math.round((VIEW_W - gw) / 2), gy = GROUND_Y - gh;
    drawSprite(ctx, SPRITES.girlIdle, gx, gy, sc, false);
    // plumbob losange anime au-dessus de la tete
    const psc = 2, psp = SPRITES.plumbob;
    const bob = Math.sin(tick * 0.12) * 2;
    drawSprite(ctx, psp, Math.round(VIEW_W / 2 - (psp.w * psc) / 2), Math.round(gy - psp.h * psc - 3 + bob), psc, false);
  }

  function renderFinal() {
    drawSky('#ff9ec7', '#ffe1b3');               // ambiance fete
    drawClouds();
    drawGround();
    // confettis
    confetti.forEach(function (c) {
      ctx.fillStyle = c.color;
      ctx.fillRect(Math.round(c.x), Math.round(c.y), c.size, c.size);
    });
    // coeurs qui montent
    hearts.forEach(function (h) { drawSprite(ctx, SPRITES.heart, h.x, h.y, 2, false); });
    // la brune qui "danse"
    const sc = 1;
    const frame = (Math.floor(tick / 14) % 2 === 0) ? SPRITES.girlIdle : SPRITES.girlJump;
    const gw = SPRITES.girlIdle.w * sc, gh = SPRITES.girlIdle.h * sc;
    const gx = Math.round((VIEW_W - gw) / 2), gy = GROUND_Y - gh;
    drawSprite(ctx, frame, gx, gy, sc, (Math.floor(tick / 14) % 2 === 0));
    const psc = 2, psp = SPRITES.plumbob;
    const bob = Math.sin(tick * 0.18) * 2;
    drawSprite(ctx, psp, Math.round(VIEW_W / 2 - (psp.w * psc) / 2), Math.round(gy - psp.h * psc - 2 + bob), psc, false);
  }

  // =========================================================================
  // BOUCLE PRINCIPALE
  // =========================================================================
  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  // demarrage
  Sound.init();
  resetGame();
  state = STATE.HOME;
  // [DEV] sauts d'ecran pour tests : #game / #final
  if (location.hash === '#game') { homeEl.classList.add('hidden'); hudEl.classList.remove('hidden'); state = STATE.GAME; }
  else if (location.hash === '#final') { homeEl.classList.add('hidden'); collected = 4; goFinal(); }
  requestAnimationFrame(loop);
})();
