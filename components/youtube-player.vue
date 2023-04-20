<template>
  <div ref="videoRef" style="width:100%; height:400px;"></div>
  <!-- <pre>props: {{ props }}</pre> -->
  <!-- <pre>video: {{ video }}</pre> -->
</template>

<script setup>
  import { defineProps, defineEmits, ref } from 'vue';

  const getVideoId = (url) => {
    const m = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/.exec(url);
    return m ? m[3] : null;
  };

  const watchData = (options={}) => {
    options = {
      condition: () => {},
      init: () => {},
      false: () => {},
      true: () => {},
      ...options
    };

    options.init();

    let interval = setInterval(() => {
      if (options.condition()) {
        clearInterval(interval);
        options.true();
        return;
      }

      options.false();
    }, 10);
  };

  const youtubeIframeInitEvent = (type) => {
    return (event) => {
      const youtubeIframeSetValue = (event) => {
        video.value.videoThumbnail = `https://img.youtube.com/vi/${video.value.videoId}/0.jpg`;
        video.value.muted = event.target.playerInfo.muted;
        video.value.volume = event.target.playerInfo.volume;
        video.value.playerState = event.target.playerInfo.playerState, // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cue;
        video.value.playing = event.target.playerInfo.playerState==1;
        video.value.currentTime = event.target.playerInfo.currentTime;
        video.value.currentTimePercent = (event.target.playerInfo.currentTime / event.target.playerInfo.duration * 100);
        video.value.duration = event.target.playerInfo.duration;
        video.value.videoUrl = event.target.playerInfo.videoUrl;
        video.value.videoData = { ...event.target.playerInfo.videoData };

        if (video.value.playerState==0) {
          video.value.currentTime = video.value.duration;
          video.value.currentTimePercent = 100;
        }
        emit('update:modelValue', video.value);
      };

      youtubeIframeSetValue(event);

      if (iframeEventInterval) {
        clearInterval(iframeEventInterval);
      }

      if (video.value.playing) {
        iframeEventInterval = setInterval(() => {
          youtubeIframeSetValue(event);
        }, 10);
      }
    };
  };

  const youtubePlayerInit = () => {
    youtubePlayer = new window.YT.Player(videoRef.value, {
      height: '390',
      width: '640',
      videoId: video.value.videoId,
      playerVars: {
        playsinline: 1,
        origin: `${location.host}`,
      },
      events: {
        onReady: youtubeIframeInitEvent('onReady'),
        onStateChange: youtubeIframeInitEvent('onStateChange'),
        onPlaybackQualityChange: youtubeIframeInitEvent('onPlaybackQualityChange'),
        onPlaybackRateChange: youtubeIframeInitEvent('onPlaybackRateChange'),
        onError: youtubeIframeInitEvent('onError'),
        onApiChange: youtubeIframeInitEvent('onApiChange'),
      },
    });
  };

  const videoDefault = (merge = {}) => {
    return {
      ...merge
    };
  };

  const props = defineProps({
    video: {
      type: [ Boolean, String ],
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const video = ref({
    videoId: getVideoId(props.video),
  });

  let youtubePlayer, iframeEventInterval;
  const videoRef = ref(null);

  watchData({
    condition() {
      return !!window.YT && typeof window.YT.Player=='function';
    },
    init() {
      document.head.appendChild(Object.assign(document.createElement('script'), {
        src: 'https://www.youtube.com/iframe_api',
      }));
    },
    true: () => {
      youtubePlayerInit();
    },
  });
</script>