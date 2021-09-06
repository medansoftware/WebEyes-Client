import '../css/chat.css';
import io from 'socket.io-client';

import Identification from '../helpers/Identification';
import Cookies from '../helpers/Cookies';

export default class WebEyes {

	constructor(config) {
		this.init(config);
	}

	init(config) {
		this.config = {
			ID: 'DEMO',
			TYPE: 'GUEST',
			TITLE: 'Customer Support',
			CHAT_API: false,
			NOTIFICATION_API: false
		};

		if (typeof config == 'object') {
			this.config = Object.assign(this.config, config);
		}

		if (this.config.SERVER !== undefined) {
			this.socket = io(this.config.SERVER, { path: '/webeyes', transports: ['websocket', 'polling'] });
		} else {
			this.socket = io('http://'+window.location.hostname+':8080', { path: '/webeyes', transports: ['websocket', 'polling'] });
		}
	}

	drawChat() {
		var $chatbox = $('.chatbox');
		var chatbox = 
		'<div class="chatbox chatbox--tray chatbox--empty">'+
			'<div class="chatbox__title">'+
				'<h5><a href="#">'+this.config.TITLE+'</a></h5>'+
				'<button class="chatbox__title__tray"><span></span></button>'+
				'<button class="chatbox__title__close">'+
					'<span>'+
						'<svg viewBox="0 0 12 12" width="12px" height="12px">'+
							'<line stroke="#FFFFFF" x1="11.75" y1="0.25" x2="0.25" y2="11.75"></line>'+
							'<line stroke="#FFFFFF" x1="11.75" y1="11.75" x2="0.25" y2="0.25"></line>'+
						'</svg>'+
					'</span>'+
				'</button>'+
			'</div>'+
			'<div class="chatbox__body"></div>'+
			'<form class="chatbox__credentials">'+
			'</form>'+
			'<input type="text" class="chatbox__message" placeholder="Tuliskan sesuatu">'+
		'</div>';

		$chatbox.remove();
		document.body.innerHTML = document.body.innerHTML + chatbox;
	}

	initChat() {
		var chat_room = JSON.parse(localStorage.getItem('chat_room'));
		(function($) {
			var $chatbox = $('.chatbox');
			var $chatboxTitle = $('.chatbox__title');
			var $chatboxTitleClose = $('.chatbox__title__close');
			var $chatboxCredentials = $('.chatbox__credentials');
			var $chatboxBody = $('.chatbox__body');
			var $chatboxMessage = $('.chatbox__message');

			// ChatBox Toggle Show/Hide
			$chatboxTitle.on('click', function() {
				$chatbox.toggleClass('chatbox--tray');
			});

			// ChatBox Transition End
			$chatbox.on('transitionend', function() {
				if ($chatbox.hasClass('chatbox--closed')) {
					$chatbox.remove();
				}
			});

			// ChatBox Close
			$chatboxTitleClose.on('click', function(e) {
				e.stopPropagation();
				$chatbox.addClass('chatbox--closed');
			});

			// ChatBox Submit Form
			$chatboxCredentials.on('submit', function(e) {
				e.preventDefault();
				$chatbox.removeClass('chatbox--empty');
				$.ajax({
					url: '',
					type: 'POST',
					dataType: 'JSON',
					data: {},
					success: function(data) { },
					error: function(error) { }
				});
			});
		})(jQuery);
	}

	handleGuest(guestID) { }

	sendMessage(replyTo) { }

	onMessage() { }

	run() {

		var _this = this;
		Identification.get_device_id(device_id => {
			var identification = {
				ID: _this.config.ID,
				TYPE: _this.config.TYPE,
				hostname: location.hostname,
				user_identify: {
					device_id
				}
			}

			$.ajax({
				url: 'http://localhost:8080/identification',
				type: 'POST',
				dataType: 'JSON',
				data: identification,
				xhrFields: {
					withCredentials: true
				},
				success: function(data) { }
			});

			if (_this.config.TYPE == 'GUEST') {
				_this.socket.on('connect', function() {
					_this.drawChat();
					_this.initChat();
					_this.socket.emit('identification', identification);
				});
			} else {
				_this.socket.on('connect', function() {
					_this.socket.emit('identification', identification);
				});
			}
		});

		return this;
	}
}