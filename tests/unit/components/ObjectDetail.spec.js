import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import ObjectDetail from '@/views/ObjectDetail'
import Vuetify from 'vuetify'
import { Store } from 'vuex-mock-store'
import { unixtimeToShortDate } from '@/utils/dates'

describe('ObjectDetail.vue', () => {
  const mockupObject = {
    available: false,
    creation_date: 1553276681,
    description: 'An amazing blue shirt',
    id: '125',
    name: 'Shirt',
    type: 'clothing'
  }

  const store = new Store({
    state: {
      objectDetail: {
        object: mockupObject
      }
    },
    getters: {
      'objectDetail/getObject': mockupObject
    }
  })

  const factoryShallowMount = (props, loading = false) => {
    return shallowMount(ObjectDetail, {
      propsData: {
        id: mockupObject.id,
        ...props
      },
      mocks: {
        $store: store,
        $wait: {
          is: () => {
            return loading
          }
        }
      }
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
    const wrapper = factoryShallowMount()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should set error to true if the object id route param does not exists', () => {
    const wrapper = factoryShallowMount({ id: '' })

    expect(wrapper.vm.error).toBe(true)
  })

  it('should set error to false if the object id route param exists', () => {
    const wrapper = factoryShallowMount()

    expect(wrapper.vm.error).toBe(false)
  })

  it('should dispatch fetchObject action with the object id as payload', () => {
    factoryShallowMount()

    expect(store.dispatch).toHaveBeenCalledWith('objectDetail/fetchObject', mockupObject.id)
  })

  it('should return an empty array if getObject getter is not set yet from the objectDetail computed property', () => {
    const wrapper = factoryShallowMount()
    store.getters['objectDetail/getObject'] = null

    expect(wrapper.vm.objectDetail).toEqual([])
  })

  it('should return an array with the correct object values and descriptions from the objectDetail computed property', () => {
    const wrapper = factoryShallowMount()
    const getObjectGetter = store.getters['objectDetail/getObject']

    expect(wrapper.vm.objectDetail).toEqual([
      { description: 'ID', value: getObjectGetter.id },
      { description: 'Name', value: getObjectGetter.name },
      { description: 'Description', value: getObjectGetter.description },
      { description: 'Type', value: getObjectGetter.type },
      { description: 'Available', value: 'No' },
      { description: 'Creation Date', value: unixtimeToShortDate(getObjectGetter.creation_date) }
    ])
  })

  it('should set the isLoading computed property to true on loading', () => {
    const wrapper = factoryShallowMount(null, true)

    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('should dispatch fetchObject action and set error to true if the action fails', () => {
    // store.dispatch = jest.fn().mockRejectedValue('data')
    //
    // const wrapper = factoryShallowMount()
    // wrapper.vm.$nextTick(() => {
    //   expect(wrapper.vm.error).toBe(true)
    // })
  })
})
