<template>
<div class="container">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'container', // export the name of this component
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  background-color: pink;
  flex-direction: column;

  /* make some space between the container and the bottom */
  margin-bottom: 20px;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

</style>