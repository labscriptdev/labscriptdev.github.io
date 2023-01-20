import { THREE, ExtendedObject3D } from 'enable3d';

export default class extends ExtendedObject3D {
  constructor({ game }) {
    super();
    this.game = game;
    this.physics = false;
    this.modelInit();
  }

  modelInit() {
    this.carInit();
  }

  carInit() {
    const { physics } = this.game.getData();
    const wheelX = 1.5, wheelZ = 2, axisZ = 0.2;

    // blue wheels
    this.wheelBackRight = this.addWheel(wheelX, wheelZ);
    this.wheelBackLeft = this.addWheel(-wheelX, wheelZ);
    this.wheelFrontRight = this.addWheel(wheelX, -wheelZ);
    this.wheelFrontLeft = this.addWheel(-wheelX, -wheelZ);

    // red rotors
    this.rotorBackRight = this.addRotor(wheelX, wheelZ);
    this.rotorBackLeft = this.addRotor(-wheelX, wheelZ);
    this.rotorFrontRight = this.addRotor(wheelX, -wheelZ);
    this.rotorFrontLeft = this.addRotor(-wheelX, -wheelZ);

    // blue axis
    this.axisBackOne = this.addAxis(wheelZ);
    this.axisBackTwo = this.addAxis(wheelZ + .3);
    this.axisFrontOne = this.addAxis(-wheelZ + axisZ, 0.04);
    this.axisFrontTwo = this.addAxis(-wheelZ - axisZ);

    // constraint wheel to rotor
    const wheelToRotorConstraint = { axisA: { y: 1 }, axisB: { y: 1 } };
    this.motorBackLeft = physics.add.constraints.hinge(this.wheelBackLeft.body, this.rotorBackLeft.body, wheelToRotorConstraint);
    this.motorBackRight = physics.add.constraints.hinge(this.wheelBackRight.body, this.rotorBackRight.body, wheelToRotorConstraint);
    this.motorFrontLeft = physics.add.constraints.hinge(this.wheelFrontLeft.body, this.rotorFrontLeft.body, wheelToRotorConstraint);
    this.motorFrontRight = physics.add.constraints.hinge(this.wheelFrontRight.body, this.rotorFrontRight.body, wheelToRotorConstraint);

    // constraint axis to rotor
    physics.add.constraints.lock(this.rotorBackRight.body, this.axisBackOne.body);
    physics.add.constraints.lock(this.rotorBackLeft.body, this.axisBackOne.body);
    physics.add.constraints.lock(this.rotorBackRight.body, this.axisBackTwo.body);
    physics.add.constraints.lock(this.rotorBackLeft.body, this.axisBackTwo.body);

    this.m0 = this.axisToRotor(this.rotorFrontRight, this.rotorFrontLeft, this.axisFrontTwo, -0);
    this.axisToRotor(this.rotorFrontRight, this.rotorFrontLeft, this.axisFrontOne, 0.4);

    this.plate = this.addPlate();
    physics.add.constraints.lock(this.plate.body, this.axisBackOne.body);
    physics.add.constraints.lock(this.plate.body, this.axisFrontTwo.body);

    const limit = 0.3
    const dofSettings = {
      angularLowerLimit: { x: 0, y: 0, z: 0 },
      angularUpperLimit: { x: 0, y: 0, z: 0 },
      linearLowerLimit: { x: 0, y: -limit, z: -0.1 },
      linearUpperLimit: { x: 0, y: limit, z: 0.1 }
    }
    physics.add.constraints.dof(this.plate.body, this.axisFrontOne.body, { ...dofSettings, offset: { y: 0.9 } });
    physics.add.constraints.dof(this.plate.body, this.axisFrontOne.body, { ...dofSettings, offset: { y: -0.9 } });
    this.m0.left.enableAngularMotor(true, 0, 1000);
    this.m0.right.enableAngularMotor(true, 0, 1000);
  }

  onUpdate() {
    const { camera } = this.game.getData();
    camera.lookAt(this.getPosition());
    this.accelerate();
  }

  getPosition() {
    return this.axisFrontOne.position.clone();
  }

  accelerate() {
    const speed = 40;
    this.motorBackLeft.enableAngularMotor(true, speed, 0.25);
    this.motorBackRight.enableAngularMotor(true, speed, 0.25);
    this.motorFrontLeft.enableAngularMotor(true, speed, 0.25);
    this.motorFrontRight.enableAngularMotor(true, speed, 0.25);
  }

  addWheel(x, z) {
    const { physics, tire } = this.game.getData();
    const mass = this.physics ? 20 : 0;

    const wheel = physics.factory.add.cylinder(
      { mass, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35, x, y: 1, z },
      { custom: new THREE.MeshBasicMaterial({ map: tire }) }
    );

    wheel.rotateZ(Math.PI/2);
    physics.add.existing(wheel);
    wheel.body.setFriction(3);
    return wheel;
  }

  addRotor(x, z) {
    const { physics } = this.game.getData();
    const mass = this.physics ? 10 : 0;

    const rotor = physics.factory.add.cylinder(
      { mass, radiusBottom: 0.35, radiusTop: 0.35, radiusSegments: 24, height: 0.4, x, y: 1, z },
      { lambert: { color: 0xffffff, transparent: true, opacity: 0.8 } }
    )

    rotor.rotateZ(Math.PI / 2);
    physics.add.existing(rotor);
    return rotor;
  }

  addAxis(z, radius = 0.06) {
    const { physics } = this.game.getData();
    const mass = this.physics ? 10 : 0;

    const axis = physics.factory.add.cylinder(
      { z, y: 1, mass, radiusTop: radius, radiusBottom: radius, height: 2.6 },
      { lambert: { color: 'blue', transparent: .5, opacity: 0.5 } }
    );
    axis.rotateZ(Math.PI / 2);
    physics.add.existing(axis);
    return axis;
  }

  addPlate() {
    const { physics } = this.game.getData();
    const mass = this.physics ? 5000 : 0;

    const plate = physics.add.box(
      { y: 1, width: 1.8, depth: 4.7, mass, height: 0.25 },
      { lambert: { wireframe: true } }
    );

    return plate;
  }

  axisToRotor(rotorRight, rotorLeft, axis, z) {
    const { physics } = this.game.getData();

    const right = physics.add.constraints.hinge(rotorRight.body, axis.body, {
      pivotA: { y: 0.2, z: z },
      pivotB: { y: -1.3 },
      axisA: { x: 1 },
      axisB: { x: 1 }
    });

    const left = physics.add.constraints.hinge(rotorLeft.body, axis.body, {
      pivotA: { y: -0.2, z: z },
      pivotB: { y: 1.3 },
      axisA: { x: 1 },
      axisB: { x: 1 }
    });

    return { right, left };
  }
};