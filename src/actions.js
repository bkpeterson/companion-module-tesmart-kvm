module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};
		
		actions.switch_output = {
			name: 'Switch Output',
			options: [
				{
					type: 'dropdown',
					label: 'Output Port',
					id: 'output',
					default: '1',
					choices: self.CHOICES_OUTPUTS,
				},
			],
			callback: function (action) {
				self.sendCommmand(
					'aabb03010' + action.options.output.toString() + 'ee'
				)
				self.checkFeedbacks();
			}
		};
		
		actions.buzzerON = {
			name: 'Buzzer On',
			options: [],
			callback: function (action) {
				self.sendCommmand('aabb030201ee')
			}
		};
		
		actions.buzzerOFF = {
			name: 'Buzzer Off',
			options: [],
			callback: function (action) {
				self.sendCommmand('aabb030200ee')
			}
		};

		self.setActionDefinitions(actions);
	}
}