import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import assignment from './assignment'
import auth from './auth'
import document from './document'
import enduser from './enduser'
import notification from './notification'
import opening from './opening'
import pras from './pras'
import staff from './staff'
import task from './task'
import user from './user'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      assignment,
      auth,
      document,
      enduser,
      notification,
      opening,
      pras,
      staff,
      task,
      user
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
