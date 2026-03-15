import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  getmodels,
  getCarTrims,
  getCarBody,
  getCarStrip,
  getTypes,
  getColors,
  BASE_URL,
} from "./api.js";

// --- SHOWROOM CLASS ---
class Showroom {
  constructor() {
    this.ROOM_SIZE = 40;
    this.ROOM_HEIGHT = 12;
    this.CAM_HEIGHT = 1.7;
    this.WALL_PADDING = 2;
    this.CAR_PADDING = 1.5;
    this.BOUNDARY = this.ROOM_SIZE / 2 - this.WALL_PADDING;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    this.scene.fog = new THREE.Fog(0x111111, 30, 90);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, this.CAM_HEIGHT, 15);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.cars = [];

    this.setupLights();
    this.setupEnvironment();
    this.bindResize();
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const spot = new THREE.SpotLight(0xffffff, 80);
    spot.position.set(0, 14, 0);
    spot.angle = Math.PI / 4;
    spot.penumbra = 0.5;
    spot.decay = 1.5;
    spot.distance = 60;
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.bias = -0.0001;
    this.scene.add(spot);

    // Ceiling industrial lights positions
    const positions = [
      [-15, -15],
      [15, -15],
      [-15, 15],
      [15, 15],
    ];

    positions.forEach(([x, z]) => {
      // --- Attach PointLight to lamp ---
      const light = new THREE.PointLight(0xffffff, 40, 45);
      light.position.set(x, this.ROOM_HEIGHT - 2, z);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      this.scene.add(light);
    });
  }

  setupEnvironment() {
    const loader = new THREE.TextureLoader();
    const loadTex = (url, repeatX, repeatY) => {
      const tex = loader.load(url);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      return tex;
    };

    const floorMat = new THREE.MeshStandardMaterial({
      map: loadTex("/assets/images/floor.png", 10, 10),
      roughness: 0.8,
      metalness: 0,
      color: 0x888888,
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      map: loadTex("/assets/images/ceiling.png", 10, 10),
      roughness: 0.9,
      color: 0x555555,
      side: THREE.DoubleSide,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      map: loadTex("/assets/images/floor_real.png", 8, 2),
      roughness: 0.5,
      color: 0xeeeeee,
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(this.ROOM_SIZE, this.ROOM_SIZE),
      floorMat,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(this.ROOM_SIZE, this.ROOM_SIZE),
      ceilingMat,
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = this.ROOM_HEIGHT;
    this.scene.add(ceiling);

    const walls = new THREE.Group();
    const wallGeoSide = new THREE.BoxGeometry(
      0.2,
      this.ROOM_HEIGHT,
      this.ROOM_SIZE,
    );
    const wallGeoBack = new THREE.BoxGeometry(
      this.ROOM_SIZE,
      this.ROOM_HEIGHT,
      0.2,
    );

    const positions = [
      [-this.ROOM_SIZE / 2, 0, 0, wallGeoSide],
      [this.ROOM_SIZE / 2, 0, 0, wallGeoSide],
      [0, 0, -this.ROOM_SIZE / 2, wallGeoBack],
      [0, 0, this.ROOM_SIZE / 2, wallGeoBack],
    ];

    positions.forEach(([x, y, z, geo]) => {
      const w = new THREE.Mesh(geo, wallMat);
      w.position.set(x, this.ROOM_HEIGHT / 2, z);
      w.castShadow = true;
      w.receiveShadow = true;
      walls.add(w);
    });

    this.scene.add(walls);
  }

  addCar(car) {
    this.cars.push(car);
    this.scene.add(car.model);
  }

  bindResize() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// --- CAR CLASS ---
class Car {
  constructor(modelPath, scale = 1, modelName = "") {
    this.modelPath = modelPath;
    this.scale = scale;
    this.model = new THREE.Group();
    this.boundingBox = new THREE.Box3();
    this.mixer = null;
    this.modelName = modelName;
    this.isLoaded = false;
  }

  async load(modelData) {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync(this.modelPath);
      this.model = gltf.scene;

      this.model.scale.set(this.scale, this.scale, this.scale);

      if (modelData) {
        this.model.rotation.set(
          THREE.MathUtils.degToRad(modelData.rot_x || 0),
          THREE.MathUtils.degToRad(modelData.rot_y || 0),
          THREE.MathUtils.degToRad(modelData.rot_z || 0),
        );
      }

      this.model.updateMatrixWorld(true);
      const bbox = new THREE.Box3().setFromObject(this.model);
      const center = bbox.getCenter(new THREE.Vector3());
      this.model.position.sub(center);
      this.model.updateMatrixWorld(true);
      const finalBBox = new THREE.Box3().setFromObject(this.model);
      this.model.position.y -= finalBBox.min.y + 0.1;

      this.model.traverse((node) => {
        if (node.isMesh) {
          console.log("Loaded Mesh:", node.name);
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      if (gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.model);
        gltf.animations.forEach((clip) => this.mixer.clipAction(clip).play());
      }

      this.boundingBox.setFromObject(this.model).expandByScalar(0.5); // smaller padding
      this.isLoaded = true;
    } catch (err) {
      console.error("Failed to load car:", err);
      const placeholder = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2 }),
      );
      placeholder.position.y = 0.5;
      placeholder.castShadow = true;
      placeholder.receiveShadow = true;
      this.model.add(placeholder);
      this.boundingBox.setFromObject(placeholder);
      this.isLoaded = true;
    }
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta);
  }
}

