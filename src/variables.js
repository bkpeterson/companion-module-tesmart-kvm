module.exports = {
	initVariables: function () {
		let self = this;
		let variables = []

		variables.push({
			name: `Active Output`,
			variableId: `active_output`,
		});

		self.setVariableDefinitions(variables);
	}
}