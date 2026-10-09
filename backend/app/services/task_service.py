from .. import schemas
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
        task = Task(**task_data.model_dump())

        return await self.repository.create(task)

    async def update_task(self, task_id: int, task_data: schemas.TaskUpdate) -> Task:
        task = await self.get_task(task_id)

        for field, value in task_data.model_dump().items():
            setattr(task, field, value)

        return await self.repository.update(task)

    async def delete_task(self, task_id: int) -> None:
        task = await self.get_task(task_id)

        await self.repository.delete(task)