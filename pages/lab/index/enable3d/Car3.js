import { THREE, ExtendedObject3D } from 'enable3d';

export default class extends ExtendedObject3D {
  constructor({ game }) {
    super();
    this.game = game;
    this.physics = true;
  }

  onCreate() {
    this.plate = this.addPlate();

    this.axis = [
      this.addAxis(-2),
      this.addAxis(2),
    ];

    console.log(this.axis);
  }

  onUpdate() {
    const { camera } = this.game.getData();
    camera.lookAt(this.plate.position.clone());
    this.accelerate();
  }

  accelerate() {
    const speed = 40;

    // this.axis[0].wheels.forEach(({ wheel, constraint }) => {
    //   console.log(wheel.body.enableAngularMotor);
    // });

    // console.log(this.axis[0].constraint.enableAngularMotor);
    // this.axis[0].constraint.enableAngularMotor(true, speed, 0.25);

    // this.axis.forEach(({ axis, constraint }) => {
    //   console.log(constraint.enableAngularMotor);
    //   constraint.enableAngularMotor(true, speed, 0.25)
    // });
  }

  addPlate() {
    const { physics } = this.game.getData();
    const mass = this.physics ? 5000 : 0;

    const plate = physics.factory.add.box(
      { y: 1, width: 1.8, depth: 4.7, mass, height: 0.25 },
      { lambert: { wireframe: true } }
    );

    if (this.physics) {
      physics.add.existing(plate);
    }
    return plate;
  }

  addAxis(z) {
    const { physics, tire } = this.game.getData();
    const mass = this.physics ? 10 : 0;
    const radius = .06;

    const addConstraint = (item1, item2) => {
      // return physics.add.constraints.lock(item1.body, item2.body);

      // return physics.add.constraints.fixed(item1.body, item2.body);

      return physics.add.constraints.hinge(item1.body, item2.body, {
        pivotA: { y: -0.65 },
        pivotB: { y: 0.65 },
        axisA: { x: 1 },
        axisB: { x: 1 },
      });

      // const size = 250;
      // return physics.add.constraints.spring(item1.body, item2.body, {
      //   damping: 250,
      //   linearLowerLimit: { x: -size, y: -size, z: -size },
      //   linearUpperLimit: { x: size, y: size, z: size },
      // });

      // return physics.add.constraints.coneTwist(item1.body, item2.body, {
      //   frameA: { x: 1, y: 1, z: 1 },
      //   frameB: { x: 0.5, y: -0.5, z: 0.5 }
      // });

      // return physics.add.constraints.dof(item1.body, item2.body, { center: true });
    };

    const axis = physics.factory.add.cylinder(
      { z, y: 1, mass, radiusTop: radius, radiusBottom: radius, height: 2.6 },
      { lambert: { color: 'blue', transparent: .5, opacity: 0.5 } }
    );

    axis.rotateZ(Math.PI / 2);
    
    let constraint = false;
    if (this.physics) {
      physics.add.existing(axis);
      constraint = addConstraint(this.plate, axis);
    }

    const wheels = [-1, 1].map(x => {
      const wheel = physics.factory.add.cylinder(
        { mass, radiusBottom: 0.5, radiusTop: 0.5, radiusSegments: 24, height: 0.35, x, y: 1, z },
        { custom: new THREE.MeshBasicMaterial({ map: tire }) }
      );

      wheel.rotateZ(Math.PI/2);

      let constraint = false;
      if (this.physics) {
        physics.add.existing(wheel);
        wheel.body.setFriction(3);
        constraint = addConstraint(axis, wheel);
      }

      return { wheel, constraint };
    });

    return { axis, constraint, wheels };
  }
};