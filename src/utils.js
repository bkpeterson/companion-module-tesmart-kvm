const { InstanceStatus, TCPHelper } = require('@companion-module/base');

module.exports = {
	initTCP: function() {
		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('error', (err) => {
				this.log('error', 'Network error: ' + err.message)
				this.updateStatus(InstanceStatus.ConnectionFailure);
			})

			this.socket.on('connect', () => {
				this.updateStatus(InstanceStatus.Ok);
			})

			this.socket.on('data', (receivebuffer) => {
				this.processResponse(receivebuffer)
			})
		}
	},

	processResponse: function(receivebuffer) {
		let index = 0
		if (this.config.log_responses) {
			this.log('info', 'Response: ' + receivebuffer)
		}
		if (this.config.polled_data) {
			// convert buffer to string and then into lines, removing blank lines
			let response = receivebuffer.toString(16);
			if(response.startswith("aabb0311")) {
				this.updateRoute(parseInt(response.substring(9,10)));
			}

			this.checkFeedbacks()
		}
	},

	sendCommmand: function(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				const byteArr = ArrayBuffer.from(cmd, 'hex');

				this.socket.send(byteArr + '\r\n')
			} else {
				this.log('debug', 'Socket not connected :(');
			}
		}
	},

	initPolling: function() {
		// read switch state, possible changes using controls on the unit or web interface
		if (this.pollMixerTimer === undefined) {
			this.pollMixerTimer = setInterval(() => {
				this.sendCommmand('aabb031000ee')
			}, this.config.poll_interval)
		}
	},

	updateRoute: function(output) {
		this.selectedOutput = output;

		let variableObj = {};
		variableObj['active_output'] = output;
		this.setVariableValues(variableObj);
	}
}