import styles from './ProcessJourney.module.css';

/**
 * Line-and-wash illustration of a two-storey Pacific Northwest contemporary: stone entry tower,
 * gray siding, black-framed glazing, wood accents, paver drive and conifers.
 * It builds in four stages (site, blueprint, framing, finished) as `stage` goes 0 to 3.
 * Coordinates are in "house space" (feet-ish units); the whole drawing is scaled once at the bottom.
 */

type Rect = [number, number, number, number]; // x1, y1, x2, y2

const GROUND = 330;

// ---- Volumes -------------------------------------------------------------------------------
const GARAGE: Rect = [36, 262, 252, GROUND];
const GARAGE_SLAB: Rect = [28, 256, 260, 262];
const UPPER: Rect = [120, 176, 252, 256];
const UPPER_SLAB: Rect = [112, 170, 260, 176];
const TOWER: Rect = [252, 150, 342, GROUND];
const TOWER_SLAB: Rect = [246, 144, 350, 150];
const WING: Rect = [342, 190, 572, GROUND];
const WING_SLAB: Rect = [334, 184, 582, 190];
const CHIMNEY: Rect = [500, 160, 522, 184];
const WOOD_BAND: Rect = [120, 244, 252, 256];
const WOOD_SOFFIT: Rect = [334, 190, 582, 197];

const VOLUMES: Rect[] = [GARAGE, UPPER, TOWER, WING];
const SLABS: Rect[] = [GARAGE_SLAB, UPPER_SLAB, TOWER_SLAB, WING_SLAB];

// ---- Openings ------------------------------------------------------------------------------
const GARAGE_DOOR: Rect = [52, 276, 236, GROUND];
const WIN_UPPER: Rect[] = [[138, 192, 176, 244], [192, 192, 240, 244]];
const DOOR: Rect = [270, 232, 324, GROUND];
const TRANSOM: Rect = [270, 206, 324, 226];
const SLOT: Rect = [288, 164, 306, 196];
const GLAZING: Rect = [360, 250, 552, 324];
const WIN_WING: Rect[] = [[362, 206, 420, 236], [440, 206, 498, 236]];

const GLASS: Rect[] = [...WIN_UPPER, DOOR, TRANSOM, SLOT, GLAZING, ...WIN_WING];
const LIT: Rect[] = [GLAZING, DOOR, WIN_UPPER[0], WIN_UPPER[1]];
const OPENINGS: Rect[] = [GARAGE_DOOR, ...GLASS];

const rect = ([x1, y1, x2, y2]: Rect) => `M${x1} ${y1}H${x2}V${y2}H${x1}Z`;
const inflate = ([x1, y1, x2, y2]: Rect, n: number): Rect => [x1 - n, y1 - n, x2 + n, y2 + n];

// Small seeded generator so the stone coursing is the same on every render.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const MULLIONS =
  'M216 192V244M288 232V330M306 232V330M408 250V324M456 250V324M504 250V324M391 206V236M469 206V236';

const GARAGE_PANELS = 'M98 276V296M144 276V296M190 276V296M52 296H236M52 307H236M52 318H236';

function siding([x1, y1, x2, y2]: Rect, gap = 6): string {
  let d = '';
  for (let y = y1 + gap; y < y2; y += gap) d += `M${x1} ${y}H${x2}`;
  return d;
}

function stone([x1, y1, x2, y2]: Rect): string {
  const r = rng(11);
  let d = '';
  let row = 0;
  for (let y = y1 + 9; y < y2; y += 9, row++) {
    d += `M${x1} ${y}H${x2}`;
    let x = x1 + (row % 2 ? 10 : 22);
    while (x < x2 - 4) {
      d += `M${x.toFixed(1)} ${y - 9}V${y}`;
      x += 14 + r() * 16;
    }
  }
  return d;
}

