import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { replayProgress?: number; activeZone?: string | null };

export function WarehouseTwin3D({ replayProgress = 1, activeZone }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ replay: number; zone: string | null }>({
    replay: replayProgress,
    zone: activeZone ?? null,
  });

  useEffect(() => {
    stateRef.current.replay = replayProgress;
    stateRef.current.zone = activeZone ?? null;
  }, [replayProgress, activeZone]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(18, 16, 22);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(15, 30, 15);
    scene.add(dir);
    const skyLight = new THREE.PointLight(0x0ea5e9, 3.5, 100);
    skyLight.position.set(0, 20, 0);
    scene.add(skyLight);

    // Floor grid
    const grid = new THREE.GridHelper(60, 60, 0x0ea5e9, 0x0ea5e9);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    scene.add(grid);

    // Floor plate - PURE BLACK
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        roughness: 0.05,
        metalness: 0.8
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Warehouse zones (racks)
    const zones: { name: string; mesh: THREE.Mesh; baseColor: number }[] = [];
    const rackMat = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.85,
      });

    const zoneDefs = [
      { name: "A", x: -10, z: -8, w: 6, h: 4, d: 3, c: 0x38bdf8 },
      { name: "B", x: -2, z: -8, w: 6, h: 5, d: 3, c: 0x0ea5e9 },
      { name: "C", x: 6, z: -8, w: 6, h: 3, d: 3, c: 0x7dd3fc },
      { name: "D", x: -10, z: 0, w: 6, h: 4, d: 3, c: 0x0284c7 },
      { name: "E", x: -2, z: 0, w: 6, h: 6, d: 3, c: 0x38bdf8 },
      { name: "F", x: 6, z: 0, w: 6, h: 3.5, d: 3, c: 0x0ea5e9 },
      { name: "DOCK", x: 0, z: 9, w: 18, h: 1.2, d: 3, c: 0x60a5fa },
    ];
    zoneDefs.forEach((z) => {
      const geom = new THREE.BoxGeometry(z.w, z.h, z.d);
      const m = new THREE.Mesh(geom, rackMat(z.c));
      m.position.set(z.x, z.h / 2, z.z);
      scene.add(m);
      zones.push({ name: z.name, mesh: m, baseColor: z.c });

      // wireframe accent
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x0c4a6e, transparent: true, opacity: 0.6 }),
      );
      edges.position.copy(m.position);
      scene.add(edges);
    });

    // Particle flows (AGVs / packets)
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const paths = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      paths[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.005 + Math.random() * 0.012;
      positions[i * 3] = Math.cos(paths[i]) * 14;
      positions[i * 3 + 1] = 0.3 + Math.random() * 0.5;
      positions[i * 3 + 2] = Math.sin(paths[i]) * 10;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0ea5e9,
      size: 0.35,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeom, pMat);
    scene.add(points);

    // Roof beams
    for (let i = -15; i <= 15; i += 5) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.4 }),
      );
      beam.position.set(0, 9, i);
      scene.add(beam);
    }

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;

      // camera movement based on zone
      const active = stateRef.current.zone;
      const targetPos = new THREE.Vector3(0, 2.5, 0);
      let camDist = 26;
      let camHeight = 14;

      if (active) {
        const zDef = zoneDefs.find((d) => d.name === active);
        if (zDef) {
          targetPos.set(zDef.x, 2, zDef.z);
          camDist = active === "DOCK" ? 18 : 12;
          camHeight = 8;
        }
      }

      const t = frame * 0.0015;
      const desiredX = targetPos.x + Math.cos(t) * camDist;
      const desiredZ = targetPos.z + Math.sin(t) * camDist;
      const desiredY = camHeight + Math.sin(t * 2) * 1.5;

      camera.position.x += (desiredX - camera.position.x) * 0.05;
      camera.position.y += (desiredY - camera.position.y) * 0.05;
      camera.position.z += (desiredZ - camera.position.z) * 0.05;
      camera.lookAt(targetPos);

      // particles flow
      const pos = pGeom.attributes.position.array as Float32Array;
      const replay = stateRef.current.replay;
      for (let i = 0; i < particleCount; i++) {
        paths[i] += speeds[i] * (0.3 + replay * 1.4);
        pos[i * 3] = Math.cos(paths[i]) * (10 + Math.sin(paths[i] * 3) * 4);
        pos[i * 3 + 2] = Math.sin(paths[i]) * (8 + Math.cos(paths[i] * 2) * 3);
        pos[i * 3 + 1] = 0.3 + Math.abs(Math.sin(paths[i] * 4)) * 1.2;
      }
      pGeom.attributes.position.needsUpdate = true;

      // active zone pulse
      zones.forEach((z) => {
        const mat = z.mesh.material as THREE.MeshStandardMaterial;
        const target =
          active && z.name === active ? 0.85 : 0.25 + Math.sin(frame * 0.03 + z.mesh.position.x) * 0.08;
        mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.1;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      pGeom.dispose();
      pMat.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
