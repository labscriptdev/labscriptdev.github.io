import { ref, onMounted, onUnmounted } from 'vue';
import _ from 'lodash';

export default (options={}) => {

  options = _.merge({
    videoId: '',
  }, options);

  let youtubePlayer = null;
  let playerTarget = null;

  const youtubeIframeInitEvent = (type) => {
    return (event) => {
      r.value.muted = event.target.playerInfo.muted;
      r.value.volume = event.target.playerInfo.volume;
      r.value.playerState = event.target.playerInfo.playerState, // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cue;
      r.value.playing = event.target.playerInfo.playerState==1;
      r.value.currentTime = event.target.playerInfo.currentTime;
      r.value.currentTimePercent = (event.target.playerInfo.currentTime / event.target.playerInfo.duration * 100);
      r.value.duration = event.target.playerInfo.duration;
      r.value.videoUrl = event.target.playerInfo.videoUrl;
      r.value.videoData = { ...event.target.playerInfo.videoData };
    };
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

  const r = ref({
    options,
    target: Object.assign(document.createElement('div'), {
      style: 'display:none;',
    }),
    videoId: false,
    thumbnail: false,
    muted: false,
    volume: 0,
    playerState: -1,
    playing: false,
    currentTime: false,
    currentTimePercent: 0,
    duration: 0,
    videoUrl: false,
    videoData: {},

    attachTo(element) {
      if (typeof element=='string') {
        element = document.querySelector(element);
      }

      this.target = element;
      this.youtubePlayerInit();
    },

    youtubePlayerInit() {
      if (!window.YT) return;

      if (!this.target.parentNode) {
        document.body.appendChild(this.target);
      }

      youtubePlayer = new window.YT.Player(this.target, {
        height: '390',
        width: '640',
        videoId: this.videoId,
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
    },

    youtubeIframeInit() {
      let m = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/.exec(options.videoId);
      this.videoId = m ? m[3] : options.videoId;

      return new Promise((resolve, reject) => {
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
            this.youtubePlayerInit();
            resolve();
          },
        });
      });
    },

    init() {
      this.youtubeIframeInit();
    },

    destroy() {
      if (playerTarget) playerTarget.remove();
    },
  });

  onMounted(() => {
    r.value.init();
  });

  onUnmounted(() => {
    r.value.destroy();
  });

  return r;
};