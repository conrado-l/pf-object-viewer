<template>
  <v-flex xs12 sm5>
    <v-card pa-3>
      <v-card-title class="headline" data-test="text-title"> {{title}}</v-card-title>
      <v-flex>
        <v-progress-linear v-show="isLoading" :indeterminate="true"></v-progress-linear>
      </v-flex>
      <v-layout>
        <v-flex xs12 md6 mx-2>
          <v-text-field
                  :value="filters.search"
                  @input="emitInput('search', e.target.value)"
                  append-icon="search"
                  label="Filter search"
                  clearable
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md6 mx-2>
          <v-select
                  :value="filters.filterType.selected"
                  :items="filters.filterType.options"
                  @input="emitInput('filterType', e.target.value)"
                  item-text="description"
                  item-value="value"
                  label="Filter by">
          </v-select>
        </v-flex>
      </v-layout>

      <v-layout>

        <v-flex xs12 md6 mx-2>
          <v-select
                  :value="filters.available.selected"
                  :items="filters.available.options"
                  @input="emitInput('available', e.target.value)"
                  item-text="description"
                  item-value="value"
                  label="Available">
          </v-select>
        </v-flex>

        <v-flex xs12 sm6 mx-2>
          <v-select
                  :value="sorting.selected"
                  :items="sorting.options"
                  @input="emitInput('sortBy', e.target.value)"
                  item-text="description"
                  item-value="value"
                  label="Sort by">
          </v-select>
        </v-flex>

      </v-layout>
      <v-divider></v-divider>
      <v-list two-line>
        <slide-x-right-transition group>
          <template v-for="item in items">

            <v-list-tile
                    :key="item.id"
                    :to="{name: 'object-detail', params: {id: item.id}}"
                    title="Go to detail"
            >

              <v-list-tile-content>
                <v-list-tile-title> {{ item.name}}</v-list-tile-title>
                <v-list-tile-sub-title> {{ item.description}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider :key="`divider${item.id}`"></v-divider>
          </template>
        </slide-x-right-transition>

        <v-card-text v-if="!items.length && !isLoading">
          <p class="text-sm-center">
            No objects were found.
          </p>
        </v-card-text>
      </v-list>
      <v-flex text-xs-center py-1>
        <v-pagination
                py-2
                v-model="currentPage"
                :total-visible="4"
                :length="totalPages"
                :disabled="isLoading"
                circle
        ></v-pagination>
      </v-flex>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'ListFilterPaginated',
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
    filters: {
      type: Array,
      required: false,
      default: () => []
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
  methods: {
    emitInput (inputName, value) {
      this.$emit('input', { [inputName]: value })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
