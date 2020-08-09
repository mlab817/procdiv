// import something here
import JsonExcel from 'vue-json-excel'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default ({ Vue }) => {
  Vue.component('downloadExcel', JsonExcel)
}
