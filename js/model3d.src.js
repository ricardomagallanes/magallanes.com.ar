/**
 * MAGALLANES AERO - 3D INTERACTIVE ENGINE VIEWER
 * Real-time WebGL inspection of the TM-2600-R aeronautical engine.
 * Powered by Three.js with OrbitControls, PBR materials, and interactive HUD.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class EngineViewer3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.engineMesh = null;
    this.engineGroup = new THREE.Group();
    this.animId = null;
    this.isAutoRotating = true;
    this.defaultCamPos = new THREE.Vector3(1.2, 0.8, 1.4);

    this.material = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.88,
      roughness: 0.32,
      envMapIntensity: 1.0,
    });

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 520;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent canvas to show background styling

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    this.camera.position.copy(this.defaultCamPos);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 3.5;
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.target.set(0, 0, 0);

    // User interaction pauses auto-rotation temporarily
    this.controls.addEventListener('start', () => {
      this.userInteracting = true;
    });

    // Lighting Setup
    this.setupLighting();

    // Subtle Ground Grid
    this.setupGroundGrid();

    // Load Engine GLB
    this.loadModel('assets/modelos/TM-2600-R.glb');

    // UI Listeners
    this.setupUIControls();

    // Resize Handler
    window.addEventListener('resize', () => this.onResize());

    // Start loop
    this.animate();
  }

  setupLighting() {
    // Ambient soft fill
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.9);
    this.scene.add(ambient);

    // Main Key Light (Warm sunlight / studio key)
    const keyLight = new THREE.DirectionalLight(0xFFF7ED, 2.2);
    keyLight.position.set(3, 4, 3);
    this.scene.add(keyLight);

    // Secondary Fill Light (Cool sky / electric cyan)
    const fillLight = new THREE.DirectionalLight(0x38BDF8, 1.6);
    fillLight.position.set(-3, 2, -2);
    this.scene.add(fillLight);

    // Rim / Back Light (Aviation gold glow from behind)
    const rimLight = new THREE.DirectionalLight(0xF59E0B, 1.8);
    rimLight.position.set(0, -3, -3);
    this.scene.add(rimLight);

    // Top Down soft light
    const topLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    topLight.position.set(0, 5, 0);
    this.scene.add(topLight);
  }

  setupGroundGrid() {
    // Circular radial grid floor for aerospace tech feeling
    const gridHelper = new THREE.GridHelper(2.5, 24, 0x38BDF8, 0x1E293B);
    gridHelper.position.y = -0.38;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
  }

  loadModel(url) {
    const loader = new GLTFLoader();
    const loadingEl = document.getElementById('model-3d-loading');
    const progressEl = document.getElementById('model-3d-progress');

    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene;

        // Traverse and apply metallic aerospace material and compute normals
        root.traverse((child) => {
          if (child.isMesh) {
            child.material = this.material;
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
        });

        // Compute bounding box to scale to realistic viewport size (~0.85m extent)
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 0.85 / (maxDim || 1);

        root.scale.setScalar(targetScale);

        // Center at origin
        const centerBox = new THREE.Box3().setFromObject(root);
        const center = centerBox.getCenter(new THREE.Vector3());
        root.position.sub(center);

        // Adjust orientation: in CAD Z is up, rotate so top faces Y up
        root.rotation.x = -Math.PI / 2;

        this.engineMesh = root;
        this.engineGroup.add(root);
        this.scene.add(this.engineGroup);

        // Hide loading screen with fade
        if (loadingEl) {
          loadingEl.style.opacity = '0';
          setTimeout(() => {
            loadingEl.style.display = 'none';
          }, 400);
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && progressEl) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          progressEl.textContent = `${percent}%`;
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        if (loadingEl) {
          loadingEl.replaceChildren();
          const errSpan = document.createElement('span');
          errSpan.className = 'load-error';
          errSpan.textContent = 'Error al cargar modelo 3D';
          loadingEl.appendChild(errSpan);
        }
      }
    );
  }

  setupUIControls() {
    // Auto-rotate Toggle
    const autoRotateBtn = document.getElementById('btn-3d-rotate');
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        this.isAutoRotating = !this.isAutoRotating;
        this.controls.autoRotate = this.isAutoRotating;
        autoRotateBtn.classList.toggle('active', this.isAutoRotating);
      });
    }

    // Reset View Button
    const resetBtn = document.getElementById('btn-3d-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.camera.position.copy(this.defaultCamPos);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      });
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById('btn-3d-fullscreen');
    const viewerCard = document.getElementById('model-3d-card');
    if (fullscreenBtn && viewerCard) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          viewerCard.requestFullscreen().catch(err => {
            console.warn('Fullscreen request failed:', err);
          });
        } else {
          document.exitFullscreen();
        }
      });

      document.addEventListener('fullscreenchange', () => {
        const isFull = !!document.fullscreenElement;
        fullscreenBtn.classList.toggle('active', isFull);
        setTimeout(() => this.onResize(), 100);
      });
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-initialize reliably
function initViewer() {
  if (document.getElementById('engine-3d-canvas-container')) {
    new EngineViewer3D('engine-3d-canvas-container');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initViewer);
} else {
  initViewer();
}

export default EngineViewer3D;
