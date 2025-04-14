const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')

class tesmartInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
		})

		this.CHOICES_OUTPUTS = [];

		for (let i = 1; i <= 8; i++) {
			let channelObj = {}
			channelObj.id = i
			channelObj.label = i
			this.CHOICES_OUTPUTS.push(channelObj)
		}

		this.pollMixerTimer = undefined
		this.selectedOutput = 1
	}

	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.pollMixerTimer !== undefined) {
			clearInterval(this.pollMixerTimer)
			delete this.pollMixerTimer
		}
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		// polling is running and polling may have been de-selected by config change
		if (this.pollMixerTimer !== undefined) {
			clearInterval(this.pollMixerTimer)
			delete this.pollMixerTimer
		}

		this.config.polling_interval = this.config.polling_interval !== undefined ? this.config.polling_interval : 750
		this.config.port = this.config.port !== undefined ? this.config.port : 23
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.updateStatus(InstanceStatus.Connecting);

		this.initTCP()
		this.initPolling()
	}
}

runEntrypoint(tesmartInstance, UpgradeScripts)