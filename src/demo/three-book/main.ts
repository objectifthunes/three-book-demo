/**
 * Demo entry — wires scene, UI panels, interaction and the render loop.
 *
 * Ported from the original Vite demo. The top-level side effects are wrapped in
 * `mountThreeBookDemo()` so the experience can be mounted inside a React route
 * and fully torn down on unmount. `scene`, `syncLights` and `interaction` stay
 * exported as live bindings because `./book` and `./left-panel` import them.
 */

import * as THREE from 'three';
import '@objectifthunes/three-book/demo.css';
import { Book } from '@objectifthunes/three-book';
import {
  createDemoScene,
  createDemoInteraction,
  createDemoPanel,
  clearImageSlot,
} from '@objectifthunes/three-book/demo-kit';
import { params, pageImageSlots, coverImageSlots } from './state';
import { buildBook, getBook, getOverlays, getCoverOverlays, getSpreads, onBookStatus } from './book';
import { buildBookTab } from './left-panel';
import { buildTexturesTab } from './right-panel';
import { buildEditorTab, tickEditor } from './editor';

// Live bindings consumed by ./book (scene) and ./left-panel (syncLights, interaction).
export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;
export let renderer: THREE.WebGLRenderer;
export let controls: { update: () => void; dispose: () => void };
export let interaction: { enabled: boolean } = { enabled: true };

let ds: ReturnType<typeof createDemoScene> | null = null;

export function syncLights(): void {
  ds?.syncLights(params);
}

/**
 * Mount the full three-book studio onto document.body and start rendering.
 * Returns a disposer that cancels the loop and removes everything it created.
 */
export function mountThreeBookDemo(): () => void {
  // Defensively tear down any previous instance (e.g. SPA back-and-forth).
  const prev = (window as unknown as { __threeBookDemoCleanup?: () => void }).__threeBookDemoCleanup;
  if (prev) prev();

  const prevOverflow = document.body.style.overflow;
  const prevBg = document.body.style.background;
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#1a1a2e';

  ds = createDemoScene();
  scene = ds.scene;
  camera = ds.camera as THREE.PerspectiveCamera;
  renderer = ds.renderer;
  controls = ds.controls;

  interaction = createDemoInteraction(camera, renderer.domElement, controls, params.interactive) as { enabled: boolean };

  const bookTabEl = document.createElement('div');
  const texturesTabEl = document.createElement('div');
  const editorTabEl = document.createElement('div');

  buildBookTab(bookTabEl);
  buildTexturesTab(texturesTabEl);
  buildEditorTab(editorTabEl);

  const panel = createDemoPanel({
    title: 'three-book demo',
    subtitle: 'Drag to turn · right-click + wheel to orbit',
    tabs: [
      { key: 'book', label: 'Book', content: bookTabEl },
      { key: 'textures', label: 'Textures', content: texturesTabEl },
      { key: 'editor', label: 'Editor', content: editorTabEl },
    ],
  });

  onBookStatus((msg) => panel.setStatus(msg));

  const infoEl = document.createElement('div');
  infoEl.className = 'demo-info';
  infoEl.style.cssText = 'position:fixed;bottom:10px;left:50%;transform:translateX(-50%);';
  infoEl.textContent = 'Click + drag pages to turn | Orbit: right-click / scroll';
  document.body.appendChild(infoEl);

  const clock = new THREE.Clock();
  let rafId = 0;
  let running = true;

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const dt = clock.getDelta();

    controls.update();

    const bookRoot = getBook();
    for (const overlay of getOverlays()) {
      if (overlay) overlay.update(bookRoot ?? undefined);
    }
    for (const overlay of getCoverOverlays()) {
      if (overlay) overlay.update(bookRoot ?? undefined);
    }
    for (const spread of getSpreads().values()) {
      spread.update(bookRoot ?? undefined);
    }

    for (const b of Book.instances) {
      b.update(dt);
    }

    tickEditor();
    renderer.render(scene, camera);
  }

  animate();

  // Initial build.
  syncLights();
  buildBook();

  const cleanup = () => {
    running = false;
    cancelAnimationFrame(rafId);
    for (const b of [...Book.instances]) {
      try { b.dispose(); } catch { /* noop */ }
    }
    for (const slot of pageImageSlots) clearImageSlot(slot);
    for (const slot of coverImageSlots) clearImageSlot(slot);
    infoEl.remove();
    panel.root.remove();
    panel.toggleBtn.remove();
    renderer.domElement.remove();
    try { controls.dispose(); } catch { /* noop */ }
    try { renderer.dispose(); } catch { /* noop */ }
    document.body.style.overflow = prevOverflow;
    document.body.style.background = prevBg;
    (window as unknown as { __threeBookDemoCleanup?: () => void }).__threeBookDemoCleanup = undefined;
    ds = null;
  };

  (window as unknown as { __threeBookDemoCleanup?: () => void }).__threeBookDemoCleanup = cleanup;
  return cleanup;
}
