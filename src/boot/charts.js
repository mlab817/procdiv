// import something here
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

export default ( { Vue } ) => {
  Vue.use(Chartkick.use(Chart))
}
