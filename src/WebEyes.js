import WebEyesChat from './class/Chat';
import WebEyesNotification from './class/Notification';

export default function (config) {
	var Chat = new WebEyesChat(config);
	var Notification = new WebEyesNotification(config);
	var ReturnData = {};

	if (config !== undefined) {
		if (config.CHAT_API !== undefined && config.CHAT_API == true) {
			ReturnData.Chat = Chat;
		} else {
			ReturnData.Chat = Chat.run();
		}

		if (config.NOTIFICATION_API !== undefined && config.NOTIFICATION_API == true) {
			ReturnData.Notification = Notification;
		} else {
			ReturnData.Notification = Notification.run();
		}
	} else {
		ReturnData.Chat = Chat.run();
		ReturnData.Notification = Notification.run();
	}

	return ReturnData;
}