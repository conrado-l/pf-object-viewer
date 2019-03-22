<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm3>
      <v-card pa-3>
        <v-flex>
          <v-progress-linear v-show="isLoading" :indeterminate="true"></v-progress-linear>
        </v-flex>
        <v-flex xs12 sm6 mx-2>
          <v-text-field
                  v-model="searchTerm"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  clearable
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 mx-2>
          <v-select
                  v-model="searchFilter"
                  :items="filtering.options"
                  item-text="description"
                  item-value="value"
                  label="Filter type">
          </v-select>
        </v-flex>
        <v-flex xs12 sm6 mx-2>
          <v-select
                  v-model="searchSort"
                  :items="sorting.options"
                  item-text="description"
                  item-value="value"
                  label="Sort by">
          </v-select>
        </v-flex>
        <v-divider></v-divider>
        <v-list two-line>
          <template v-for="object in objects">

            <v-list-tile
                    :key="object.id"
                    @click="(e) => e">

              <v-list-tile-content>
                <v-list-tile-title> {{ object.name}}</v-list-tile-title>
                <v-list-tile-sub-title> {{ object.description}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider :key="`divider${object.id}`"></v-divider>

          </template>
          <v-card-text v-if="!objects.length && !isLoading">
            <p class="text-sm-center">
              No objects were found.
            </p>
          </v-card-text>
        </v-list>
        <div class="text-xs-center">
          <v-pagination
                  v-model="currentPage"
                  :total-visible="7"
                  :length="pagination.total"
                  :disabled="isLoading"
                  circle
          ></v-pagination>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// TODO: refactor and improve the mutation, getters and action names/calls/namespaces
import { mapGetters, mapState } from 'vuex'
import types from '@/store/modules/objects-list.mutations'
import loaders from '@/consts/loaders'

// Not declared in data () since its a non-reactive constant
const storeNamespace = 'objectsList'

export default {
  name: 'TheObjectList',
  data () {
    return {
      pollingInterval: null
    }
  },
  // On component creation, it sets the settings from the URL, fetches the objects and subscribes to input mutations.
  created () {
    this.setSettingsFromURL()
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
        .catch(() => this.$toast.error('Error')) // TODO: show an error toast
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
    // Pushes the new route for allowing the user to go back and forward (browser history).
    updateRouteStateAndParams () {
      this.$router.push({
        name: 'objects-list',
        query: this.getSettingsObjectParams
      })
    },
    // Update the route if a user input mutation is applied.
    subscribeToInputMutations () { // TODO: refactor and improve the function and the mutation names/namespaces
      this.$store.subscribe((mutation) => {
        if ([`${storeNamespace}/${types.SET_FILTER_TERM}`,
          `${storeNamespace}/${types.SET_FILTER_TYPE}`,
          `${storeNamespace}/${types.SET_CURRENT_PAGE}`]
          .some((type) => type === mutation.type)) {
          this.updateRouteStateAndParams()
        }
      })
    }
  },
  computed: {
    searchTerm: { // TODO: refactor and use mapGetters/mapMutations helpers
      get () {
        return this.filtering.term
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_FILTER_TERM}`, value)
      }
    },
    searchFilter: {
      get () {
        return this.filtering.selected
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_FILTER_TYPE}`, value)
      }
    },
    searchSort: {
      get () {
        return this.sorting.selected
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_SORT_BY}`, value)
      }
    },
    currentPage: {
      get () {
        return this.pagination.current
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_CURRENT_PAGE}`, value)
      }
    },
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
   */
  beforeRouteUpdate (to, from, next) {
    this.setSettingsFromURL()
    this.fetchObjects()
    next()
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
