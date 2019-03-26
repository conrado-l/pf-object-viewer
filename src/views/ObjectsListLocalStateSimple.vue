<template>
  <v-layout justify-center>
    <v-card>
      <v-card-title class="headline">
        Objects List
      </v-card-title>
      <v-layout>
        <v-flex xs12 md6 mx-2>
          <v-text-field
                  name="search"
                  label="Search filter"
                  :value="search.value">
          </v-text-field>
          <v-select
                  name="search"
                  :value="filterType.value"
                  :options="filterType.options"
          >

          </v-select>
        </v-flex>
      </v-layout>
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

      <v-layout align-center justify-center my-2>
        <v-pagination
                py-2
                :value="currentPage"
                :total-visible="4"
                :length="3"
                :disabled="isLoading"
                @input="updateRoute({name: 'page', value: $event})"
                circle
        ></v-pagination>
      </v-layout>

    </v-card>

  </v-layout>
</template>

<script>
/***
   * This a test and experimental component/view in wich I used the single Vuetify components along local component state.
   * I decided to go for single Vuetify components + Vuex because the model management is much better and the code
   * is better organized and cleaner.
   * It also enables other components (if that was the case) to access the objects, pagination, filters and sorting.
   * In my opinion Vuex should be used in medium to large apps for avoiding to refactor from local state to Vuex later.
   * Vuex is not a silver bullet, and it's not always the right tool, but "Use Vuex before is too late".
   */
import { mapGetters } from 'vuex'
import loaders from '@/consts/loaders'

export default {
  name: 'ObjectList',
  data () {
    return {
      pollingInterval: null,
      search: {
        value: ''
      },
      filterType: {
        value: '',
        options: [
          {
            description: 'ID',
            value: 'id'
          },
          {
            description: 'Name',
            value: 'name'
          }
        ]
      },
      available: {
        value: '',
        options: [
          {
            description: 'Yes',
            value: 'yes'
          },
          {
            description: 'No',
            value: 'no'
          }
        ]
      },
      sortBy: {
        value: '',
        options: [
          {
            description: 'ID',
            value: 'id'
          },
          {
            description: 'Description',
            value: 'description'
          },
          {
            description: 'Type',
            value: 'type'
          },
          {
            description: 'Available',
            value: 'available'
          }
        ]
      },
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
      ],
      currentPage: 1,
      limit: 5
    }
  },
  created () {
    this.hydrateSettingsFromURL()
    // this.startFetchObjectPolling(10000)
  },
  methods: {
    /**
       * Sets the pagination, sorting, and filtering settings from the URL.
       */
    hydrateSettingsFromURL () {
      // TODO: set every input value to empty if there are no params

      const query = this.$route.query

      // Assign the value to the inputs
      Object.keys(query).forEach((key) => { // Object.Keys already checks for hasOwnProperty
        if (this.inputs.hasOwnProperty(key)) { // If the URL param is a defined input, update its value
          this.inputs[key].value = query[key]
        }
      })

      // Assign the current page value
      if (query.page) {
        this.currentPage = Number(query.page)
      }
    },
    /**
       * Fetches the objects with the associated settings.
       */
    fetchObjects () {
      const query = Object.assign({}, this.$route.query, { limit: this.limit, page: this.currentPage })

      this.$store.dispatch('objectsList/fetchObjects', query)
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
       * Pushes the new route with the updated param for allowing the user to go back and forward (browser history)
       * and triggers route watch.
       * @param {object} update Data
       * @param {string} update.name Input name
       * @param {string} update.value Input value
       */
    updateRoute ({ name, value }) {
      // TODO: fix undefined behaviors with selects
      const query = Object.assign({}, this.$route.query, { [name]: value })

      this.$router.push({
        name: 'objects-list',
        query
      })
    }
  },
  computed: {
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
      'getTotalPages'
    ])
  },
  /**
     * When a new route is detected, the settings will be hydrated from the URL, it will also fetch the objects.
     * The URL is taken as the single source of truth in this case.
     * beforeRouteUpdate hook could be used too, but there is no need to prevent navigation.
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
     * When the components is about the be destroyed, clear the interval, avoiding memory leaks, it will also reset the store.
     */
  beforeDestroy () {
    clearInterval(this.pollingInterval)
    this.$store.commit('objectsList/reset')
  }
}
</script>

<style lang="scss" scoped>

</style>
