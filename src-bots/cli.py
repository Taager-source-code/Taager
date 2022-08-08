from parser import create_parser
from slack_sender import send_message
def main() -> str:
    parser = create_parser()
    args = parser.parse_args()
    event = {}
    event["service"] = args.service
    event["environment"] = args.environment
    event["pipeline_link"] = args.pipeline_link  # CI_PIPELINE_URL
    event["gitlab_user"] = args.gitlab_user
    event["slack_channel"] = args.slack_channel
    event["action"] = args.action
    return send_message(event)
if __name__ == "__main__":
    main()
