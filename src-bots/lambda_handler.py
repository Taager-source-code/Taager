from slack_sender import send_message
def main(event, context) -> str:
    if event.get("slack_channel") is None:
        event["slack_channel"] = "#gitlab-notification"
    return send_message(event)