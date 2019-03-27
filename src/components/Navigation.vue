<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="white--text"> PF - Object Viewer</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn :to="{name: 'objects-list'}" flat>Objects List</v-btn>

    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>

  </v-toolbar>
</template>

<script>
/**
   * Navigation component for accessing the different sections of the application.
   */
export default {
  name: 'Navigation'
}
</script>

<style lang="scss" scoped>

</style>
