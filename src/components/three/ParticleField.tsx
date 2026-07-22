import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 3000;
const CONNECTION_DIST = 140;
const FIELD_RADIUS = 600;
const MOUSE_INFLUENCE = 0.0004;

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = FIELD_RADIUS * 0.8;

    // Particles
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const col_arr = new Float32Array(PARTICLE_COUNT * 3);

    const palette = [
      new THREE.Color('#c96442'), new THREE.Color('#d97757'),
      new THREE.Color('#4fc3f7'), new THREE.Color('#faf9f5'),
      new THREE.Color('#e6997a'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = FIELD_RADIUS * Math.cbrt(Math.random());
      const i3 = i * 3;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      vel[i3] = (Math.random() - 0.5) * 0.15;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.15;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.15;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col_arr[i3] = c.r;
      col_arr[i3 + 1] = c.g;
      col_arr[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(col_arr, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connection lines (pre-allocate)
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(PARTICLE_COUNT * 6); // max pairs
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Mouse
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = [x, y];
    };
    window.addEventListener('mousemove', onMove);

    // Resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Shooting stars
    type Star = { active: boolean; t: number; start: THREE.Vector3; end: THREE.Vector3; color: THREE.Color };
    const shootingStars: Star[] = [];
    let starTimer = 0;

    function spawnStar() {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = FIELD_RADIUS * 1.5;
      const start = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const end = start.clone().multiplyScalar(-0.3);
      shootingStars.push({
        active: true,
        t: 0,
        start,
        end,
        color: new THREE.Color(Math.random() > 0.5 ? '#c96442' : '#4fc3f7'),
      });
    }

    // Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const [mx, my] = mouseRef.current;

      // Update positions
      const positions = points.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] += vel[i3] * dt;
        positions[i3 + 1] += vel[i3 + 1] * dt;
        positions[i3 + 2] += vel[i3 + 2] * dt;

        // Mouse influence
        positions[i3] += mx * MOUSE_INFLUENCE;
        positions[i3 + 1] += my * MOUSE_INFLUENCE;

        // Boundary wrap
        const x = positions[i3], y = positions[i3 + 1], z = positions[i3 + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist > FIELD_RADIUS) {
          positions[i3] = (x / dist) * FIELD_RADIUS * 0.9;
          positions[i3 + 1] = (y / dist) * FIELD_RADIUS * 0.9;
          positions[i3 + 2] = (z / dist) * FIELD_RADIUS * 0.9;
          // Random velocity
          vel[i3] = (Math.random() - 0.5) * 0.15;
          vel[i3 + 1] = (Math.random() - 0.5) * 0.15;
          vel[i3 + 2] = (Math.random() - 0.5) * 0.15;
        }
      }
      points.geometry.attributes.position.needsUpdate = true;

      // Connection lines
      const linePosArr = lines.geometry.attributes.position.array as Float32Array;
      let lineCount = 0;
      const maxLines = Math.min(PARTICLE_COUNT, 800);

      for (let i = 0; i < PARTICLE_COUNT && lineCount < maxLines; i += 2) {
        const i3 = i * 3;
        const j3 = ((i + 1) % PARTICLE_COUNT) * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECTION_DIST) {
          const li = lineCount * 6;
          linePosArr[li] = positions[i3];
          linePosArr[li + 1] = positions[i3 + 1];
          linePosArr[li + 2] = positions[i3 + 2];
          linePosArr[li + 3] = positions[j3];
          linePosArr[li + 4] = positions[j3 + 1];
          linePosArr[li + 5] = positions[j3 + 2];
          lineCount++;
        }
      }

      lines.geometry.setDrawRange(0, lineCount * 2);
      lines.geometry.attributes.position.needsUpdate = true;
      lines.material.opacity = 0.08 + 0.06 * Math.sin(time * 0.15);

      // Shooting stars
      starTimer += dt;
      if (starTimer > 2 + Math.random() * 4) {
        starTimer = 0;
        spawnStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.t += dt * 0.6;
        if (s.t >= 1) {
          shootingStars.splice(i, 1);
          continue;
        }
        // Draw as a temporary line
        // const p = s.start.clone().lerp(s.end, s.t);
        // We'd need a separate line for each - skip for performance
      }

      // Slow rotation
      points.rotation.y += dt * 0.02;
      lines.rotation.y = points.rotation.y;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
