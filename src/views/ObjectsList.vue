<template>
  <v-layout justify-center data-app>
    <v-flex xs12 sm5 mx-2>
      <v-layout justify-center>
        <v-flex xs12 md4 mx-2>
          <v-text-field
                  name="search"
                  label="Search filter"
                  v-model="filterSearch"
                  solo
                  clearable
                  data-test="input-search"
          >
          </v-text-field>
        </v-flex>

        <v-flex xs12 md4 mx-2>
          <v-select
                  name="filterType"
                  label="Filter type"
                  v-model="filterType"
                  :items="getFilters.byTerm.options"
                  item-text="description"
                  item-value="value"
                  solo
                  clearable
                  data-test="input-filter-type"
          >
          </v-select>
        </v-flex>

      </v-layout>
      <v-layout justify-center>
        <v-flex xs12 md4 mx-2>
          <v-select
                  name="available"
                  label="Available"
                  v-model="filterAvailable"
                  :items="getFilters.byAvailability.options"
                  item-text="description"
                  item-value="value"
                  solo
                  clearable
                  data-test="input-filter-availability"
          >
          </v-select>
        </v-flex>
        <v-flex xs12 md6 mx-2>
          <v-select
                  name="sortBy"
                  label="Sort by"
                  v-model="sorting"
                  :items="getSorting.options"
                  item-text="description"
                  item-value="value"
                  clearable
                  solo
                  multiple
                  data-test="input-sorting"

          >
          </v-select>
        </v-flex>
      </v-layout>
      <v-card>
        <v-card-title class="headline">
          Objects List
        </v-card-title>

        <v-spacer></v-spacer>

        <v-data-table
                :headers="headers"
                :items="objects"
                :loading="isLoading"
                disable-initial-sort
                hide-actions
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

          <template v-slot:items="items">
            <router-link tag="tr"
                         :to="{name: 'object-detail', params: {id: items.item.id}}"
                         title="Go to detail"
                         :key="items.item.id"
                         :data-test="`item-${items.item.id}`"
            >
              <td v-for="(property, index) in items.item" :key="`tabledata-${property}-${index}`">{{ property }}</td>
            </router-link>
          </template>

        </v-data-table>

      </v-card>
      <v-layout align-center justify-center my-2>
        <v-pagination
                :value="getPagination.current"
                :length="getPagination.totalPages"
                :total-visible="4"
                :disabled="isLoading"
                @input="updatePagination"
                circle
                data-test="input-pagination"
        ></v-pagination>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
/***
   * This was my first idea and approach for the functionality. I used the single Vuetify components + Vuex.
   * I decided to go for single Vuetify components + Vuex because the model management is much better and the code
   * is better organized and cleaner.
   * It also enables other components (if that was the case) to access the objects, pagination, filters and sorting.
   * In my opinion Vuex (sometimes) should be used in medium to large apps for avoiding to refactor from local state to Vuex later.
   * Vuex is not a silver bullet, and it's not always the right tool, but "Use Vuex before is too late".
   */
import { mapGetters } from 'vuex'
import loaders from '@/consts/loaders'

export default {
  name: 'ObjectList',
  data () {
    return {
      pollingInterval: null,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Description', sortable: false, value: 'description' },
        { text: 'Type', sortable: false, value: 'type' },
        { text: 'Available', sortable: false, value: 'available' }
      ]
    }
  },
  created () {
    // this.startFetchObjectPolling(10000)
  },
  methods: {
    /**
       * Sets the pagination, sorting, and filtering settings from the URL.
       */
    hydrateSettingsFromURL () {
      this.$store.dispatch('objectsList/applySettings', this.$route.query)
    },
    /**
       * Fetches the objects with the associated settings.
       */
    fetchObjects () {
      this.$store.dispatch('objectsList/fetchObjects')
        .catch(() => {
          // Show toast or text error in the table
        })
    },
    /**
       * Starts the interval for polling the objects data every X seconds.
       * @param {number} interval Interval in milliseconds
       */
    startFetchObjectPolling (interval) {
      this.pollingInterval = setInterval(() => {
        this.fetchObjects()
      }, interval) // TODO: let the user set the interval or get it from a config/ENV
    },
    /**
       * Pushes the new route with the updated params, triggers route watch and allows the user to go back and forward.
       * @param {string} name Input name
       * @param {string} value Input value
       */
    updateRoute (name, value) {
      // Create a new object from the router query and add a new property to it for the new/updated value
      // If the value is falsy, set it to undefined so vue-router will delete it automatically (can be improved)
      // https://github.com/vuejs/vue-router/pull/1568
      const query = Object.assign({}, this.$route.query, { [name]: value || undefined })

      this.$router.push({
        name: 'objects-list',
        query
      })
    },
    /**
       * Pushes the new page to the router.
       */
    updatePagination (value) {
      this.updateRoute('page', value)
    }
  },
  computed: {
    /**
       * v-model setters/getters for the inputs.
       * Could also use :value and @input on every input instead but in this case I don't want to pollute the view with logic.
       * Every input would need: @input="updateRoute('inputName', $event).
       * Its a trade-off between polluting the view with boilerplate logic vs. having larger setter/getters methods.
       **/
    filterSearch: {
      get () {
        return this.getFilters.byTerm.search
      },
      set (value) {
        this.updateRoute('search', value)
      }
    },
    filterType: {
      get () {
        return this.getFilters.byTerm.selected
      },
      set (value) {
        this.updateRoute('filterType', value)
      }
    },
    filterAvailable: {
      get () {
        return this.getFilters.byAvailability.selected
      },
      set (value) {
        this.updateRoute('available', value)
      }
    },
    sorting: {
      get () {
        return this.getSorting.selected
      },
      set (value) {
        this.updateRoute('sortBy', value)
      }
    },
    /** *
       * Indicates if there is a fetching operation at the moment.
       */
    isLoading () {
      return this.$wait.is(loaders.objectsList.FETCH_OBJECTS)
    },
    /**
       * Computes the objects structure for showing in the table.
       */
    objects () {
      if (!this.getObjects) {
        return []
      }

      return this.getObjects.map(object => {
        return {
          id: object.id,
          name: object.name,
          description: object.description,
          type: object.type,
          available: object.available ? 'Yes' : 'No'
        }
      })
    },
    ...mapGetters('objectsList', [
      'getObjects',
      'getPagination',
      'getFilters',
      'getSorting'
    ])
  },
  /**
     * When a new route is detected, the settings will be hydrated from the URL and the objects will be fetched.
     * The URL is taken as the single source of truth in this case.
     * beforeRouteUpdate hook could also be used, but there is no need to prevent navigation.
     */
  watch: {
    '$route': {
      immediate: true,
      handler () {
        this.hydrateSettingsFromURL()
        this.fetchObjects()
      }
    }
  },
  /**
     * When the component is about the be destroyed, clear the interval, avoiding memory leaks and reset the store.
     */
  beforeDestroy () {
    clearInterval(this.pollingInterval)
    this.$store.commit('objectsList/reset')
  }
}
</script>

<style lang="scss" scoped>

</style>
