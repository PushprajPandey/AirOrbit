'use client';

import { useEffect, useRef } from 'react';
import { AIRPORTS } from '@/lib/globe/airportCoordinates';
import { buildRouteArc } from '@/lib/globe/arcBuilder';
import { latLonToVector3 } from '@/lib/globe/greatCircle';
import { useGlobeStore } from '@/lib/stores/useGlobeStore';
import type { RouteFlight } from '@/lib/supabase/types';

const RADIUS = 1.6;
const EARTH_TEXTURE = '/textures/earth-day.jpg';

function clearContainer(el: HTMLElement) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef(useGlobeStore.getState());

  useEffect(() => useGlobeStore.subscribe((s) => { storeRef.current = s; }), []);

  const selectedOrigin = useGlobeStore((s) => s.selectedOrigin);
  const selectedDestination = useGlobeStore((s) => s.selectedDestination);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let alive = true;
    let disposeScene: (() => void) | undefined;

    const boot = async () => {
      clearContainer(container);

      const THREE = await import('three');
      const { OrbitControls } = await import(
        'three/examples/jsm/controls/OrbitControls.js'
      );
      const { CSS2DRenderer, CSS2DObject } = await import(
        'three/examples/jsm/renderers/CSS2DRenderer.js'
      );

      if (!alive) return;

      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 300);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.4, 4.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.style.display = 'block';

      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(width, height);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.inset = '0';
      labelRenderer.domElement.style.pointerEvents = 'none';
      container.appendChild(labelRenderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      const sun = new THREE.DirectionalLight(0xffffff, 1.1);
      sun.position.set(5, 3, 5);
      scene.add(ambient, sun);

      const textureLoader = new THREE.TextureLoader();
      const earthTexture = await new Promise<
        import('three').Texture
      >((resolve, reject) => {
        textureLoader.load(
          EARTH_TEXTURE,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          },
          undefined,
          reject
        );
      });

      if (!alive) {
        earthTexture.dispose();
        return;
      }

      const earth = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS, 64, 64),
        new THREE.MeshPhongMaterial({
          map: earthTexture,
          specular: new THREE.Color(0x333333),
          shininess: 8,
        })
      );
      scene.add(earth);

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 1.015, 64, 64),
        new THREE.MeshPhongMaterial({
          color: 0x0ea5e9,
          transparent: true,
          opacity: 0.08,
          side: THREE.FrontSide,
          depthWrite: false,
        })
      );
      scene.add(atmosphere);

      type LabelObj = InstanceType<typeof CSS2DObject>;
      const airportMeshes: import('three').Mesh[] = [];
      const ringMeshes: import('three').Mesh[] = [];
      const airportMap = new Map<import('three').Mesh, string>();
      const labelObjects: LabelObj[] = [];
      const markerWorldPos = new THREE.Vector3();
      const outwardNormal = new THREE.Vector3();
      const toCamera = new THREE.Vector3();

      AIRPORTS.forEach((airport) => {
        const pos = latLonToVector3(airport.lat, airport.lon, RADIUS + 0.03);
        const position = new THREE.Vector3(pos.x, pos.y, pos.z);

        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(airport.isBookable ? 0.028 : 0.014, 12, 12),
          new THREE.MeshBasicMaterial({
            color: airport.isBookable ? 0xffffff : 0x94a3b8,
          })
        );
        dot.position.copy(position);
        scene.add(dot);
        airportMeshes.push(dot);
        airportMap.set(dot, airport.code);

        if (airport.isBookable) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.032, 0.042, 32),
            new THREE.MeshBasicMaterial({
              color: 0x0ea5e9,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.9,
            })
          );
          ring.position.copy(position);
          ring.lookAt(0, 0, 0);
          scene.add(ring);
          ringMeshes.push(ring);

          const labelDiv = document.createElement('div');
          labelDiv.className =
            'rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-primary-container shadow-sm';
          labelDiv.textContent = airport.code;
          const label = new CSS2DObject(labelDiv);
          const outward = position.clone().normalize().multiplyScalar(1.12);
          label.position.copy(outward);
          scene.add(label);
          labelObjects.push(label);
        }
      });

      const isMarkerFacingCamera = (worldPosition: import('three').Vector3) => {
        outwardNormal.copy(worldPosition).normalize();
        toCamera.subVectors(camera.position, worldPosition).normalize();
        const facing = outwardNormal.dot(toCamera) > 0.45;
        if (!facing) return false;
        markerWorldPos.copy(worldPosition).project(camera);
        return (
          markerWorldPos.z > -1 &&
          markerWorldPos.z < 1 &&
          Math.abs(markerWorldPos.x) <= 1.05 &&
          Math.abs(markerWorldPos.y) <= 1.05
        );
      };

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.minDistance = 2.8;
      controls.maxDistance = 7;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;

      let idleTimer: ReturnType<typeof setTimeout> | null = null;
      const resumeRotate = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          controls.autoRotate = true;
        }, 5000);
      };

      renderer.domElement.addEventListener('pointerdown', () => {
        controls.autoRotate = false;
        resumeRotate();
      });

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(airportMeshes);
        if (hits.length === 0) return;
        const code = airportMap.get(hits[0]!.object as import('three').Mesh);
        const airport = AIRPORTS.find((a) => a.code === code);
        if (!airport?.isBookable) return;

        const s = storeRef.current;
        if (!s.selectedOrigin) {
          s.setOrigin(airport);
        } else if (!s.selectedDestination) {
          s.setDestination(airport);
        } else {
          s.clearSelection();
          s.setOrigin(airport);
        }
      };

      renderer.domElement.addEventListener('click', onClick);

      let arcTube: import('three').Mesh | null = null;
      let planeMesh: import('three').Mesh | null = null;
      let arcCurve: import('three').CatmullRomCurve3 | null = null;
      let arcT = 0;

      const clearArc = () => {
        if (arcTube) {
          scene.remove(arcTube);
          arcTube.geometry.dispose();
          (arcTube.material as import('three').Material).dispose();
          arcTube = null;
        }
        if (planeMesh) {
          scene.remove(planeMesh);
          planeMesh.geometry.dispose();
          (planeMesh.material as import('three').Material).dispose();
          planeMesh = null;
        }
        arcCurve = null;
        arcT = 0;
      };

      const buildArc = () => {
        clearArc();

        const o = storeRef.current.selectedOrigin;
        const d = storeRef.current.selectedDestination;
        if (!o || !d) return;

        const { tube, curve } = buildRouteArc(
          THREE,
          o.lat,
          o.lon,
          d.lat,
          d.lon,
          RADIUS
        );
        arcTube = tube;
        scene.add(tube);
        arcCurve = curve;
        planeMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x0ea5e9 })
        );
        scene.add(planeMesh);
      };

      buildArc();

      const unsub = useGlobeStore.subscribe((state, prev) => {
        if (
          state.selectedOrigin !== prev.selectedOrigin ||
          state.selectedDestination !== prev.selectedDestination
        ) {
          buildArc();
        }
        airportMeshes.forEach((mesh) => {
          const code = airportMap.get(mesh);
          const selected =
            code === state.selectedOrigin?.code ||
            code === state.selectedDestination?.code;
          const mat = mesh.material as import('three').MeshBasicMaterial;
          mat.color.setHex(selected ? 0x0ea5e9 : 0xffffff);
          mesh.scale.setScalar(selected ? 1.6 : 1);
        });
        ringMeshes.forEach((ring) => {
          const mat = ring.material as import('three').MeshBasicMaterial;
          mat.color.setHex(0x0ea5e9);
        });
      });

      let animationId = 0;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.update();

        labelObjects.forEach((label) => {
          label.getWorldPosition(markerWorldPos);
          const show = isMarkerFacingCamera(markerWorldPos);
          label.visible = show;
          label.element.style.display = show ? 'block' : 'none';
        });

        ringMeshes.forEach((ring) => {
          ring.getWorldPosition(markerWorldPos);
          ring.visible = isMarkerFacingCamera(markerWorldPos);
        });

        airportMeshes.forEach((mesh) => {
          mesh.getWorldPosition(markerWorldPos);
          mesh.visible = isMarkerFacingCamera(markerWorldPos);
        });

        if (planeMesh && arcCurve) {
          arcT += 0.004;
          if (arcT > 1) arcT = 0;
          planeMesh.position.copy(arcCurve.getPoint(arcT));
        }

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = container.clientWidth;
        const h = Math.max(container.clientHeight, 300);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        labelRenderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      disposeScene = () => {
        cancelAnimationFrame(animationId);
        unsub();
        if (idleTimer) clearTimeout(idleTimer);
        clearArc();
        window.removeEventListener('resize', onResize);
        renderer.domElement.removeEventListener('click', onClick);
        controls.dispose();
        earthTexture.dispose();
        earth.geometry.dispose();
        (earth.material as import('three').Material).dispose();
        atmosphere.geometry.dispose();
        (atmosphere.material as import('three').Material).dispose();
        airportMeshes.forEach((m) => {
          m.geometry.dispose();
          (m.material as import('three').Material).dispose();
        });
        renderer.dispose();
        clearContainer(container);
      };
    };

    void boot().then(() => {
      if (!alive) disposeScene?.();
    });

    return () => {
      alive = false;
      disposeScene?.();
    };
  }, []);

  useEffect(() => {
    if (!selectedOrigin || !selectedDestination) return;

    const { setLoadingRoutes, setRouteFlights } = useGlobeStore.getState();
    setLoadingRoutes(true);

    const params = new URLSearchParams({
      origin: selectedOrigin.code,
      destination: selectedDestination.code,
    });

    let cancelled = false;

    void fetch(`/api/routes?${params.toString()}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setRouteFlights([]);
          return;
        }
        const json = (await res.json()) as {
          success?: boolean;
          data?: RouteFlight[];
        };
        setRouteFlights(json.success ? (json.data ?? []) : []);
      })
      .catch(() => {
        if (!cancelled) setRouteFlights([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRoutes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedOrigin, selectedDestination]);

  return (
    <div
      ref={containerRef}
      className="relative h-[300px] w-full overflow-hidden rounded-xl border border-outline-variant bg-gradient-to-b from-sky-50 to-white md:h-full md:min-h-[480px]"
    />
  );
}
