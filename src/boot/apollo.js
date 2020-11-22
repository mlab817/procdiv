// Basic Installation: https://vue-apollo.netlify.com/guide/installation.html#_1-apollo-client
// Pusher Integration: https://medium.com/sjk5766/laravel-graphql-subscription-vue-apollo-or-nuxt-338108ffb1cb

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink  } from "apollo-link";
import VueApollo from "vue-apollo";
import { LocalStorage } from "quasar";
import PusherLink from './pusher';
import Pusher from "pusher-js";

// Pusher configuration
const PUSHER_API_KEY = process.env.PUSHER_API_KEY;
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER;
const auth_token = LocalStorage.getItem("token");

const uri = process.env.GRAPHQL_ENDPOINT

const pusherLink = new PusherLink({
	// Enter your API_KEY and CLUSTER.
	pusher: new Pusher(PUSHER_API_KEY, {
		cluster: PUSHER_CLUSTER,
		forceTLS: true,
		authEndpoint: `${uri}/subscriptions/auth`,
		auth: {
			headers: {
				authorization: auth_token ? `Bearer ${auth_token}` : null
			}
		}
	})
});

const httpLink = new HttpLink({
	uri: uri
});

const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const token = LocalStorage.getItem("token");
	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : null
		}
	});
	
	return forward(operation);
});

const link = ApolloLink.from([pusherLink, httpLink]);

const apolloClient = new ApolloClient({
	// link: authMiddleware.concat(httpLink),
	link: authMiddleware.concat(link), // with pusher
	cache,
	connectToDevTools: true
});

export const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
	errorHandler({ graphQLErrors, networkError }) {
		if (graphQLErrors) {
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(
					`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
				)
			);
		}
		if (networkError) {
			console.log(`[Network error]: ${networkError}`);
		}
	}
});

export default ({ app, Vue }) => {
	Vue.use(VueApollo);
	app.apolloProvider = apolloProvider;
};
