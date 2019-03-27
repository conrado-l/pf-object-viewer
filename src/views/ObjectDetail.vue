<template>
  <v-layout>
    <v-flex xs12 md4 offset-md4>
      <card-detail
              title="Object detail"
              :items="objectDetail"
              :isLoading="isLoading"
              :error="error"
              error-message="An error has occurred with the object detail."
      >
      </card-detail>
      <v-flex v-if="error" text-xs-center>
        <v-btn color="info" @click="fetchObjectDetail">Retry</v-btn>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
/**
 * Fetches an object's detail data by ID and renders it in a card detail.
 */
import { mapGetters } from 'vuex'
import loaders from '@/consts/loaders'
import CardDetail from '@/components/CardDetail'
import { unixtimeToShortDate } from '@/utils/dates'

export default {
  name: 'ObjectDetail',
  components: { CardDetail },
  props: {
    // Passed from the router (props: true)
    // Other approach would be to create a variable "id" in data () and assign this.$route.params.id to it
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      error: false
    }
  },
  methods: {
    /**
     * Fetches the object detail with the associated ID.
     */
    fetchObjectDetail () {
      this.$store.dispatch('objectDetail/fetchObject', this.id)
        .then(() => {
          this.error = false // Set it to false in case it failed and the user clicks the Retry button
        })
        .catch(() => {
          this.error = true
        })
    }
  },
  created () {
    // No ID was found in the URL
    if (!this.id) {
      this.error = true
      return
    }

    this.fetchObjectDetail()
  },
  computed: {
    /**
     * Generates the object detail with the associated description label.
     * @returns {object}
     * Consideration: the server could also send the label but i18n should be server-side then.
     */
    objectDetail () {
      if (!this.getObject) {
        return []
      }

      return [
        { description: 'ID', value: this.getObject.id },
        { description: 'Name', value: this.getObject.name },
        { description: 'Description', value: this.getObject.description },
        { description: 'Type', value: this.getObject.type },
        { description: 'Available', value: this.getObject.available ? 'Yes' : 'No' },
        { description: 'Creation Date', value: unixtimeToShortDate(this.getObject.creation_date) }
      ]
    },
    /**
     * Indicates if there is a fetching operation at the moment.
     * @returns {boolean}
     */
    isLoading () {
      return this.$wait.is(loaders.objectDetail.FETCH_OBJECT_DETAIL)
    },
    ...mapGetters('objectDetail', [
      'getObject'
    ])
  },
  /**
   * Resets the store when the component is about the be destroyed to avoid showing old data when fetching new one.
   */
  beforeDestroy () {
    this.$store.commit('objectDetail/reset')
  }
}
</script>

<style lang="scss" scoped>

</style>
