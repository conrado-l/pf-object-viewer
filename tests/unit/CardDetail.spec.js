import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import CardDetail from '@/components/CardDetail'
import Vuetify from 'vuetify'

describe('CardDetail.vue', () => {
  let wrapper

  beforeEach(() => {
    Vue.use(Vuetify) // TODO: try to use localVue instance (Vuetify issue)
    wrapper = shallowMount(CardDetail, {
      propsData: {
        title: 'Title',
        items: [],
        error: false,
        errorMessage: 'Error message',
        isLoading: false
      }
    })
  })

  it('should render the component correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render the title', () => {
    wrapper.setProps({ title: 'The Title' })

    expect(wrapper.find('[data-test="text-title"]').text()).toBe('The Title')
  })

  it('should render the error text on error', () => {
    wrapper.setProps({ error: true, errorMessage: 'A prop error has occurred.' })

    expect(wrapper.find('[data-test="text-error-message"]').text()).toBe('A prop error has occurred.')
  })

  it('should render the loader on loading', () => {
    wrapper.setProps({ isLoading: true })

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
  })

  it('should render the items', () => {
    const mockupItems = [
      { description: 'Description1', value: 'value1' },
      { description: 'Description2', value: 'value2' }
    ]

    wrapper.setProps({ items: mockupItems })

    wrapper.findAll('[data-test="text-item"]').wrappers.forEach((textItem, index) => {
      expect(textItem.text()).toBe(`${mockupItems[index].description}: ${mockupItems[index].value}`)
    })
  })
})
