<template>
  <v-layout justify-center>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import types from '@/store/modules/objects-list.mutations'
import loaders from '@/consts/loaders'

// Not declared in data () since its a non-reactive constant
const storeNamespace = 'objectsList'

export default {
  name: 'ObjectList',
  data () {
    return {
      pollingInterval: null
    }
  },
  created () {
    this.setSettingsFromURL()
    this.setInitialRoute()
    this.fetchObjects()
    this.subscribeToInputMutations()
    // this.startFetchObjectPolling(10000)
  },
  methods: {
    // Sets the pagination, sorting, and filtering settings from the URL to Vuex.
    setSettingsFromURL () {
      this.$store.commit(`${storeNamespace}/${types.SET_SETTINGS}`, this.$route.query)
    },
    // Fetches the objects taking the settings from Vuex.
    fetchObjects () {
      this.$store.dispatch('objectsList/fetchObjects')
    },
    // Sets the initial route
    setInitialRoute () {
      this.$router.replace({
        name: 'objects-list',
        query: this.getSettingsObjectParams
      })
    },
    /**
       * Starts the interval for polling the objects data every X seconds
       * @param {number} interval Interval in milliseconds
       */
    startFetchObjectPolling (interval) {
      this.pollingInterval = setInterval(() => {
        this.fetchObjects()
      }, interval) // TODO: let the user set the interval or get it from a config/ENV
    },
    // Pushes the new route for allowing the user to go back and forward (browser history) and triggers fetch on watch.
    updateRouteStateAndParams () {
      this.$router.push({
        name: 'objects-list',
        query: this.getSettingsObjectParams
      })
    },
    // Update the route if a user relevant input mutation is applied.
    subscribeToInputMutations () { // TODO: refactor and improve the function and the mutation names/namespaces
      this.$store.subscribe((mutation) => {
        if ([
          'objectsList/SET_FILTER_TERM',
          'objectsList/SET_FILTER_TYPE',
          'objectsList/SET_FILTER_AVAILABLE',
          'objectsList/SET_SORT_BY',
          'objectsList/SET_CURRENT_PAGE']
          .some((type) => type === mutation.type)) {
          this.updateRouteStateAndParams()
        }
      })
    }
  },
  computed: {
    // Indicates if there is a fetching operation at the moment.
    isLoading () {
      return this.$wait.is(loaders.objectsList.FETCH_OBJECTS)
    },
    ...mapState(storeNamespace, [
      'objects',
      'filtering',
      'sorting',
      'pagination'
    ]),
    ...mapGetters(storeNamespace, [
      'getSettingsObjectParams'
    ])
  },
  /**
     * When a new route is detected, the settings will be updated from the URL to Vuex, it will also fetch the objects.
     * The URL is taken as the single source of truth in this case.
     * beforeRouteUpdate hook could be used too, but there is no need to prevent navigation.
     */
  watch: {
    '$route' () {
      this.setSettingsFromURL()
      this.fetchObjects()
    }
  },
  // On component destroyal, it will clear the polling interval, avoiding memory leaks, it will also reset the store.
  beforeDestroy () {
    clearInterval(this.pollingInterval)
    this.$store.commit('objectsList/reset')
  }
}
</script>

<style lang="scss" scoped>

</style>
