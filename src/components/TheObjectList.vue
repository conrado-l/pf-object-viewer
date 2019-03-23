<template>
  <v-layout text-xs-center>
    <v-flex xs12 sm6 offset-sm3>
      <v-card pa-3>
        <v-card-title class="headline"> Objects list</v-card-title>
        <v-flex>
          <v-progress-linear v-show="isLoading" :indeterminate="true"></v-progress-linear>
        </v-flex>
        <v-layout>
          <v-flex xs12 md6 mx-2>
            <v-text-field
                    v-model.lazy="filterTerm"
                    append-icon="search"
                    label="Filter search"
                    clearable
                    v-debounce="300"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6 mx-2>
            <v-select
                    v-model="filterType"
                    :items="filtering.type.options"
                    item-text="description"
                    item-value="value"
                    label="Filter by">
            </v-select>
          </v-flex>
        </v-layout>

        <v-layout>

          <v-flex xs12 md6 mx-2>
            <v-select
                    v-model="filterAvailable"
                    :items="filtering.available.options"
                    item-text="description"
                    item-value="value"
                    label="Available">
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

        </v-layout>
        <v-divider></v-divider>
        <v-list two-line>
          <slide-x-right-transition group>
          <template v-for="object in objects">

              <v-list-tile
                      :key="object.id"
                      :to="{name: 'object-detail', params: {id: object.id}}"
                      title="Go to detail"
              >

                <v-list-tile-content>
                  <v-list-tile-title> {{ object.name}}</v-list-tile-title>
                  <v-list-tile-sub-title> {{ object.description}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-divider :key="`divider${object.id}`"></v-divider>
          </template>
          </slide-x-right-transition>

          <v-card-text v-if="!objects.length && !isLoading">
            <p class="text-sm-center">
              No objects were found.
            </p>
          </v-card-text>
        </v-list>
        <v-flex py-1>
          <v-pagination
                  py-2
                  v-model="currentPage"
                  :total-visible="4"
                  :length="pagination.total"
                  :disabled="isLoading"
                  circle
          ></v-pagination>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// TODO: refactor and improve the mutation, getters and action names/calls/namespaces
import { mapGetters, mapState } from 'vuex'
import types from '@/store/modules/objects-list.mutations'
import loaders from '@/consts/loaders'
import debounce from 'v-debounce'
import SlideXRightTransition from 'vue2-transitions/src/Slide/SlideXRightTransition'

// Not declared in data () since its a non-reactive constant
const storeNamespace = 'objectsList'

export default {
  name: 'TheObjectList',
  components: { SlideXRightTransition },
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
    filterTerm: { // TODO: refactor and use mapGetters/mapMutations helpers
      get () {
        return this.filtering.term
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_FILTER_TERM}`, value || '')
      }
    },
    filterType: {
      get () {
        return this.filtering.type.selected
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_FILTER_TYPE}`, value)
      }
    },
    filterAvailable: {
      get () {
        return this.filtering.available.selected
      },
      set (value) {
        this.$store.commit(`${storeNamespace}/${types.SET_FILTER_AVAILABLE}`, value)
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
  },
  directives: { debounce }
}
</script>

<style lang="scss" scoped>

</style>
