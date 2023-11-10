<template>
  <v-row>
    <v-col cols="6" class="border">
      <div ref="playerRef" style="border:solid 1px red; height:300px;"></div>
      <pre>config: {{ config }}</pre>
      <pre>video: {{ video }}</pre>
    </v-col>
    <v-col cols="6" class="border">
      <template v-for="(v, i) in video.data">
        <youtube-player
          :video="v.bind.videoId"
          v-model="v.bind"
        />
      </template>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    meta: {
      icon: 'mdi-youtube',
      name: 'Iframe test',
    },
  };
</script>

<script setup>
  import { ref, onMounted } from 'vue';
  import { GUI } from 'https://cdn.skypack.dev/dat.gui@0.7.9';

  const playerRef = ref(null);

  const video = ref({
    data: [],
    add(videoId) {
      this.data.push({
        bind: { videoId },
      });
    },
  });

  video.value.add('http://www.youtube.com/embed/0zM3nApSvMg?rel=0');
  video.value.add('https://www.youtube.com/watch?v=UrBZsUBibtk&ab_channel=Posy');

  // onMounted(() => {
  //   youtube.value.attachTo(playerRef.value);
  // });

  // const youtube = useYoutube({
  //   // videoId: 'M7lc1UVf-VE',
  //   // videoId: 'http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0',
  //   // videoId: 'http://www.youtube.com/embed/0zM3nApSvMg?rel=0',
  //   // videoId: 'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index',
  //   // videoId: 'http://www.youtube.com/watch?v=0zM3nApSvMg',
  //   // videoId: 'http://youtu.be/0zM3nApSvMg',
  //   // videoId: 'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s',
  //   // videoId: 'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o',
  // });

  
  // const player = ref(null);
  // const playerData = ref({
  //   duration: 0,
  //   currentTime: 0,
  //   url: false,
  //   volume: 0,
  //   muted: false,
  //   videoData: false,
  // });

  // const youtubeInit = () => {
  //   let youtubeInitHandlerInterval = false;
  //   const youtubeInitHandler = () => {
  //     setTimeout(() => {
  //       const events = Object.fromEntries([
  //         'onReady',
  //         'onStateChange',
  //         'onPlaybackQualityChange',
  //         'onPlaybackRateChange',
  //         'onError',
  //         'onApiChange',
  //       ].map(evt => ([evt, (event => {
  //         const playerDataSetValue = (event) => {
  //           playerData.value = {
  //             muted: event.target.playerInfo.muted,
  //             volume: event.target.playerInfo.volume,
  //             playerState: event.target.playerInfo.playerState, // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
  //             playing: event.target.playerInfo.playerState==1,
  //             currentTime: event.target.playerInfo.currentTime,
  //             currentTimePercent: (event.target.playerInfo.currentTime / event.target.playerInfo.duration * 100),
  //             duration: event.target.playerInfo.duration,
  //             videoUrl: event.target.playerInfo.videoUrl,
  //             videoData: event.target.playerInfo.videoData,
  //           };
  //         };

  //         playerDataSetValue(event);

  //         if (youtubeInitHandlerInterval) clearInterval(youtubeInitHandlerInterval);
  //         youtubeInitHandlerInterval = setInterval(() => {
  //           playerDataSetValue(event);
  //         }, 1000);

  //         // console.log(event.target);
  //       })])));

  //       console.log(events);

  //       player.value = new YT.Player(playerRef.value, {
  //         height: '390',
  //         width: '640',
  //         videoId: 'M7lc1UVf-VE',
  //         playerVars: {
  //           playsinline: 1,
  //           origin: `${location.host}`,
  //         },
  //         events,
  //       });
  //     }, 1000);
  //   };
    
  //   return new Promise((resolve, reject) => {
  //     if (!!window.YT && !!window.YT.Player) {
  //       youtubeInitHandler();
  //       return resolve();
  //     }

  //     document.head.appendChild(Object.assign(document.createElement('script'), {
  //       src: 'https://www.youtube.com/iframe_api',
  //       onload: () => {
  //         youtubeInitHandler();
  //         resolve();
  //       },
  //     }));
  //   });
  // };

  // youtubeInit().then(() => {
  //   console.log('aaa');
  // });


  const config = ref({
    opacity: .5,
    color: '#ff0000',
  });

  const configChange = (value) => {
    // console.log('configChange', config.value);
  };

  onMounted(() => {
    if (window.gui) window.gui.destroy();
    window.gui = new GUI();
    window.gui.addFolder('Hello');
    window.gui.add(config.value, 'opacity', 0, 1, .1).name('opacity').onChange(configChange);
    window.gui.addColor(config.value, 'color').name('color').onChange(configChange);
  });
</script>

<style>
  .dg.ac {z-index: 9999 !important;}
</style>