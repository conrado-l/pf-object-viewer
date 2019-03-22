<template>
  <the-object-list></the-object-list>
</template>

<script>
// Refactor TheObjectsList and use this view, pass the props down and manage data.
import TheObjectList from '@/components/TheObjectList'

export default {
  name: 'ObjectList',
  components: { TheObjectList }
}
</script>

<style lang="scss" scoped>

</style>
