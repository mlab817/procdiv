<template>
	<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
		<q-card class="bg-blue text-white">
			<q-card-section class="text-h6 q-pb-none">
				<q-item>
					<q-item-section avatar>
						<q-icon color="white" name="library_add_check" style="font-size: 2em;"/>
					</q-item-section>

					<q-item-section>
						<div class="text-h6">Tasks</div>
						<div class="text-subtitle2">Your to-do list</div>
					</q-item-section>
				</q-item>
			</q-card-section>
			<q-card-section class="">
				<span>
					<q-list bordered class="bg-white text-black">
						<q-item v-for="todo in todos" :key="todo.id">
							<q-item-section avatar>
								<q-checkbox
										:id="todo.id"
										v-model="todo.completed"
										color="primary"
								/>
							</q-item-section>
							<q-item-section class="text-body1 text-wrap"
															:style="todo.completed?{'textDecoration':'line-through'}:{}">

								<q-item-label>{{ todo.todo}}</q-item-label>
								<q-item-label caption class="text-grey-8">{{ todo.todo_desc}}</q-item-label>
							</q-item-section>
							<q-item-section side>
								<q-btn icon="chat" round flat></q-btn>
							</q-item-section>
						</q-item>
					</q-list>
				</span>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
	import {TASKS} from '../../graphql/models'

	export default {
		name: 'TodoList',
		apollo: {
			tasks: {
				query: TASKS
			}
		},
		data() {
			return {
				tasks: [],
				todos: [
					{
						id: 1,
						completed: false,
						todo: 'Task Item 1',
						todo_desc: 'Task Item 1 Desc'
					},
					{
						id: 2,
						completed: false,
						todo: 'Task Item 2',
						todo_desc: 'Task Item 2 Desc'
					},
					{
						id: 3,
						completed: false,
						todo: 'Task Item 3',
						todo_desc: 'Task Item 3 Desc'
					},
					{
						id: 4,
						completed: false,
						todo: 'Task Item 4',
						todo_desc: 'Task Item 4 Desc'
					},
					{
						id: 5,
						completed: false,
						todo: 'Task Item 5',
						todo_desc: 'Task Item 5 Desc'
					},
					{
						id: 6,
						completed: false,
						todo: 'Task Item 6',
						todo_desc: 'Task Item 6 Desc'
					},
					{
						id: 7,
						completed: false,
						todo: 'Task Item 7',
						todo_desc: 'Task Item 7 Desc'
					}
				]
			}
		}
	}
</script>
