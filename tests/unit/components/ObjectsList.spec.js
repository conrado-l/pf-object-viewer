import Vue from 'vue'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ObjectsList from '@/views/ObjectsList'
import Vuetify from 'vuetify'
import { Store } from 'vuex-mock-store'

describe('ObjectsList.vue', () => {
  const mockupObjects = [
    {
      available: false,
      creation_date: 1553276681,
      description: 'An amazing blue shirt',
      id: '1',
      name: 'Shirt',
      type: 'clothing'
    },
    {
      available: true,
      creation_date: 1553274681,
      description: 'An amazing red shirt',
      id: '2',
      name: 'Shirt',
      type: 'clothing'
    }
  ]

  const store = new Store({
    state: {
      objectsList: { // Required for vuex-mock-store
        objects: mockupObjects
      }
    },
    getters: {
      'objectsList/getObjects': mockupObjects,
      'objectsList/getFilters': {
        byTerm: {
          search: 'pf',
          selected: 'id',
          options: ['id', 'name', 'description']
        },
        byAvailability: {
          selected: 'yes',
          options: []
        }
      },
      'objectsList/getPagination': '',
      'objectsList/getSorting': {
        selected: 'id',
        options: []
      },
      'objectsList/getPollingInterval': 10000
    }
  })

  const factoryMount = ({ route, router }) => {
    return mount(ObjectsList, {
      stubs: { RouterLink: RouterLinkStub },
      mocks: {
        $store: store,
        $wait: {
          is: () => {
            return false
          }
        },
        $route: {
          ...route
        },
        $router: {
          ...router
        },
        startFetchObjectPolling: () => {}
      },
      // Fix/workaround for Vuetify's warning about data-app
      // https://forum.vuejs.org/t/vuetify-data-app-true-and-problems-rendering-v-dialog-in-unit-tests/27495/9
      attachToDocument: true
    })
  }

  beforeEach(() => {
    Vue.use(Vuetify) // Vuetify issue with createLocalVue: https://github.com/vuetifyjs/vuetify/issues/4964
    store.dispatch = jest.fn().mockResolvedValue('data') // dispatch has to return a promise
  })

  afterEach(() => {
    store.reset()
  })

  it('should render the component correctly', () => {
    const wrapper = factoryMount({})

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should call the action for hydrating with settings from the URL correctly', () => {
    const route = {
      query: {
        page: 1,
        search: 'pf',
        filterBy: 'name,id',
        sortBy: 'id',
        available: 'yes'
      }
    }

    const parsedSettings = {
      page: 1,
      search: 'pf',
      filterBy: ['name', 'id'],
      sortBy: 'id',
      available: 'yes'
    }

    factoryMount({ route })

    expect(store.dispatch).toHaveBeenNthCalledWith(1, 'objectsList/applySettings', parsedSettings)
  })

  it('should call the action for fetching the objects', () => {
    factoryMount({})

    expect(store.dispatch).toHaveBeenNthCalledWith(2, 'objectsList/fetchObjects')
  })

  it('should render the input values from the getters correctly', () => { // TODO: fix v-select not getting value
    const wrapper = factoryMount({})

    expect(wrapper.find('[data-test="input-search"]').element.value).toBe('pf')
    // expect(wrapper.find('[data-test="input-filter-type"]').element.value).toBe('name')
    // expect(wrapper.find('[data-test="input-filter-availability"]').element.value).toBe('yes')
    // expect(wrapper.find('[data-test="input-sorting"]').element.value).toBe('id')
  })

  it('should call updateRoute with the correct params on input', () => {
    const wrapper = factoryMount({})
    const updateRoute = jest.fn()
    const debounceSearch = (searchValue) => { // Mock and call updateRoute immediately (alt: jest.mock('debounce'))
      updateRoute('search', searchValue)
    }

    wrapper.setMethods({ updateRoute, debounceSearch })

    // wrapper.trigger() doesn't allow {target: {value: 'value'}}
    // https://vue-test-utils.vuejs.org/api/wrapper/trigger.html
    // TODO: wrapper.setValue('val') is not properly emmiting 'input', investigate and refactor

    wrapper.find('[data-test="input-search"]').element.value = 'fp'
    wrapper.find('[data-test="input-search"]').trigger('input')

    wrapper.find('[data-test="input-filter-type"]').element.value = 'name'
    wrapper.find('[data-test="input-filter-type"]').trigger('input')

    wrapper.find('[data-test="input-filter-availability"]').element.value = 'no'
    wrapper.find('[data-test="input-filter-availability"]').trigger('input')

    wrapper.find('[data-test="input-sorting"]').element.value = 'name'
    wrapper.find('[data-test="input-sorting"]').trigger('input')

    expect(updateRoute).toHaveBeenNthCalledWith(1, 'search', 'fp')
    expect(updateRoute).toHaveBeenNthCalledWith(2, 'filterBy', 'name')
    expect(updateRoute).toHaveBeenNthCalledWith(3, 'available', 'no')
    expect(updateRoute).toHaveBeenNthCalledWith(4, 'sortBy', 'name')
  })

  it('should update the router correctly when input updates', () => {
    const router = {
      push: jest.fn()
    }

    const route = {
      query: {
        page: 1,
        search: 'pf',
        filterBy: 'name'
      }
    }

    const wrapper = factoryMount({ route, router })

    wrapper.vm.updateRoute('search', 'updatedPf')

    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith({
      name: 'objects-list',
      query: {
        filterBy: 'name',
        page: 1,
        search: 'updatedPf'
      }
    })
  })

  it('should delete the route param when a single value input is falsy/empty', () => {
    const router = {
      push: jest.fn()
    }

    const route = {
      query: {
        page: 1,
        search: 'pf',
        filterBy: 'name'
      }
    }

    const wrapper = factoryMount({ route, router })

    wrapper.vm.updateRoute('search', '')

    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith({
      name: 'objects-list',
      query: {
        filterBy: 'name',
        page: 1
      }
    })
  })

  it('should delete the route param when a multiple value input is falsy/empty', () => {
    const router = {
      push: jest.fn()
    }

    const route = {
      query: {
        page: 1,
        search: 'pf',
        filterBy: 'name'
      }
    }

    const wrapper = factoryMount({ route, router })

    wrapper.vm.updateRoute('filterBy', [])

    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith({
      name: 'objects-list',
      query: {
        page: 1,
        search: 'pf'
      }
    })
  })

  it('should call updateRoute with the correct params when pagination updates', () => {
    const updateRoute = jest.fn()
    const wrapper = factoryMount({})

    wrapper.setMethods({ updateRoute })

    wrapper.find('[data-test="input-pagination"]').vm.$emit('input', 3) // TODO: should trigger by click

    expect(updateRoute).toHaveBeenCalledTimes(1)
    expect(updateRoute).toHaveBeenCalledWith('page', 3)
  })

  it('should return the objects array mapped for the table from the getObjects getter', () => {
    const wrapper = factoryMount({})

    expect(wrapper.vm.objects).toEqual([
      {
        'available': 'No',
        'description': 'An amazing blue shirt',
        'id': '1',
        'name': 'Shirt',
        'type': 'clothing'
      },
      {
        'available': 'Yes',
        'description': 'An amazing red shirt',
        'id': '2',
        'name': 'Shirt',
        'type': 'clothing'
      }
    ])
  })

  it('should return an empty array if getObjects getter is null', () => {
    const wrapper = factoryMount({})
    store.getters['objectsList/getObjects'] = null

    expect(wrapper.vm.objects).toEqual([])
  })

  it('should render the table items router links correctly', () => {
    const wrapper = factoryMount({})

    wrapper.findAll('[data-test="item-link"]').wrappers.forEach((itemLink, index) => { // RouterLinkStub
      expect(itemLink.props().to.name).toBe('object-detail')
      expect(itemLink.props().to.params.id).toBe(wrapper.vm.objects[index].id)
    })
  })

  it('should render the table item objects ordered from the objects computed property correctly', () => {
    const wrapper = factoryMount({})

    const itemLinks = wrapper.findAll('[data-test="item-link"]')

    itemLinks.wrappers.forEach((itemLink, itemLinkIndex) => {
      const itemCells = itemLink.findAll('[data-test="item-cell"]').wrappers

      expect(itemCells[0].text()).toBe(wrapper.vm.objects[itemLinkIndex].id)
      expect(itemCells[1].text()).toBe(wrapper.vm.objects[itemLinkIndex].name)
      expect(itemCells[2].text()).toBe(wrapper.vm.objects[itemLinkIndex].description)
      expect(itemCells[3].text()).toBe(wrapper.vm.objects[itemLinkIndex].type)
      expect(itemCells[4].text()).toBe(wrapper.vm.objects[itemLinkIndex].available)
    })
  })

  // TODO: test polling interval fetching objects
})
