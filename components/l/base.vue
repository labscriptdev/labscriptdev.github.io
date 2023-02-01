<script>
  export default {
    methods: {
      getMap() {
        let found = false;
        let currentComp = this;
        while (currentComp && !found) {
          if (currentComp.map) {
            return currentComp.map;
          }
          currentComp = currentComp.$parent;
        }
      },

      // debounce(id, time, callback) {
      //   window._debounce = window._debounce || {};
      //   if (window._debounce[id]) clearTimeout(window._debounce[id]);
      //   window._debounce[id] = setTimeout(callback, time);
      // },
      
      // getFragment(node) {
      //   const fragment = new DocumentFragment();
      //   fragment.append(node);
      //   const html = document.createElement('div');
      //   html.append(fragment);
      //   return html;
      // },
    },
  };
</script>