// --- CONTROLS MANAGER ---
class ControlsManager {
  constructor(camera, car, showroom) {
    this.camera = camera;
    this.car = car;
    this.showroom = showroom;
    this.controls = new PointerLockControls(camera, document.body);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this.bindEvents();
  }

  bindEvents() {
    const overlay = document.getElementById("overlay");
    const canvas = this.showroom.renderer.domElement;
    canvas.addEventListener("click", () => {
      if (!this.controls.isLocked) this.controls.lock();
    });

    this.controls.addEventListener("lock", () => {
      if (overlay) {
        overlay.style.opacity = 0;
        setTimeout(() => (overlay.style.display = "none"), 300);
      }
    });

    this.controls.addEventListener("unlock", () => {
      if (overlay) {
        overlay.style.display = "flex";
        setTimeout(() => (overlay.style.opacity = "1"), 10);
      }
    });

    this.controls.addEventListener("lock", () => {
      document.getElementById("configurator").style.display = "none";
    });

    this.controls.addEventListener("unlock", () => {
      document.getElementById("configurator").style.display = "block";
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "KeyC") {
        // example key to toggle configurator
        if (this.controls.isLocked) {
          this.controls.unlock();
        } else {
          this.controls.lock();
        }
      }
    });

    document.addEventListener("keydown", (e) => this.onKey(e, true));
    document.addEventListener("keyup", (e) => this.onKey(e, false));
  }

  onKey(event, isDown) {
    switch (event.code) {
      case "KeyW":
        this.moveState.forward = isDown;
        break;
      case "KeyS":
        this.moveState.backward = isDown;
        break;
      case "KeyA":
        this.moveState.left = isDown;
        break;
      case "KeyD":
        this.moveState.right = isDown;
        break;
    }
  }

  update(delta) {
    if (!this.controls.isLocked) return;

    const timeStep = delta;
    this.velocity.x -= this.velocity.x * 10.0 * timeStep;
    this.velocity.z -= this.velocity.z * 10.0 * timeStep;

    this.direction.z =
      Number(this.moveState.forward) - Number(this.moveState.backward);
    this.direction.x =
      Number(this.moveState.right) - Number(this.moveState.left);
    this.direction.normalize();

    if (this.moveState.forward || this.moveState.backward)
      this.velocity.z += this.direction.z * 60.0 * timeStep;

    if (this.moveState.left || this.moveState.right)
      this.velocity.x += this.direction.x * 60.0 * timeStep;

    const oldPos = this.camera.position.clone();
    this.controls.moveRight(this.velocity.x * timeStep);
    this.controls.moveForward(this.velocity.z * timeStep);

    // Boundaries
    const B = this.showroom.BOUNDARY;
    this.camera.position.x = Math.max(-B, Math.min(B, this.camera.position.x));
    this.camera.position.z = Math.max(-B, Math.min(B, this.camera.position.z));

    // Car collision
    if (
      this.car.isLoaded &&
      this.car.boundingBox.containsPoint(this.camera.position)
    ) {
      this.camera.position.copy(oldPos);
      this.velocity.set(0, 0, 0);
    }
  }
}

