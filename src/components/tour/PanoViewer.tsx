import { useCallback, useEffect, useRef, useState } from 'react';
import type { TourScene } from '../../data/tours';
import s from './tour.module.css';

/**
 * Minimal equirectangular panorama viewer. Plain WebGL, no dependencies (~3 KB gzipped),
 * so the tour adds nothing to page weight until a visitor opens it.
 */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D tex;
uniform float yaw, pitch, tanHalf, aspect;
const float PI = 3.14159265359;
void main(){
  vec3 d = normalize(vec3(v.x * tanHalf * aspect, v.y * tanHalf, -1.0));
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  gl_FragColor = texture2D(tex, vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - lat / PI));
}`;

const DEG = Math.PI / 180;
const MIN_FOV = 40;
const MAX_FOV = 100;
const MAX_PITCH = 45;

interface View {
  yaw: number;
  pitch: number;
  fov: number;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

/** Project a yaw/pitch direction onto the canvas; returns null when behind the camera. */
function project(view: View, yawDeg: number, pitchDeg: number, w: number, h: number) {
  const yaw = (yawDeg - view.yaw) * DEG;
  const pitch = pitchDeg * DEG;
  // direction relative to the camera's yaw, then undo the camera pitch
  const x = Math.sin(yaw) * Math.cos(pitch);
  let y = Math.sin(pitch);
  let z = -Math.cos(yaw) * Math.cos(pitch);
  const cp = Math.cos(view.pitch * DEG);
  const sp = Math.sin(view.pitch * DEG);
  const y2 = y * cp + z * sp;
  const z2 = -y * sp + z * cp;
  y = y2;
  z = z2;
  if (z >= -0.05) return null;
  const tanHalf = Math.tan((view.fov * DEG) / 2);
  const aspect = w / h;
  const nx = x / -z / (tanHalf * aspect);
  const ny = y / -z / tanHalf;
  if (Math.abs(nx) > 1.1 || Math.abs(ny) > 1.1) return null;
  return { left: ((nx + 1) / 2) * w, top: ((1 - ny) / 2) * h };
}

interface Props {
  scene: TourScene;
  onNavigate: (sceneId: string) => void;
}

export function PanoViewer({ scene, onNavigate }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram; tex: WebGLTexture } | null>(null);
  const view = useRef<View>({
    yaw: scene.initialYaw ?? 0,
    pitch: 0,
    fov: typeof window !== 'undefined' && window.innerWidth < window.innerHeight ? 95 : 75,
  });
  const hasTexture = useRef(false);
  const interacted = useRef(false);
  const hasHotspots = useRef(false);
  hasHotspots.current = Boolean(scene.hotspots?.length);
  const frame = useRef(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [, setTick] = useState(0);

  const draw = useCallback(() => {
    const ctx = glRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !hasTexture.current) return;
    const { gl, prog } = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    const v = view.current;
    gl.uniform1f(gl.getUniformLocation(prog, 'yaw'), v.yaw * DEG);
    gl.uniform1f(gl.getUniformLocation(prog, 'pitch'), v.pitch * DEG);
    gl.uniform1f(gl.getUniformLocation(prog, 'tanHalf'), Math.tan((v.fov * DEG) / 2));
    gl.uniform1f(gl.getUniformLocation(prog, 'aspect'), w / h);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Re-render only when there are hotspots to reposition.
    if (hasHotspots.current) setTick((t) => (t + 1) % 1e6);
  }, []);

  const requestDraw = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(draw);
  }, [draw]);

  // GL setup once
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    glRef.current = { gl, prog, tex };
    const ro = new ResizeObserver(() => requestDraw());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      glRef.current = null;
    };
  }, [requestDraw]);

  // Load the scene texture (preview first, then full resolution)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    view.current = { yaw: scene.initialYaw ?? 0, pitch: 0, fov: view.current.fov };
    const upload = (img: HTMLImageElement) => {
      const ctx = glRef.current;
      if (!ctx || cancelled) return;
      ctx.gl.bindTexture(ctx.gl.TEXTURE_2D, ctx.tex);
      ctx.gl.texImage2D(ctx.gl.TEXTURE_2D, 0, ctx.gl.RGB, ctx.gl.RGB, ctx.gl.UNSIGNED_BYTE, img);
      hasTexture.current = true;
      requestDraw();
    };
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    (async () => {
      try {
        if (scene.preview) upload(await load(scene.preview));
        upload(await load(scene.src));
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the panorama changes
  }, [scene.src, scene.preview, requestDraw]);

  // Gentle idle drift until the visitor takes control
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = t - last;
      last = t;
      if (!interacted.current && hasTexture.current) {
        view.current.yaw += dt * 0.004;
        draw();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Pointer, wheel and keyboard controls
  useEffect(() => {
    const el = wrapRef.current!;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDist = 0;
    const clamp = () => {
      const v = view.current;
      v.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, v.fov));
      const maxPitch = Math.max(0, MAX_PITCH - v.fov / 4);
      v.pitch = Math.max(-maxPitch, Math.min(maxPitch, v.pitch));
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      interacted.current = true;
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const v = view.current;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist) v.fov *= pinchDist / d;
        pinchDist = d;
      } else {
        const degPerPx = v.fov / el.clientHeight;
        v.yaw -= (e.clientX - prev.x) * degPerPx;
        v.pitch += (e.clientY - prev.y) * degPerPx;
      }
      clamp();
      requestDraw();
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinchDist = 0;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      interacted.current = true;
      view.current.fov += e.deltaY * 0.05;
      clamp();
      requestDraw();
    };
    const onKey = (e: KeyboardEvent) => {
      const v = view.current;
      const map: Record<string, () => void> = {
        ArrowLeft: () => (v.yaw -= 5),
        ArrowRight: () => (v.yaw += 5),
        ArrowUp: () => (v.pitch += 4),
        ArrowDown: () => (v.pitch -= 4),
        '+': () => (v.fov -= 5),
        '=': () => (v.fov -= 5),
        '-': () => (v.fov += 5),
      };
      const fn = map[e.key];
      if (!fn) return;
      e.preventDefault();
      interacted.current = true;
      fn();
      clamp();
      requestDraw();
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('keydown', onKey);
    };
  }, [requestDraw]);

  const canvas = canvasRef.current;
  const w = canvas?.clientWidth ?? 0;
  const h = canvas?.clientHeight ?? 0;

  return (
    <div
      ref={wrapRef}
      className={s.viewer}
      tabIndex={0}
      role="application"
      aria-label={`360° view of the ${scene.label.toLowerCase()}. Drag or use the arrow keys to look around.`}
    >
      <canvas ref={canvasRef} className={s.canvas} />
      {w > 0 &&
        scene.hotspots?.map((hs) => {
          const pos = project(view.current, hs.yaw, hs.pitch ?? -10, w, h);
          if (!pos) return null;
          return (
            <button
              key={hs.to}
              type="button"
              className={s.hotspot}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => onNavigate(hs.to)}
            >
              <span className={s.hotspotDot} aria-hidden />
              <span className={s.hotspotLabel}>{hs.label}</span>
            </button>
          );
        })}
      {loading && !failed && <div className={s.status}>Loading view…</div>}
      {failed && <div className={s.status}>This view could not be loaded on this device.</div>}
    </div>
  );
}
