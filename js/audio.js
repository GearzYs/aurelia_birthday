/* =========================================================================
   audio.js — Musique de fond (MP3 fourni) + bruitages 8-bit (WebAudio)
   ========================================================================= */

const Sound = (function () {
  const MUSIC_SRC = '01 - Its the Sims - Full Version.mp3';

  let music = null;       // <audio> element
  let actx = null;        // AudioContext pour les SFX
  let muted = false;
  let started = false;

  function init() {
    music = new Audio(encodeURI(MUSIC_SRC));
    music.loop = true;
    music.volume = 0.45;
    music.preload = 'auto';
  }

  // Doit etre appele depuis un geste utilisateur (clic JOUER)
  function start() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === 'suspended') actx.resume();
    if (music && !muted) {
      music.currentTime = 0;
      music.play().catch(function () {/* autoplay bloque : ignore */});
    }
    started = true;
  }

  function setMuted(m) {
    muted = m;
    if (music) music.muted = m;
    if (m && music) music.pause();
    else if (!m && started && music) music.play().catch(function () {});
  }

  function toggleMute() { setMuted(!muted); return muted; }
  function isMuted() { return muted; }

  // ---- bruitages 8-bit -------------------------------------------------
  function tone(freq, start, dur, type, peak) {
    if (!actx || muted) return;
    const t0 = actx.currentTime + start;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak || 0.18, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(actx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Saut : petit glissando montant
  function jump() {
    if (!actx || muted) return;
    const t0 = actx.currentTime;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(330, t0);
    osc.frequency.exponentialRampToValueAtTime(720, t0 + 0.12);
    gain.gain.setValueAtTime(0.16, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
    osc.connect(gain).connect(actx.destination);
    osc.start(t0); osc.stop(t0 + 0.18);
  }

  // Bloc frappe / piece (style Mario coin) : deux notes rapides
  function coin() {
    tone(988, 0, 0.08, 'square', 0.2);   // B5
    tone(1319, 0.07, 0.18, 'square', 0.2); // E6
  }

  // Cadeau ramasse : petit arpege joyeux
  function collect() {
    tone(523, 0.00, 0.10, 'triangle', 0.22); // C5
    tone(659, 0.10, 0.10, 'triangle', 0.22); // E5
    tone(784, 0.20, 0.10, 'triangle', 0.22); // G5
    tone(1047, 0.30, 0.22, 'triangle', 0.22); // C6
  }

  // Fanfare finale
  function fanfare() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach(function (f, i) {
      tone(f, i * 0.13, 0.18, 'square', 0.2);
    });
    tone(1568, notes.length * 0.13, 0.5, 'triangle', 0.22);
  }

  return {
    init: init, start: start, toggleMute: toggleMute,
    isMuted: isMuted, setMuted: setMuted,
    jump: jump, coin: coin, collect: collect, fanfare: fanfare,
  };
})();
