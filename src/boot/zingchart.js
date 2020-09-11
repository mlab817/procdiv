// import something here
import 'zingchart/es6'
import Vue from 'vue'
import zingchartVue from 'zingchart-vue'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ Vue }) => {
  Vue.component('zingchart', zingchartVue);
}
