<template>
  <v-flex xs12 sm6 data-app>
    <v-card>
      <v-card-title class="headline">
        {{title}}
        <v-spacer></v-spacer>
        <v-layout>
          <template v-for="input in inputs">
            <v-flex xs12 md6 mx-2 :key="input.name">
              <component :is="getDynamicComponent(input.type)"
                         :value="input.value"
                         :label="input.label"
                         v-bind="getDynamicAttributes(input)"
                         :clearable="input.clearable"
                         @input="emitInput(input.name, $event)"
                         :data-test="`input-${input.name}`"
              ></component>
            </v-flex>
          </template>
        </v-layout>
      </v-card-title>
      <v-data-table
              :headers="headers"
              :items="items"
              :loading="isLoading"
              disable-initial-sort
              hide-actions

      >
        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
        <template v-slot:items="items">
          <router-link tag="tr"
                       v-bind="getDynamicItemRoute(items.item)"
                       :title="itemTitle"
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
              py-2
              :value="currentPage"
              :total-visible="4"
              :length="totalPages"
              :disabled="isLoading"
              @input="$emit('page', $event)"
              circle
      ></v-pagination>
    </v-layout>
  </v-flex>
</template>

<script>
import { VTextField, VSelect } from 'vuetify/lib'
import inputTypes from '@/consts/input-types'

const componentMapping = {
  [inputTypes.TEXT]: VTextField,
  [inputTypes.SELECT]: VSelect
}

export default {
  name: 'TablePaginatedWithInputs',
  components: { VTextField, VSelect },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Title'
    },
    itemTitle: {
      type: String,
      required: true,
      default: 'Go to'
    },
    headers: {
      type: Array,
      required: true,
      default: () => []
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    inputs: {
      type: Object,
      required: false,
      default: () => []
    },
    itemRoute: {
      type: Object,
      required: false,
      default: null
    },
    currentPage: {
      type: Number,
      required: true,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true,
      default: 1
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    /**
       * Emits an event to the parent with a name and value.
       * @param {string} name
       * @param {string} value
       */
    emitInput (name, value) {
      this.$emit('input', { name, value })
    },
    /**
       * Returns the component type according to the mapping.
       * @param {string} inputType
       * @returns {object}
       */
    getDynamicComponent (inputType) {
      return componentMapping[inputType]
    },
    /**
       * Adds attributes dynamically according to the input type.
       * @param input
       * @returns {object}
       */
    getDynamicAttributes (input) {
      if (input.type === inputTypes.SELECT) {
        return {
          items: input.options || [],
          'item-text': 'description',
          'item-value': 'value'
        }
      } else {
        return {}
      }
    },
    /**
       * Returns the route associated with an item.
       * @param {object} item
       * @returns {object}
       * TODO: improve readability of this function
       */
    getDynamicItemRoute (item) {
      if (!this.itemRoute) {
        return { to: {} }
      }

      // Generate the param object. For example, if itemIdentifier is 'id', the param object result will be: {id: 5}
      const param = { [this.itemRoute.itemIdentifier]: item[this.itemRoute.itemIdentifier] }

      return {
        to: {
          name: this.itemRoute.name,
          params: {
            ...param
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
