<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="white--text">Object renderer</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn :to="{name: 'objects-list'}" flat>Objects List</v-btn>

    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>

  </v-toolbar>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style lang="scss" scoped>

</style>
