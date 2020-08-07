import Vue from 'vue'
import VueGapi from 'vue-gapi'

const CLIENT_ID = '64885691054-f7g070b3vjc6kanjk0pi6cm2t6lg4e8q.apps.googleusercontent.com'
const API_KEY = 'AIzaSyChJjS1z-miSfJbBz74epjb4kEBVE4USa4'
const DISCOVERY_DOCS = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'

const config = {
	apiKey: API_KEY,
	clientId: CLIENT_ID,
	discoveryDocs: [DISCOVERY_DOCS],
	scope: 'https://www.googleapis.com/auth/calendar.readonly',
	refreshToken: true
}

export default async ({ Vue }) => {	
	Vue.use(VueGapi, config)	
}
