<template>
  <div>
    page-1
  </div>
</template>

<script>
  export default {
    meta: {
      icon: 'mdi-numeric-1',
      name: 'Page 1',
    },
  };
</script>

<script setup>
  import * as tf from '@tensorflow/tfjs';

  const init = async () => {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // Train the model using the data.
    await model.fit(xs, ys, {epochs: 250});
    console.log( model.predict(tf.tensor2d([20], [1, 1])).dataSync() );
  };

  init();
</script>