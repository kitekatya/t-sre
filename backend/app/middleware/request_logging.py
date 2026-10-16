from time import perf_counter

import structlog
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger = structlog.get_logger().bind(
            **{"service.name": "task-tracker-backend"}
        )

        started_at = perf_counter()

        try:
            response = await call_next(request)

            logger.info(
                "request_completed",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(
                    (perf_counter() - started_at) * 1000,
                    2,
                ),
            )

            return response

        except Exception:
            logger.exception(
                "request_failed",
                method=request.method,
                path=request.url.path,
                duration_ms=round(
                    (perf_counter() - started_at) * 1000,
                    2,
                ),
            )
            raise