/** Vertical studs, broken around openings (short cripple studs stay above and below). */
function studs(v: Rect, step = 16): string {
  const [x1, y1, x2, y2] = v;
  const ops = OPENINGS.map((o) => inflate(o, 3)).filter((o) => o[2] > x1 && o[0] < x2 && o[3] > y1 && o[1] < y2);
  let d = '';
  for (let x = x1 + 8; x < x2; x += step) {
    let segs: [number, number][] = [[y1, y2]];
    for (const o of ops) {
      if (x > o[0] && x < o[2]) {
        segs = segs.flatMap(([a, b]) => {
          const out: [number, number][] = [];
          if (o[1] > a) out.push([a, Math.min(b, o[1])]);
          if (o[3] < b) out.push([Math.max(a, o[3]), b]);
          return out;
        });
      }
    }
    for (const [a, b] of segs) if (b - a > 2) d += `M${x} ${a}V${b}`;
  }
  return d + `M${x1} ${y1 + 5}H${x2}M${x1} ${y2 - 5}H${x2}`;
}

function joists([x1, y1, x2, y2]: Rect): string {
  let d = '';
  for (let x = x1 + 6; x < x2; x += 9) d += `M${x} ${y1}V${y2}`;
  return d;
}

function conifer(cx: number, baseY: number, h: number, w: number): string {
  const tiers = 5;
  const top = baseY - h;
  const left: [number, number][] = [[cx, top]];
  const right: [number, number][] = [];
  for (let k = 1; k <= tiers; k++) {
    const y = top + (h * 0.88 * k) / tiers;
    const hw = (w / 2) * (0.28 + (0.72 * k) / tiers);
    left.push([cx - hw, y], [cx - hw * 0.5, y - 3]);
    right.unshift([cx + hw * 0.5, y - 3], [cx + hw, y]);
  }
  const pts = [...left, ...right];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z` +
    `M${cx} ${baseY - h * 0.12}V${baseY}`;
}

function bushes(x1: number, x2: number, base: number, r: number): string {
  let d = `M${x1} ${base}`;
  let x = x1;
  while (x + 2 * r <= x2 + 0.1) {
    d += `A${r} ${r} 0 0 1 ${x + 2 * r} ${base}`;
    x += 2 * r;
  }
  return d + 'Z';
}

function pavers(top: [number, number], bottom: [number, number], yTop: number, yBot: number, cols: number, rows: number): string {
  let d = '';
  for (let c = 1; c < cols; c++) {
    const t = c / cols;
    d += `M${(top[0] + (top[1] - top[0]) * t).toFixed(1)} ${yTop}L${(bottom[0] + (bottom[1] - bottom[0]) * t).toFixed(1)} ${yBot}`;
  }
  for (let r = 1; r < rows; r++) {
    const t = r / rows;
    const y = yTop + (yBot - yTop) * t;
    const xl = top[0] + (bottom[0] - top[0]) * t;
    const xr = top[1] + (bottom[1] - top[1]) * t;
    d += `M${xl.toFixed(1)} ${y.toFixed(1)}H${xr.toFixed(1)}`;
  }
  return d;
}

const DRIVE = 'M36 330H252L274 358H14Z';
const WALK = 'M270 330H324L342 358H252Z';
const TREE_L = conifer(-6, GROUND, 168, 70);
const TREE_R = conifer(612, GROUND, 148, 62);
const TREE_BACK = conifer(560, 190, 96, 46);

const STONE_LINES = stone(TOWER);
const SIDING_UPPER = siding(UPPER);
const SIDING_WING = siding(WING);
const SIDING_GARAGE = siding([GARAGE[0], GARAGE[1], GARAGE[2], GARAGE_DOOR[1]]);
const STUDS =
  studs(GARAGE) + studs(UPPER) + studs(TOWER) + studs(WING, 18);
const HEADERS = [GARAGE_DOOR, ...WIN_UPPER, DOOR, TRANSOM, SLOT, GLAZING, ...WIN_WING]
  .map((r) => `M${r[0] - 3} ${r[1] - 4}H${r[2] + 3}`)
  .join('');
const JOISTS = SLABS.map(joists).join('');

const GLINTS = GLASS.filter((g) => g[2] - g[0] > 40)
  .map((g) => {
    const w = g[2] - g[0];
    const h = g[3] - g[1];
    return `M${g[0] + w * 0.16} ${g[3] - 3}L${g[0] + w * 0.16 + h * 0.34} ${g[1] + 3}M${g[0] + w * 0.16 + 7} ${g[3] - 3}L${g[0] + w * 0.16 + h * 0.34 + 7} ${g[1] + 3}`;
  })
  .join('');

const d = (i: number) => ({ '--i': i } as React.CSSProperties);

function Stroke({ path, i = 0 }: { path: string; i?: number }) {
  return <path className={styles.draw} style={d(i)} pathLength={1} d={path} />;
}

export function HouseIllustration({ stage }: { stage: number }) {
  const on = (n: number) => (stage >= n ? styles.on : '');

  return (
    <svg
      className={styles.drawing}
      viewBox="0 56 640 344"
      role="img"
      aria-label="A home taking shape in four stages, from site plan to a finished two-storey house"
    >
      <defs>
        <radialGradient id="jbhGlow" cx="50%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#B88A4B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#B88A4B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jbhGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dfe8e5" />
          <stop offset="100%" stopColor="#b9c9c4" />
        </linearGradient>
        <linearGradient id="jbhWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2d9a8" />
          <stop offset="100%" stopColor="#d9a964" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="640" height="400" fill="url(#jbhGlow)" className={`${styles.fade} ${on(3)}`} />

      <g transform="translate(36 14) scale(0.93)">
        {/* ---------- 4. Finished: washes sit under the linework ---------- */}
        <g className={`${styles.layer} ${styles.l4} ${on(3)}`}>
          <polygon className={`${styles.fade} ${styles.pave}`} points="36,330 252,330 274,358 14,358" />
          <polygon className={`${styles.fade} ${styles.pave}`} points="270,330 324,330 342,358 252,358" />
          <path className={`${styles.fade} ${styles.paveLine}`} d={pavers([36, 252], [14, 274], 330, 358, 10, 4) + pavers([270, 324], [252, 342], 330, 358, 4, 4)} />

          <path className={`${styles.fade} ${styles.treeFill}`} d={TREE_L} />
          <path className={`${styles.fade} ${styles.treeFill}`} d={TREE_R} />
          <path className={`${styles.fade} ${styles.treeFillDeep}`} d={TREE_BACK} />

          <rect className={`${styles.fade} ${styles.garageWall}`} x={GARAGE[0]} y={GARAGE[1]} width={GARAGE[2] - GARAGE[0]} height={GARAGE[3] - GARAGE[1]} />
          <rect className={`${styles.fade} ${styles.siding}`} x={UPPER[0]} y={UPPER[1]} width={UPPER[2] - UPPER[0]} height={UPPER[3] - UPPER[1]} />
          <rect className={`${styles.fade} ${styles.siding}`} x={WING[0]} y={WING[1]} width={WING[2] - WING[0]} height={WING[3] - WING[1]} />
          <rect className={`${styles.fade} ${styles.stoneFill}`} x={TOWER[0]} y={TOWER[1]} width={TOWER[2] - TOWER[0]} height={TOWER[3] - TOWER[1]} />
          <path className={`${styles.fade} ${styles.sidingLine}`} d={SIDING_UPPER + SIDING_WING + SIDING_GARAGE} />
          <path className={`${styles.fade} ${styles.stoneLine}`} d={STONE_LINES} />

          <rect className={`${styles.fade} ${styles.wood}`} x={WOOD_BAND[0]} y={WOOD_BAND[1]} width={WOOD_BAND[2] - WOOD_BAND[0]} height={WOOD_BAND[3] - WOOD_BAND[1]} />
          <rect className={`${styles.fade} ${styles.wood}`} x={WOOD_SOFFIT[0]} y={WOOD_SOFFIT[1]} width={WOOD_SOFFIT[2] - WOOD_SOFFIT[0]} height={WOOD_SOFFIT[3] - WOOD_SOFFIT[1]} />

          {GLASS.map((g, i) => (
            <rect key={`g${i}`} className={`${styles.fade} ${styles.glass}`} x={g[0]} y={g[1]} width={g[2] - g[0]} height={g[3] - g[1]} />
          ))}
          {LIT.map((g, i) => (
            <rect key={`l${i}`} className={`${styles.fade} ${styles.warm}`} x={g[0]} y={g[1] + (g[3] - g[1]) * 0.12} width={g[2] - g[0]} height={(g[3] - g[1]) * 0.88} />
          ))}
          <path className={`${styles.fade} ${styles.pendant}`} d="M432 250V262M480 250V262M528 250V262" />
          <circle className={`${styles.fade} ${styles.lamp}`} cx="432" cy="265" r="3.4" />
          <circle className={`${styles.fade} ${styles.lamp}`} cx="480" cy="265" r="3.4" />
          <circle className={`${styles.fade} ${styles.lamp}`} cx="528" cy="265" r="3.4" />

          <rect className={`${styles.fade} ${styles.garageDoor}`} x={GARAGE_DOOR[0]} y={GARAGE_DOOR[1] + 20} width={GARAGE_DOOR[2] - GARAGE_DOOR[0]} height={GARAGE_DOOR[3] - GARAGE_DOOR[1] - 20} />
          <rect className={`${styles.fade} ${styles.garageGlass}`} x={GARAGE_DOOR[0]} y={GARAGE_DOOR[1]} width={GARAGE_DOOR[2] - GARAGE_DOOR[0]} height={20} />

          {[...SLABS, WOOD_SOFFIT].map((s, i) => (
            <rect key={`sh${i}`} className={`${styles.fade} ${styles.slabShadow}`} x={s[0] + 4} y={s[3]} width={s[2] - s[0] - 8} height={6} />
          ))}
          <path className={`${styles.fade} ${styles.glint}`} d={GLINTS} />

          {SLABS.map((s, i) => (
            <rect key={`s${i}`} className={`${styles.fade} ${styles.slab}`} x={s[0]} y={s[1]} width={s[2] - s[0]} height={s[3] - s[1]} />
          ))}
          <rect className={`${styles.fade} ${styles.slab}`} x={CHIMNEY[0]} y={CHIMNEY[1]} width={CHIMNEY[2] - CHIMNEY[0]} height={CHIMNEY[3] - CHIMNEY[1]} />

          <path className={`${styles.fade} ${styles.bush}`} d={bushes(260, 348, 330, 7) + bushes(560, 590, 330, 6) + bushes(14, 40, 330, 6)} />
          <circle className={`${styles.fade} ${styles.lamp}`} cx="260" cy="252" r="3" />
          <circle className={`${styles.fade} ${styles.lamp}`} cx="334" cy="252" r="3" />
        </g>

        {/* ---------- 1. Site ---------- */}
        <g className={`${styles.layer} ${styles.l1} ${on(0)}`}>
          <Stroke path={`M-40 ${GROUND}H650`} i={0} />
          <Stroke path="M-40 388Q120 374 300 388T650 388" i={1} />
          <Stroke path={TREE_L} i={2} />
          <Stroke path={TREE_R} i={3} />
          <Stroke path={TREE_BACK} i={4} />
          <Stroke path={DRIVE + WALK} i={5} />
          <Stroke path="M28 378H582M28 370V386M582 370V386" i={6} />
          <Stroke path="M620 40V84M620 40 612 58M620 40 628 58" i={7} />
          <path className={`${styles.fade} ${styles.dash}`} d="M-40 366H650" />
        </g>

        {/* ---------- 2. Blueprint ---------- */}
        <g className={`${styles.layer} ${styles.l2} ${on(1)}`}>
          <Stroke path={VOLUMES.map(rect).join('')} i={0} />
          <Stroke path={SLABS.map(rect).join('') + rect(CHIMNEY)} i={1} />
          <Stroke path={rect(GARAGE_DOOR) + GARAGE_PANELS} i={2} />
          <Stroke path={WIN_UPPER.map(rect).join('') + rect(DOOR) + rect(TRANSOM) + rect(SLOT)} i={3} />
          <Stroke path={rect(GLAZING) + WIN_WING.map(rect).join('') + MULLIONS} i={4} />
          <Stroke path={rect(WOOD_BAND) + rect(WOOD_SOFFIT)} i={5} />
          <Stroke path="M6 144V330M0 144H12M0 330H12" i={6} />
        </g>

        {/* ---------- 3. Framing ---------- */}
        <g className={`${styles.layer} ${styles.l3} ${on(2)} ${stage >= 3 ? styles.hide : ''}`}>
          <Stroke path={STUDS} i={0} />
          <Stroke path={HEADERS + GLASS.map((g) => rect(inflate(g, 3))).join('')} i={3} />
          <Stroke path={JOISTS} i={5} />
        </g>
      </g>
    </svg>
  );
}
