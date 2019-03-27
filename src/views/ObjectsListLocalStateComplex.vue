<template>
  <v-layout justify-center>
    <table-paginated-with-inputs
            title="Objects list"
            itemTitle="Go to detail"
            :inputs="inputs"
            :headers="headers"
            :items="objects"
            :is-loading="isLoading"
            :current-page="currentPage"
            :total-pages="3"
            :itemRoute="{name: 'object-detail', itemIdentifier: 'id'}"
            @input="updateRoute"
            @page="updateRoute({name: 'page', value: $event})"
    >
      <!-- TODO: improve @page !-->

    </table-paginated-with-inputs>

  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import loaders from '@/consts/loaders'
import TablePaginatedWithInputs from '@/components/TablePaginatedWithInputs'

/***
 * This a test and experimental component/view in wich I had an idea for a big abstraction with table, pagination and
 * dynamic inputs.
 * The component API/props is too bloated, confusing and the component's responsabilities are too broad.
 * I decided to go for my first approach: the single Vuetify components + Vuex instead.
 * The full explanation is in ObjectsList.
 */
export default {
  name: 'ObjectList',
  components: { TablePaginatedWithInputs },
  data () {
    return {
      pollingInterval: null,
      inputs: {
        search: {
          name: 'search',
          type: 'text',
          label: 'Search filter',
          value: '',
          clearable: true
        },
        filterType: {
          name: 'filterType',
          type: 'select',
          label: 'Filter type',
          value: '',
          clearable: true,
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
          name: 'available',
          type: 'select',
          label: 'Available',
          value: '',
          clearable: true,
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
          name: 'sortBy',
          type: 'select',
          label: 'Sort by',
          value: '',
          clearable: true,
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
        }
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
       * Pushes the new route for allowing the user to go back and forward (browser history) and triggers route watch.
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
