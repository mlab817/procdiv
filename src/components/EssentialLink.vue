<template>
  <div v-if="show">
    <q-item
      clickable
      tag="a"
      :to="link"
      exact
    >
      <q-item-section
        v-if="icon"
        avatar
      >
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>
          {{ caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    role() {
      return this.$store.getters['auth/role']
    },

    show() {
      if (this.title === 'Manage Options' && this.role !== 'admin') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>