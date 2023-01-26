import { THREE, ExtendedObject3D } from 'enable3d';

export default class extends ExtendedObject3D {
  constructor(params) {
    super();
    this.name = 'Car';
    this.game = params.game;
    this.position.set(params.x || 0, params.y || 0, params.z || 0);
    this.carWidth = 2;
    this.carDepth = 4;
    this.carMass = 100;
    this.axisDistanceBetween = 4;
    this.wheelRadius = .4;
    this.maxEngineForce = 400;
    this.maxBreakingForce = 400;
    this.suspensionRestLength = .6;
    this.suspensionStiffness = 10;
    this.suspensionDamping = .1;
    this.suspensionCompression = 4.4;
    this.friction = 50;
    this.rollInfluence = 0.01;
  }

  preload() {
    return {
      mercedes: { type: 'gltf', url: '/assets/threejs/models/vehicles/mercedes/scene.gltf' },
    };
  }

  onCreate() {
    this.carCreateVisual();
    this.carCreatePhysics();
  }

  onUpdate() {
    this.carUpdate();

    const { camera } = this.game.getData();
    this.chassi.add(camera);
    camera.position.set(0, 2, -this.carDepth-2);
    const cameraLook = this.chassi.position.clone();
    camera.lookAt(cameraLook);
  }

  getSpeed() {
    return this.vehicle.getCurrentSpeedKmHour();
  }

  carCreateVisual() {
    const { x, y, z } = this.position;

    this.chassi = this.meshCreate({
      type: 'box',
      data: { x, y, z, width: this.carWidth, depth: this.carDepth, mass: 5000, height: 0.25 },
      material: { lambert: { wireframe: true } },
      physics: { mass: this.carMass },
      callback: (mesh) => {
        // mesh.geometry.center();
        return mesh;
      },
    });

    this.wheels = [
      {
        x: -(this.carWidth/2),
        y: 0,
        z: (this.axisDistanceBetween / 2),
      },
      {
        x: (this.carWidth/2),
        y: 0,
        z: (this.axisDistanceBetween / 2),
      },
      {
        x: -(this.carWidth/2),
        y: 0,
        z: -(this.axisDistanceBetween / 2),
      },
      {
        x: (this.carWidth/2),
        y: 0,
        z: -(this.axisDistanceBetween / 2),
      },
    ].map((pos, ind) => {
      return this.meshCreate({
        type: 'cylinder',
        data: { x: pos.x, y: pos.y, z: pos.z, radiusBottom: this.wheelRadius, radiusTop: this.wheelRadius, radiusSegments: 24, height: 0.35 },
        material: { lambert: { color: 0x000000 } },
        callback: (mesh) => {
          // mesh.rotateZ(Math.PI / 2);
          mesh.geometry.center();
          return mesh;
        },
      });
    });

    // let positions = [ this.chassi.position ];
    // this.wheels.forEach(mesh => positions.push(mesh.position));
    // console.table(positions);
  }

  carCreatePhysics() {
    const { x, y, z } = this.position;
    const { physics } = this.game.getData();
    const { physicsWorld } = physics;
    const tuning = new Ammo.btVehicleTuning();
    const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
    const vehicle = new Ammo.btRaycastVehicle(tuning, this.chassi.body.ammo, rayCaster);
    vehicle.setCoordinateSystem(0, 1, 2);
    physicsWorld.addAction(vehicle);

    this.chassi.body.skipUpdate = true;
    this.vehicle = vehicle;

    this.wheels.forEach((mesh, index) => {
      const isFront = index <= 1;
      const p = mesh.position.clone();
      const pos = new Ammo.btVector3(p.x, p.y, p.z);
      const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
      const wheelAxleCS = new Ammo.btVector3(-1, 0, 0);
      const wheelInfo = vehicle.addWheel(pos, wheelDirectionCS0, wheelAxleCS, this.suspensionRestLength, this.wheelRadius, tuning, isFront);
      wheelInfo.set_m_suspensionStiffness(this.suspensionStiffness);
      wheelInfo.set_m_wheelsDampingRelaxation(this.suspensionDamping);
      wheelInfo.set_m_wheelsDampingCompression(this.suspensionCompression);
      wheelInfo.set_m_frictionSlip(this.friction);
      wheelInfo.set_m_rollInfluence(this.rollInfluence);
    });
  }

  carUpdate() {
    const { input } = this.game.getData();
    
    const FRONT_LEFT = 0;
    const FRONT_RIGHT = 1;
    const BACK_LEFT = 2;
    const BACK_RIGHT = 3;

    let engineForce = 0;
    let breakingForce = 0;
    let steeringIncrement = 0.4;
    let steeringClamp = .8;
    let vehicleSteering = 0;

    // front/back
    if (input.w) engineForce = this.maxEngineForce;
    else if (input.s) engineForce = -this.maxEngineForce;
    else engineForce = 0;

    // left/right
    if (input.a) {
      if (vehicleSteering < steeringClamp) {
        vehicleSteering += steeringIncrement;
      }
    }
    else if (input.d) {
      if (vehicleSteering > -steeringClamp) {
        vehicleSteering -= steeringIncrement;
      }
    }
    else {
      if (vehicleSteering > 0) {
        vehicleSteering -= steeringIncrement / 2;
      }
      if (vehicleSteering < 0) {
        vehicleSteering += steeringIncrement / 2;
      }
      if (Math.abs(vehicleSteering) <= steeringIncrement) {
        vehicleSteering = 0;
      }
    }
    
    // break
    if (input.space) breakingForce = this.maxBreakingForce;
    else breakingForce = 0;

    // Control
    this.vehicle.applyEngineForce(engineForce, BACK_LEFT);
    this.vehicle.applyEngineForce(engineForce, BACK_RIGHT);

    this.vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
    this.vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

    this.vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
    this.vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
    this.vehicle.setBrake(breakingForce, BACK_LEFT);
    this.vehicle.setBrake(breakingForce, BACK_RIGHT);

    // Car update isolation
    (() => {
      this.wheels.forEach((wheel, index) => {
        let tm = this.vehicle.getWheelTransformWS(index);
        let p = tm.getOrigin();
        let q = tm.getRotation();
        wheel.position.set(p.x(), p.y(), p.z());
        wheel.quaternion.set(q.x(), q.y(), q.z(), q.w());
        wheel.rotateZ(Math.PI / 2);
      });
  
      let tm = this.vehicle.getChassisWorldTransform();
      let p = tm.getOrigin();
      let q = tm.getRotation();
  
      this.chassi.position.set(p.x(), p.y(), p.z());
      this.chassi.quaternion.set(q.x(), q.y(), q.z(), q.w());
    })();
  }

  meshCreate(params = {}) {
    const { physics } = this.game.getData();
    let mesh = physics.factory.add[ params.type ](params.data, params.material);
    if (typeof params.callback=='function') mesh = params.callback(mesh);
    // this.add(mesh);
    if (typeof params.physics=='object') physics.add.existing(mesh, params.physics || {});
    // physics.add.existing(mesh, { mass: 0 });
    return mesh;
  }
};