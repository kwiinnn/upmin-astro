// The real night sky: NASA's Deep Star Maps 2020 (NASA/Goddard Scientific
// Visualization Studio, public domain; https://svs.gsfc.nasa.gov/4851), built
// from the Gaia, Hipparcos and Tycho star catalogues. public/sky-*.webp combine
// its star map with its Milky Way layer (see README). It is an equirectangular
// map in J2000 equatorial coordinates, re-projected per pixel on the GPU.

/** Unit vectors of the view, in J2000 equatorial coordinates. */
export type SkyView = { east: number[]; north: number[]; forward: number[]; scale: number };

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tex;
uniform vec2 size;
uniform float dpr, scale, gain;
uniform vec3 east, north, forward;
const float PI = 3.14159265;
// A light violet grade over the photo: a little less green, a little more blue.
const vec3 TINT = vec3(1.04, 0.9, 1.16);
void main() {
  // Inverse of StarField's stereographic view (east is left, north up).
  vec2 q = (gl_FragCoord.xy / dpr - size * 0.5) / scale;
  q.x = -q.x;
  float r2 = dot(q, q);
  vec3 s = (4.0 * q.x * east + 4.0 * q.y * north + (4.0 - r2) * forward) / (4.0 + r2);
  // RA 0h is the middle column and increases to the left, as on the sky.
  vec2 uv = vec2(0.5 - atan(s.y, s.x) / (2.0 * PI), 0.5 - asin(clamp(s.z, -1.0, 1.0)) / PI);
  gl_FragColor = vec4(texture2D(tex, uv).rgb * TINT * gain, 1.0);
}`;

type Sky = NonNullable<ReturnType<typeof build>>;

// One sky per canvas. A canvas has a single WebGL context, so a second setup
// on it (React runs effects twice in development) would bind a second program
// to the same context and the two would trample each other's uniforms.
const skies = new WeakMap<HTMLCanvasElement, Sky>();

export function createSky(canvas: HTMLCanvasElement, opts: { phone: boolean; gain: number }) {
  let sky = skies.get(canvas);
  if (!sky) {
    const built = build(canvas, opts.phone);
    if (!built) return null;
    skies.set(canvas, (sky = built));
  }
  sky.gain = opts.gain;
  return sky;
}

function build(canvas: HTMLCanvasElement, phone: boolean) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) return null;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // One triangle that covers the screen.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    size: u("size"),
    dpr: u("dpr"),
    scale: u("scale"),
    gain: u("gain"),
    east: u("east"),
    north: u("north"),
    forward: u("forward"),
  };

  let ready = false;
  let lost = false;
  let dpr = 1;
  canvas.addEventListener("webglcontextlost", () => (lost = true));

  // 8k (2.3 MB) for large screens, 4k (620 KB) for phones and weaker GPUs.
  // Stars are a texel or two wide, so the big screens need the 8k map.
  const big = !phone && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 8192;
  const img = new Image();
  img.decoding = "async";
  img.src = big ? "/sky-8192.webp" : "/sky-4096.webp";
  const loaded = img.decode().then(() => {
    if (lost) return;
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    // Power-of-two size, so REPEAT works; no mipmaps, so no seam where
    // right ascension wraps around.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    ready = true;
  });

  return {
    loaded,
    gain: 1,
    resize(w: number, h: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.size, w, h);
      gl.uniform1f(U.dpr, dpr);
    },
    render(v: SkyView) {
      if (!ready || lost) return;
      gl.useProgram(prog);
      gl.uniform1f(U.gain, this.gain);
      gl.uniform1f(U.scale, v.scale);
      gl.uniform3fv(U.east, v.east);
      gl.uniform3fv(U.north, v.north);
      gl.uniform3fv(U.forward, v.forward);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