// --- CONFIGURATOR CLASS ---
class Configurator {
  constructor(car, carId, modelName) {
    this.car = car;
    this.carId = carId;
    this.modelName = modelName;
    this.tabsContainer = document.getElementById("config-tabs");
    this.contentContainer = document.getElementById("config-content");
    this.types = [];
    this.selectedPartName = null;
    this.bodyParts = [];
    this.colors = [];
    this.activeType = null;
  }

  async init() {
    this.types = await getTypes(this.carId);
    this.colors = await getColors(this.carId);
    this.bodyParts = await getCarBody(this.modelName);
    this.createTabs();

    if (this.colors.length > 0) {
      this.applyBodyColor(this.colors[0].color);
    }
  }

  createTabs() {
    this.tabsContainer.innerHTML = "";
    this.contentContainer.innerHTML = "";

    this.types.forEach((typeObj, index) => {
      const type = typeObj.part_type;

      // Create tab button
      const tab = document.createElement("button");
      tab.className = "tab-btn";
      tab.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      if (index === 0) tab.classList.add("active");

      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".tab-btn")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.loadTabContent(type);
      });

      this.tabsContainer.appendChild(tab);
    });

    // Load first tab by default
    if (this.types.length > 0) this.loadTabContent(this.types[0].part_type);
  }

  applyBodyColor(color) {
    console.log("Applying body color:", color);
    // console.log("Expected Body Parts:", this.bodyParts.map(p => p.part_name));

    this.car.model.traverse((node) => {
      if (node.isMesh) {
        // console.log("Checking mesh:", node.name);

        // Relaxed matching: case-insensitive, trim
        const isMatch = this.bodyParts.some((p) => {
          const dbName = p.part_name.trim().toLowerCase();
          const nodeName = node.name.trim().toLowerCase();
          return dbName === nodeName || nodeName.includes(dbName);
        });

        if (isMatch) {
          // console.log("Applying color to:", node.name);
          // Clone material to avoid affecting other shared meshes if necessary
          if (!node.userData.originalMaterial) {
            node.userData.originalMaterial = node.material.clone();
          }
          // node.material = node.userData.originalMaterial.clone();
          // Often better to just modify current if unique, but let's stick to simple set

          node.material.color.set(color);
          node.material.metalness = 0.1;
          node.material.roughness = 0.25;
          node.material.needsUpdate = true;
        }
      }
    });
  }

  async loadTabContent(type) {
    this.contentContainer.innerHTML = "Loading...";

    let parts = [];

    if (type === "body") {
      // BODY → show available colors
      this.contentContainer.innerHTML = "";

      this.colors.forEach((c) => {
        const circle = document.createElement("div");
        circle.className = "option";
        circle.style.backgroundColor = c.color;
        circle.title = c.color;

        circle.addEventListener("click", () => {
          this.applyBodyColor(c.color);
        });

        this.contentContainer.appendChild(circle);
      });

      return;
    }

    if (type === "trim") {
      this.contentContainer.innerHTML = "";

      const trimColors = [
        { name: "Gold", color: "#FFD700" },
        { name: "Silver", color: "#C0C0C0" },
        { name: "Black", color: "#000000" },
      ];

      const trims = await getCarTrims(this.modelName); // get parts

      trims.forEach((trimPart) => {
        trimColors.forEach((c) => {
          const circle = document.createElement("div");
          circle.className = "option";
          circle.style.backgroundColor = c.color;
          circle.title = `${trimPart.part_name} - ${c.name}`;

          circle.addEventListener("click", () => {
            // Apply color only to this trim part
            this.car.model.traverse((node) => {
              if (node.isMesh) {
                const dbName = trimPart.part_name.trim().toLowerCase();
                const nodeName = node.name.trim().toLowerCase();

                if (dbName === nodeName || nodeName.includes(dbName)) {
                  node.material.color.set(c.color);
                  node.material.metalness = 1;
                  node.material.roughness = 0.2;
                  node.material.needsUpdate = true;
                }
              }
            });
          });

          this.contentContainer.appendChild(circle);
        });
      });

      return;
    }

    if (type === "strip") {
      this.contentContainer.innerHTML = "";

      const trimColors = [
        { name: "Gold", color: "#FFD700" },
        { name: "Silver", color: "#C0C0C0" },
        { name: "Black", color: "#000000" },
      ];

      const strips = await getCarStrip(this.modelName); // get parts

      strips.forEach((strip) => {
        trimColors.forEach((c) => {
          const circle = document.createElement("div");
          circle.className = "option";
          circle.style.backgroundColor = c.color;
          circle.title = `${strip.part_name} - ${c.name}`;

          circle.addEventListener("click", () => {
            // Apply color only to this trim part
            this.car.model.traverse((node) => {
              if (node.isMesh) {
                const dbName = strip.part_name.trim().toLowerCase();
                const nodeName = node.name.trim().toLowerCase();

                if (dbName === nodeName || nodeName.includes(dbName)) {
                  node.material.color.set(c.color);
                  node.material.metalness = 1;
                  node.material.roughness = 0.2;
                  node.material.needsUpdate = true;
                }
              }
            });
          });

          this.contentContainer.appendChild(circle);
        });
      });

      return;
    }

    console.log("type:", type);
    console.log("parts:", parts);

    this.contentContainer.innerHTML = "";

    parts.forEach((part) => {
      const option = document.createElement("div");
      option.className = "option";
      option.textContent = part.part_name;
      option.title = part.part_name;

      option.addEventListener("click", () => {
        this.applyOption(type, part);
      });

      this.contentContainer.appendChild(option);
    });
  }
}

// --- INIT SHOWROOM ---
(async () => {
  const showroom = new Showroom();

  const urlParams = new URLSearchParams(window.location.search);
  const modelName = urlParams.get("model") || "Bentley_Continental_GT.glb";

  const modelList = await getmodels();
  const modelData = modelList.find((m) => m.file_path === modelName);

  if (!modelData) {
    console.error("Model not found in database:", modelName);
    alert("Model not found: " + modelName);
    return;
  }

  let scale = 1;
  if (modelData && modelData.scale_x) scale = modelData.scale_x;

  // Use BASE_URL to fetch from backend
  const GITHUB_MODELS_URL =
    "https://f005.backblazeb2.com/file/autolux-models";
  const car = new Car(`${GITHUB_MODELS_URL}/${modelName}`, scale, modelName);
  await car.load(modelData);
  showroom.addCar(car);

  const carId = modelData.car_id;

  const configurator = new Configurator(car, carId, modelName);
  await configurator.init();

  const controlsManager = new ControlsManager(showroom.camera, car, showroom);

  function animate() {
    requestAnimationFrame(animate);
    const delta = showroom.clock.getDelta();
    controlsManager.update(delta);
    car.update(delta);
    showroom.render();
  }

  animate();
})();
