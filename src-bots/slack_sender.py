from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import boto3
from botocore.exceptions import ClientError
import json
def get_slack_token():
    secret_name = "slack-notify-slack-bot-token"
    region_name = "eu-west-1"
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    else:
        secret = json.loads(get_secret_value_response["SecretString"])
    # print(get_secret_value_response)
    return secret["SLACK_BOT_TOKEN"]
def format_message(event):
    action = event["action"]
    if action == "deploy_end":
        action_message = "* has been deployed on "
    elif action == "rollback":
        action_message = "* has been rolled back on "
    elif action == "deploy_start":
        action_message = "* deployment started on "
    else:
        return ""
    service = event["service"]
    environment = event["environment"]
    pipeline_link = event["pipeline_link"]
    gitlab_user = event["gitlab_user"]
    message = [
        {
            "type": "section",
            "block_id": "main",
            "text": {
                "type": "mrkdwn",
                "verbatim": False,
                "text": "*"
                + service
                + action_message
                + environment
                + " by "
                + gitlab_user
                + "\n"
                + "<"
                + pipeline_link
                + "|Pipeline Link>",
            },
        }
    ]
    return message
def send_message(event):
    client = WebClient(token=get_slack_token())
    slack_channel = event["slack_channel"]
    message = format_message(event)
    try:
        response = client.chat_postMessage(
            channel=slack_channel,
            text="Deployment Notification",
            blocks=message,
        )
        assert response["message"]["blocks"] == message
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/plain"},
            "body": "success",
        }
    except SlackApiError as e:
        # You will get a SlackApiError if "ok" is False
        assert e.response["ok"] is False
        assert e.response["error"]  # str like 'invalid_auth', 'channel_not_found'
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/plain"},
            "body": "failure",
        }
