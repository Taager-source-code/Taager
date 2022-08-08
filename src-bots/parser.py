import argparse
def create_parser():
    parser = argparse.ArgumentParser(description="Processor for slack notify.")
    parser.add_argument("--service", type=str, help="Service Name", required=True)
    parser.add_argument(
        "--environment", type=str, help="Environment Name", required=True
    )
    parser.add_argument(
        "--pipeline-link", type=str, help="Pipeline Link", required=True
    )
    parser.add_argument(
        "--gitlab-user",
        type=str,
        help="The name of the user who started the job.",
        required=True,
    )
    parser.add_argument(
        "--slack-channel",
        type=str,
        help="send to this Slack Channel",
        required=False,
        default="#gitlab-notification",
    )
    parser.add_argument(
        "--action",
        type=str,
        help="Deployment Action",
        required=True,
    )
    return parser
