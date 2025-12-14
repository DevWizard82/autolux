import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { getmodels, getCarTrims, getCarBody, getCarStrip } from "./api.js";

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
      1000
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

    // Ceiling industrial lights
    [
      [-15, -15],
      [15, -15],
      [-15, 15],
      [15, 15],
    ].forEach(([x, z]) => {
      const light = new THREE.PointLight(0xffffff, 40, 45);
      light.position.set(x, this.ROOM_HEIGHT - 2, z);
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
      floorMat
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(this.ROOM_SIZE, this.ROOM_SIZE),
      ceilingMat
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = this.ROOM_HEIGHT;
    this.scene.add(ceiling);

    const walls = new THREE.Group();
    const wallGeoSide = new THREE.BoxGeometry(
      0.2,
      this.ROOM_HEIGHT,
      this.ROOM_SIZE
    );
    const wallGeoBack = new THREE.BoxGeometry(
      this.ROOM_SIZE,
      this.ROOM_HEIGHT,
      0.2
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
          THREE.MathUtils.degToRad(modelData.rot_z || 0)
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
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2 })
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

  async applyColorsFromDB() {
    try {
      const trims = await getCarTrims(this.modelName);
      const body = await getCarBody(this.modelName);
      const strips = await getCarStrip(this.modelName);

      const setColor = (arr, color) =>
        this.model.traverse((node) => {
          if (node.isMesh && arr.includes(node.name)) {
            node.material.color.set(color);
            node.material.metalness = 1;
            node.material.roughness = 0.2;
          }
        });

      setColor(
        trims.map((t) => t.part_name),
        "#C0C0C0"
      );
      setColor(
        body.map((b) => b.part_name),
        "#0A7968"
      );
      setColor(
        strips.map((s) => s.part_name),
        "#C0C0C0"
      );
    } catch (err) {
      console.error("Failed to apply colors:", err);
    }
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
    document.addEventListener("click", () => this.controls.lock());

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

// --- INIT SHOWROOM ---
(async () => {
  const showroom = new Showroom();

  const urlParams = new URLSearchParams(window.location.search);
  const modelName = urlParams.get("model") || "Bentley_Continental_GT.glb";

  const modelList = await getmodels();
  const modelData = modelList.find((m) => m.file_path === modelName);

  let scale = 1;
  if (modelData && modelData.scale_x) scale = modelData.scale_x;

  const car = new Car(`/assets/models/${modelName}`, scale, modelName);
  await car.load(modelData);
  await car.applyColorsFromDB();
  showroom.addCar(car);

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
