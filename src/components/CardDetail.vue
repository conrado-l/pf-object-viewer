<template>
  <v-card>
    <!-- Title -->
    <v-card-title text-xs-center
            class="headline"
            data-test="text-title">
      {{title}}
    </v-card-title>
    <!---->

    <!-- Loader -->
    <v-flex v-if="isLoading"
            text-xs-center
            py-3
            key="loader"
            data-test="loader">
      <v-progress-circular color="blue" :indeterminate="true"></v-progress-circular>
    </v-flex>
    <!---->

    <!-- Properties list -->
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
    <!---->
  </v-card>
</template>

<script>
/**
   * A reusable card component with a title and properties listed vertically
   */
export default {
  name: 'CardDetail',
  props: {
    /**
     * Card title.
     */
    title: {
      type: String,
      required: true,
      default: 'Title'
    },
    /**
     * Items that will be listed.
     */
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * Error status.
     */
    error: {
      type: Boolean,
      required: true,
      default: false
    },
    /**
     * Descriptive error message.
     */
    errorMessage: {
      type: String,
      required: false,
      default: 'An error has occurred.'
    },
    /**
     * Indicates if there is a fetching operation in progress.
     */
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
