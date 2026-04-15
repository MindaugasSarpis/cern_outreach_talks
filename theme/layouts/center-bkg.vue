<template>
  <div class="slidev-layout center-bkg h-full grid place-content-center" :style="backgroundStyle">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: '/images/default_background.jpg' // Provide a default if no background is passed
    }
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url('${this.background}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
  }
};
</script>
