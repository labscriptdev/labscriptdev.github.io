import { THREE, ExtendedObject3D } from 'enable3d';

export default class extends ExtendedObject3D {
  constructor(params) {
    super();
    this.name = 'Car';
    this.game = params.game;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.z = params.z || 0;
  }

  onCreate() {
    const { camera } = this.game.getData();
    const { x, y, z } = this;
    this.position.set(x, y, z);
    console.log('position', { x, y, z });

    this.carCreate();

    this.plate.add(camera);
    camera.position.y = 2;
    camera.position.z = 8;
  }

  onUpdate() {
    this.carControls();
  }

  carCreate() {
    const { physics, scene } = this.game.getData();
    const { x, y, z } = this;
    const wheelX = 1.5, wheelZ = 2, axisZ = 0.2;

    // blue wheels
    this.wheelBackRight = this.addWheel(x+wheelX, z+wheelZ);
    this.wheelBackLeft = this.addWheel(x-wheelX, z+wheelZ);
    this.wheelFrontRight = this.addWheel(x+wheelX, z-wheelZ);
    this.wheelFrontLeft = this.addWheel(x-wheelX, z-wheelZ);

    // red rotors
    this.rotorBackRight = this.addRotor(x+wheelX, z+wheelZ);
    this.rotorBackLeft = this.addRotor(x-wheelX, z+wheelZ);
    this.rotorFrontRight = this.addRotor(x+wheelX, z-wheelZ);
    this.rotorFrontLeft = this.addRotor(x-wheelX, z-wheelZ);

    // blue axis
    this.axisBackOne = this.addAxis(z+wheelZ, 0.4);
    this.axisFrontOne = this.addAxis(z-wheelZ + axisZ, 0.4);
    this.axisFrontTwo = this.addAxis(z-wheelZ - axisZ);

    // constraints
    const wheelToRotorConstraint = { axisA: { y: 1 }, axisB: { y: 1 } };
    this.motorBackLeft = physics.add.constraints.hinge(this.wheelBackLeft.body, this.rotorBackLeft.body, wheelToRotorConstraint);
    this.motorBackRight = physics.add.constraints.hinge(this.wheelBackRight.body, this.rotorBackRight.body, wheelToRotorConstraint);
    this.motorFrontLeft = physics.add.constraints.hinge(this.wheelFrontLeft.body, this.rotorFrontLeft.body, wheelToRotorConstraint);
    this.motorFrontRight = physics.add.constraints.hinge(this.wheelFrontRight.body, this.rotorFrontRight.body, wheelToRotorConstraint);

    physics.add.constraints.lock(this.rotorBackRight.body, this.axisBackOne.body);
    physics.add.constraints.lock(this.rotorBackLeft.body, this.axisBackOne.body);

    this.m0 = this.axisToRotor(this.rotorFrontRight, this.rotorFrontLeft, this.axisFrontTwo, -0);
    this.axisToRotor(this.rotorFrontRight, this.rotorFrontLeft, this.axisFrontOne, 0.4);

    this.plate = this.addPlate();
    physics.add.constraints.lock(this.plate.body, this.axisBackOne.body);
    physics.add.constraints.lock(this.plate.body, this.axisFrontTwo.body);

    const limit = 0.3;
    const dofSettings = {
      angularLowerLimit: { x: 0, y: 0, z: 0 },
      angularUpperLimit: { x: 0, y: 0, z: 0 },
      linearLowerLimit: { x: 0, y: -limit, z: -0.1 },
      linearUpperLimit: { x: 0, y: limit, z: 0.1 }
    };
    physics.add.constraints.dof(this.plate.body, this.axisFrontOne.body, { ...dofSettings, offset: { y: 0.9 } });
    physics.add.constraints.dof(this.plate.body, this.axisFrontOne.body, { ...dofSettings, offset: { y: -0.9 } });
    this.m0.left.enableAngularMotor(true, 0, 1000);
    this.m0.right.enableAngularMotor(true, 0, 1000);
  }

