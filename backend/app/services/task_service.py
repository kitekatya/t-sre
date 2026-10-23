from .. import schemas
from ..metrics import tasks_completed, tasks_created, tasks_deleted, tasks_discompleted, tasks_updated_info
from ..models import Task
from ..repositories.task_repository import TaskRepository


class TaskNotFoundError(Exception):
    pass


class TaskService:
    """Бизнес-логика работы с задачами."""

    def __init__(self, repository: TaskRepository):
        self.repository = repository

    async def get_tasks(self) -> list[Task]:
        return await self.repository.get_all()

    async def get_task(self, task_id: int) -> Task:
        task = await self.repository.get_by_id(task_id)

        if task is None:
            raise TaskNotFoundError(task_id)

        return task

    async def create_task(self, task_data: schemas.TaskCreate) -> Task:
        task = await self.repository.create(Task(**task_data.model_dump()))
        tasks_created.inc()
        return task

    async def update_task(self, task_id: int, task_data: schemas.TaskUpdate) -> Task:
        task = await self.get_task(task_id)
        was_completed = task.is_completed

        for field, value in task_data.model_dump().items():
            setattr(task, field, value)

        udpate = await self.repository.update(task)

        if (not was_completed) and task_data.is_completed:
            tasks_completed.inc()
        elif was_completed and (not task_data.is_completed):
            tasks_discompleted.inc()
        else:
            tasks_updated_info.inc()

        return udpate

    async def delete_task(self, task_id: int) -> None:
        task = await self.get_task(task_id)

        await self.repository.delete(task)
        tasks_deleted.inc()