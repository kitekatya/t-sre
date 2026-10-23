from prometheus_client import Counter

tasks_created = Counter(
    "tasks_created_total",
    "Number of created tasks",
)

tasks_completed = Counter(
    "tasks_completed_total",
    "Number of completed tasks",
)

tasks_discompleted = Counter(
    "tasks_discompleted_total",
    "Number of discompleted tasks",
)

tasks_updated_info = Counter(
    "tasks_updated_info_total",
    "Number of updates of tasks info",
)

tasks_deleted = Counter(
    "tasks_deleted_total",
    "Number of deleted tasks",
)

