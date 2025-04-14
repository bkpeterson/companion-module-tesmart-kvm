const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this
		let feedbacks = {}

		feedbacks['output'] = {
			type: 'boolean',
			name: 'Active output',
			description: 'Show feedback for active output',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output',
					default: '1',
					choices: this.CHOICES_OUTPUTS,
				},
			],
			style: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 255, 0),
			},
			callback: (feedback, bank) => {
				let opt = feedback.options
				if (opt.output == this.selectedOutput) {
					return true
				} else {
					return false
				}
			},
		}

		self.setFeedbackDefinitions(feedbacks);
	}
}