/**
 * Build-stage film for the home Process panel. One Clyde Hill-style home, one fixed camera,
 * generated on Higgsfield (Nov 2026). Each clip ends on the frame the next one starts from,
 * so they play back to back as a single time-lapse. Videos always play muted.
 *
 * Served from public/assets/process/ (compressed, no audio) by scripts/fetch-process-film.sh,
 * which the "Process film media" workflow runs. Set PROCESS_FILM_BASE = CDN to stream the originals.
 */

export const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ali3yWAoxKodgQjg4TuTFW28bm';
export const PROCESS_FILM_BASE: string = '';

const local = (name: string) => `${import.meta.env.BASE_URL}assets/process/${name}`;
const src = (cdnFile: string, localName: string) => (PROCESS_FILM_BASE ? `${PROCESS_FILM_BASE}/${cdnFile}` : local(localName));

export const STILLS = {
  lot: src('hf_20261117_182024_49359b4c-e66a-42a2-8f63-94afecaa7636.png', '01-lot.webp'),
  blueprint: src('hf_20261117_182025_53c48fca-798d-4a1f-b1d4-81d0aebff6b2.png', '02-blueprint.webp'),
  excavation: src('hf_20261117_182025_600763d9-a678-4e35-96b6-3c7240d290ef.png', '03-excavation.webp'),
  foundation: src('hf_20261117_182025_e044d460-50eb-4729-9933-e82b741a4886.png', '04-foundation.webp'),
  framing: src('hf_20261117_182024_4e946355-1634-4450-b864-5304460d4344.png', '05-framing.webp'),
  roughIn: src('hf_20261117_182024_ea5a120b-60b7-4209-b8ce-e8ab661bb3a9.png', '06-rough-in.webp'),
  finished: src('hf_20261117_180906_6d9ca3ac-d8d0-4fca-9e4b-a5085137501b.png', '07-finished.webp'),
  twilight: src('hf_20261117_182025_3d2e69d2-6ae8-447e-980f-93e1133abaff.png', '08-twilight.webp'),
} as const;

export interface FilmShot {
  /** Video clip; omit to hold the poster as a still. */
  video?: string;
  /** First frame of the clip (also the poster). */
  poster: string;
  /** Last frame, shown when the shot is held or motion is reduced. */
  end: string;
  /** Step on the site this shot illustrates, e.g. "Step 09". */
  step: string;
  label: string;
  /** Duration in ms (clips are 5 s; stills hold for this long). */
  ms: number;
}

/** One list of shots per phase, in PROCESS_PHASES order. */
export const PROCESS_FILM: FilmShot[][] = [
  [
    { poster: STILLS.lot, end: STILLS.lot, step: 'Step 03', label: 'Property evaluation', ms: 5400 },
  ],
  [
    { video: src('hf_20261117_182152_a9e1d931-1aab-49ba-b2fc-c31e1f4ac0e8.mp4', 'a-blueprint.mp4'), poster: STILLS.lot, end: STILLS.blueprint, step: 'Steps 04–07', label: 'Design & drawings', ms: 5000 },
  ],
  [
    { video: src('hf_20261117_182737_52de5d83-a8dc-4c03-9699-41e3f65839f2.mp4', 'b-excavation.mp4'), poster: STILLS.blueprint, end: STILLS.excavation, step: 'Step 08', label: 'Excavation & site prep', ms: 5000 },
    { video: src('hf_20261117_182152_8ddbaeb8-ad0d-4b48-a105-ebe04678464b.mp4', 'c-foundation.mp4'), poster: STILLS.excavation, end: STILLS.foundation, step: 'Step 09', label: 'Foundations', ms: 5000 },
    { video: src('hf_20261117_182738_1ae9d980-d6dd-4a05-a82a-2142e032af1d.mp4', 'd-framing.mp4'), poster: STILLS.foundation, end: STILLS.framing, step: 'Step 09', label: 'Framing', ms: 5000 },
    { video: src('hf_20261117_182152_4377bc84-13bc-41f8-a437-c1931ee58205.mp4', 'e-rough-in.mp4'), poster: STILLS.framing, end: STILLS.roughIn, step: 'Step 09', label: 'Plumbing & electrical', ms: 5000 },
    { video: src('hf_20261117_182151_1c3749ef-3373-4dfc-9cba-833186913191.mp4', 'f-finish.mp4'), poster: STILLS.roughIn, end: STILLS.finished, step: 'Step 10', label: 'Finishes & final review', ms: 5000 },
  ],
  [
    { video: src('hf_20261117_182738_208496fd-8f68-4a27-ad1e-3cbee479ba29.mp4', 'g-twilight.mp4'), poster: STILLS.finished, end: STILLS.twilight, step: 'Steps 11–12', label: 'Move-in & beyond', ms: 5000 },
  ],
];

export const phaseFilmMs = (phase: number) => PROCESS_FILM[phase].reduce((t, s) => t + s.ms, 0);
