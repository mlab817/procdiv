<template>
	<q-select
    :value="model"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="stringOptions"
    @filter="filterFn"
    @input-value="setModel"
    hide-dropdown-icon
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
	export default {
		name: 'Autocomplete',
		props: ['value','options'],
		computed: {
			model() {
				return this.$props.value
			}
		},
		data() {
			return {
				stringOptions: []
			}
		},
		methods: {
			filterFn(val, update, abort) {
				update(() => {
					if (val !== '') {
						const needle = val.toLowerCase()	
						this.stringOptions = this.options.filter(v => v.toLowerCase().indexOf(needle) > -1)
					}
					this.stringOptions = this.options
				})
			},
			setModel(e) {
				this.$emit('input', e)
			}
		}
	}
</script>