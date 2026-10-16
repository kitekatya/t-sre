import logging
import sys

import structlog

def add_message(
    logger,
    method_name,
    event_dict,
):
    message = event_dict.pop("event", "")

    event_dict["message"] = message
    event_dict["_msg"] = message

    return event_dict


def configure_logging() -> None:
    structlog.configure(
        processors=[
            add_message,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )