import { THREE, ExtendedObject3D } from 'enable3d';

export default class extends ExtendedObject3D {
  constructor(scene) {
    super();
    this.scene = scene;
    this.modelInit();
  }

  modelInit() {
    const wheelX = 1.5,
      wheelZ = 2,
      axisZ = 0.2;

    // blue wheels
    const wheelBackRight = this.addWheel(wheelX, wheelZ);
    const wheelBackLeft = this.addWheel(-wheelX, wheelZ);
    const wheelFrontRight = this.addWheel(wheelX, -wheelZ); // right front
    const wheelFrontLeft = this.addWheel(-wheelX, -wheelZ);

    // red rotors
    const rotorBackRight = this.addRotor(wheelX, wheelZ);
    const rotorBackLeft = this.addRotor(-wheelX, wheelZ);
    const rotorFrontRight = this.addRotor(wheelX, -wheelZ);
    const rotorFrontLeft = this.addRotor(-wheelX, -wheelZ);

    // blue axis
    const axisBackOne = this.addAxis(wheelZ); // the one at the back
    const axisFrontOne = this.addAxis(-wheelZ + axisZ, 0.04);
    const axisFrontTwo = this.addAxis(-wheelZ - axisZ);

    /**
     * CONSTRAINTS
     */

    // constraint wheel to rotor
    const wheelToRotorConstraint = { axisA: { y: 1 }, axisB: { y: 1 } }
    this.motorBackLeft = this.scene.physics.add.constraints.hinge(
      wheelBackLeft.body,
      rotorBackLeft.body,
      wheelToRotorConstraint
    );
    this.motorBackRight = this.scene.physics.add.constraints.hinge(
      wheelBackRight.body,
      rotorBackRight.body,
      wheelToRotorConstraint
    );
    this.motorFrontLeft = this.scene.physics.add.constraints.hinge(
      wheelFrontLeft.body,
      rotorFrontLeft.body,
      wheelToRotorConstraint
    );
    this.motorFrontRight = this.scene.physics.add.constraints.hinge(
      wheelFrontRight.body,
      rotorFrontRight.body,
      wheelToRotorConstraint
    );

    // constraint axis to rotor
    const axisToRotor = (rotorRight, rotorLeft, axis, z) => {
      const right = this.scene.physics.add.constraints.hinge(rotorRight.body, axis.body, {
        pivotA: { y: 0.2, z: z },
        pivotB: { y: -1.3 },
        axisA: { x: 1 },
        axisB: { x: 1 }
      })
      const left = this.scene.physics.add.constraints.hinge(rotorLeft.body, axis.body, {
        pivotA: { y: -0.2, z: z },
        pivotB: { y: 1.3 },
        axisA: { x: 1 },
        axisB: { x: 1 }
      })
      return { right, left }
    }

    this.scene.physics.add.constraints.lock(rotorBackRight.body, axisBackOne.body)
    this.scene.physics.add.constraints.lock(rotorBackLeft.body, axisBackOne.body)

    this.m0 = axisToRotor(rotorFrontRight, rotorFrontLeft, axisFrontTwo, -0)
    axisToRotor(rotorFrontRight, rotorFrontLeft, axisFrontOne, 0.4)

    this.plate = this.addPlate()
    this.plate.add(this.camera)
    this.scene.physics.add.constraints.lock(this.plate.body, axisBackOne.body)

    this.scene.physics.add.constraints.lock(this.plate.body, axisFrontTwo.body)

    const limit = 0.3
    const dofSettings = {
      angularLowerLimit: { x: 0, y: 0, z: 0 },
      angularUpperLimit: { x: 0, y: 0, z: 0 },
      linearLowerLimit: { x: 0, y: -limit, z: -0.1 },
      linearUpperLimit: { x: 0, y: limit, z: 0.1 }
    }
    this.scene.physics.add.constraints.dof(this.plate.body, axisFrontOne.body, { ...dofSettings, offset: { y: 0.9 } })
    this.scene.physics.add.constraints.dof(this.plate.body, axisFrontOne.body, { ...dofSettings, offset: { y: -0.9 } })

    this.m0.left.enableAngularMotor(true, 0, 1000)
    this.m0.right.enableAngularMotor(true, 0, 1000)
    
    console.log('Car');
  }

  addPlate() {
    const plate = this.scene.add.box(
      { y: 1, width: 1.8, depth: 4.7, mass: 5000, height: 0.25 },
      { lambert: { wireframe: true } }
    )
    this.scene.physics.add.existing(plate)
    return plate
  }

  addAxis(z, radius = 0.06) {
    const axis = this.scene.add.cylinder(
      { z, y: 1, mass: 10, radiusTop: radius, radiusBottom: radius, height: 2.6 },
      { lambert: { color: 'blue', transparent: true, opacity: 0.5 } }
    )
    axis.rotateZ(Math.PI / 2)
    this.scene.physics.add.existing(axis)
    return axis
  }

  addRotor(x, z) {
    const rotor = this.scene.add.cylinder(
      { mass: 10, radiusBottom: 0.35, radiusTop: 0.35, radiusSegments: 24, height: 0.4, x, y: 1, z },
      { lambert: { color: 'red', transparent: true, opacity: 0.5 } }
    )

    rotor.rotateZ(Math.PI / 2)
    this.scene.physics.add.existing(rotor)
    return rotor
  }

  addWheel(x, z) {
    const wheel = this.scene.add.cylinder(
      { mass: 20, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35, x, y: 1, z },
      { lambert: { color: 'blue', transparent: true, opacity: 0.5 } }
    )

    wheel.rotateZ(Math.PI / 2)
    this.scene.physics.add.existing(wheel)
    wheel.body.setFriction(3)
    return wheel
  }

  addAxisRotor(x, y, z) {
    const axisRotor = this.scene.add.box(
      { x, y, z, mass: 5, width: 0.25, height: 0.2, depth: 1 },
      { lambert: { transparent: true, opacity: 0.5 } }
    )
    this.scene.physics.add.existing(axisRotor)
    return axisRotor
  }
};