/**
 * The smallest working three-book setup: a scene from the demo kit, a handful of
 * cream pages, a staple binding, and pointer-drag turning. Self-contained so it
 * shares no module state with the full editor demo.
 */

import * as THREE from 'three';
import '@objectifthunes/three-book/demo.css';
import { Book, BookContent, StapleBookBinding, createPageTexture } from '@objectifthunes/three-book';
import { createDemoScene, createDemoInteraction } from '@objectifthunes/three-book/demo-kit';

const PAGE_W = 2;
const PAGE_H = 3;
const PAGE_COUNT = 8;

export function mountMinimalBook(): () => void {
  const prev = (window as unknown as { __minimalBookCleanup?: () => void }).__minimalBookCleanup;
  if (prev) prev();

  const prevOverflow = document.body.style.overflow;
  const prevBg = document.body.style.background;
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#1a1a2e';

  const ds = createDemoScene();
  const { scene, camera, renderer, controls } = ds;
  createDemoInteraction(camera, renderer.domElement, controls, true);

  const textures: THREE.Texture[] = [];
  const track = (t: THREE.Texture) => { textures.push(t); return t; };

  const content = new BookContent();
  const coverLabels = ['Front', 'Inside front', 'Inside back', 'Back'];
  for (let i = 0; i < 4; i++) {
    content.covers.push(track(createPageTexture('#7b3f00', coverLabels[i], null, 'contain', false, PAGE_W, PAGE_H)));
  }
  for (let i = 0; i < PAGE_COUNT; i++) {
    content.pages.push(track(createPageTexture('#f5efe0', `Page ${i + 1}`, null, 'contain', false, PAGE_W, PAGE_H)));
  }

  const book = new Book({
    content,
    binding: new StapleBookBinding(),
    initialOpenProgress: 0.5,
    castShadows: true,
    pagePaperSetup: { width: PAGE_W, height: PAGE_H, thickness: 0.02, stiffness: 0.2, color: new THREE.Color(1, 1, 1), material: null },
    coverPaperSetup: { width: PAGE_W + 0.1, height: PAGE_H + 0.1, thickness: 0.04, stiffness: 0.5, color: new THREE.Color(1, 1, 1), material: null },
  });
  book.init();
  scene.add(book);

  const clock = new THREE.Clock();
  let rafId = 0;
  let running = true;
  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const dt = clock.getDelta();
    controls.update();
    for (const b of Book.instances) b.update(dt);
    renderer.render(scene, camera);
  }
  animate();

  const cleanup = () => {
    running = false;
    cancelAnimationFrame(rafId);
    try { book.dispose(); } catch { /* noop */ }
    scene.remove(book);
    for (const t of textures) t.dispose();
    renderer.domElement.remove();
    try { controls.dispose(); } catch { /* noop */ }
    try { renderer.dispose(); } catch { /* noop */ }
    document.body.style.overflow = prevOverflow;
    document.body.style.background = prevBg;
    (window as unknown as { __minimalBookCleanup?: () => void }).__minimalBookCleanup = undefined;
  };

  (window as unknown as { __minimalBookCleanup?: () => void }).__minimalBookCleanup = cleanup;
  return cleanup;
}