  carControls() {
    const { input } = this.game.getData();
    const speed = 40;

    let force = 0;
    if (input.w) {
      force = 2;
      this.motorBackLeft.enableAngularMotor(true, -speed, force);
      this.motorBackRight.enableAngularMotor(true, -speed, force);
      this.motorFrontLeft.enableAngularMotor(true, -speed, force);
      this.motorFrontRight.enableAngularMotor(true, -speed, force);
    }
    else if (input.s) {
      force = .9;
      this.motorBackLeft.enableAngularMotor(true, speed, force);
      this.motorBackRight.enableAngularMotor(true, speed, force);
      this.motorFrontLeft.enableAngularMotor(true, speed, force);
      this.motorFrontRight.enableAngularMotor(true, speed, force);
    }
    else {
      force = 0.05;
      this.motorBackLeft.enableAngularMotor(true, 0, force);
      this.motorBackRight.enableAngularMotor(true, 0, force);
      this.motorFrontLeft.enableAngularMotor(true, 0, force);
      this.motorFrontRight.enableAngularMotor(true, 0, force);
    }

    const maxAngle = 0.4;
    if (input.a) {
      this.m0.left.setMotorTarget(-maxAngle, 0.5);
      this.m0.right.setMotorTarget(-maxAngle, 0.5);
    }
    else if (input.d) {
      this.m0.left.setMotorTarget(maxAngle, 0.5);
      this.m0.right.setMotorTarget(maxAngle, 0.5);
    }
    else {
      this.m0.left.setMotorTarget(0, 0.5);
      this.m0.right.setMotorTarget(0, 0.5);
    }
  }

  addWheel(x, z) {
    const { physics } = this.game.getData();
    const { y } = this;

    const wheel = physics.factory.add.cylinder(
      { x, y, z, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35 },
      { lambert: { color: 'blue', transparent: true, opacity: 0.5 } }
    );
    this.add(wheel);
    wheel.rotateZ(Math.PI / 2);
    physics.add.existing(wheel, { mass: 20 });
    wheel.body.setFriction(3);
    return wheel;
  }

  addRotor(x, z) {
    const { physics } = this.game.getData();
    const { y } = this;

    const rotor = physics.factory.add.cylinder(
      { x, y, z, radiusBottom: 0.35, radiusTop: 0.35, radiusSegments: 24, height: 0.4 },
      { lambert: { color: 'red', transparent: true, opacity: 0.5 } }
    )

    this.add(rotor);
    rotor.rotateZ(Math.PI / 2);
    physics.add.existing(rotor, { mass: 10 });
    return rotor;
  }

  addAxis(z, radius = 0.06) {
    const { physics } = this.game.getData();
    const { x, y } = this;

    const axis = physics.factory.add.cylinder(
      { x, y, z, mass: 10, radiusTop: radius, radiusBottom: radius, height: 2.6 },
      { lambert: { color: 'blue', transparent: true, opacity: 0.5 } }
    );

    this.add(axis);
    axis.rotateZ(Math.PI / 2);
    physics.add.existing(axis);
    return axis;
  }

  axisToRotor(rotorRight, rotorLeft, axis, z) {
    const { physics } = this.game.getData();

    const right = physics.add.constraints.hinge(rotorRight.body, axis.body, {
      pivotA: { y: 0.2, z },
      pivotB: { y: -1.3 },
      axisA: { x: 1 },
      axisB: { x: 1 }
    });
    const left = physics.add.constraints.hinge(rotorLeft.body, axis.body, {
      pivotA: { y: -0.2, z },
      pivotB: { y: 1.3 },
      axisA: { x: 1 },
      axisB: { x: 1 }
    });
    return { right, left };
  }

  addPlate() {
    const { physics } = this.game.getData();
    const { x, y, z } = this.position;

    const plate = physics.factory.add.box(
      { x, y, z, width: 1.8, depth: 4.7, mass: 5000, height: 0.25 },
      { lambert: { wireframe: true } }
    );

    this.add(plate);
    physics.add.existing(plate);
    return plate;
  }
};