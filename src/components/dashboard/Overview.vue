<template>
	<q-card class="bg-transparent no-shadow no-border">
		<q-card-section class="q-pa-none">
			<div class="row q-col-gutter-sm ">
				<div class="col-md-3 col-sm-12 col-xs-12">
					<q-card>
						<q-item style="background-color: #546bfa" class="q-pa-none">
							<q-item-section class="q-pa-md q-ml-none  text-white">
								<q-item-label class="text-white text-h6 text-weight-bolder">$ 20k</q-item-label>
								<q-item-label>Monthly Income</q-item-label>
							</q-item-section>
							<q-item-section side class="q-mr-md text-white">
								<q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
							</q-item-section>
						</q-item>
					</q-card>
				</div>
				<div class="col-md-3 col-sm-12 col-xs-12">
					<q-card>
						<q-item style="background-color: #3a9688" class="q-pa-none">
							<q-item-section class=" q-pa-md q-ml-none  text-white">
								<q-item-label class="text-white text-h6 text-weight-bolder">20</q-item-label>
								<q-item-label>Weekly Sales</q-item-label>
							</q-item-section>
							<q-item-section side class="q-mr-md text-white">
								<q-icon name="fas fa-chart-bar" color="white" size="44px"></q-icon>
							</q-item-section>
						</q-item>
					</q-card>
				</div>
				<div class="col-md-3 col-sm-12 col-xs-12">
					<q-card>
						<q-item style="background-color: #7cb342" class="q-pa-none ">
							<q-item-section class=" q-pa-md q-ml-none  text-white">
								<q-item-label class="text-white text-h6 text-weight-bolder">321</q-item-label>
								<q-item-label>New Customers</q-item-label>
							</q-item-section>
							<q-item-section side class="q-mr-md text-white">
								<q-icon name="fas fa-chart-line" color="white" size="44px"></q-icon>
							</q-item-section>
						</q-item>
					</q-card>
				</div>
				<div class="col-md-3 col-sm-12 col-xs-12">
					<q-card>
						<q-item style="background-color: #f88c2b" class="q-pa-none">
							<q-item-section class=" q-pa-md q-ml-none  text-white">
								<q-item-label class="text-white text-h6 text-weight-bolder">82</q-item-label>
								<q-item-label>Active Users</q-item-label>
							</q-item-section>
							<q-item-section side class="q-mr-md text-white">
								<q-icon name="person" color="white" size="44px"></q-icon>
							</q-item-section>
						</q-item>
					</q-card>
				</div>
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
	export default {
		name: 'Overview',
		data() {
			return {

			}
		}
	}
</script>
