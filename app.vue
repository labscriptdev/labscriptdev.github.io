<template>
  <nuxt-page />
</template>

<style>
  /* Scroll */
  *::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
  *::-webkit-scrollbar-track { background: #00000000; }
  *::-webkit-scrollbar-thumb { background: #00000000; transition: all 300ms ease; }
  *:hover::-webkit-scrollbar-thumb { background: #66666699; }
  @media (min-width: 0) and (max-width: 1264px) {
    *::-webkit-scrollbar-thumb { background: #66666699 !important; }
  }
</style>