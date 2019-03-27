<template>
  <v-card>
    <v-card-title text-xs-center
            class="headline"
            data-test="text-title">
      {{title}}
    </v-card-title>

    <v-flex v-if="isLoading"
            text-xs-center
            py-3
            key="loader"
            data-test="loader">
      <v-progress-circular color="blue" :indeterminate="true"></v-progress-circular>
    </v-flex>

    <v-flex v-else key="items">
      <!--TODO: Only a v-card-text component should be used per card?!-->
      <v-card-text v-if="error"
                   class="error--text text-xs-center"
                   data-test="text-error-message">
        {{errorMessage}}
      </v-card-text>
      <v-card-text v-for="item in items"
                   :key="item.id"
                   data-test="text-item">
        {{item.description}}: {{item.value}}
      </v-card-text>

    </v-flex>
  </v-card>
</template>

<script>
/**
   * A reusable card component with a title and properties listed vertically
   */
export default {
  name: 'CardDetail',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Title'
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    error: {
      type: Boolean,
      required: true,
      default: false
    },
    errorMessage: {
      type: String,
      required: false,
      default: 'An error has occurred.'
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
