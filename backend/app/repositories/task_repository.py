from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Task


class TaskRepository:
    """Работа с задачами на уровне хранения данных."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Task]:
        statement = (
            select(Task)
            .order_by(
                Task.is_completed.asc(),
                Task.created_at.desc(),
            )
        )

        result = await self.db.scalars(statement)

        return list(result.all())

    async def get_by_id(self, task_id: int) -> Task | None:
        return await self.db.get(Task, task_id)

    async def create(self, task: Task) -> Task:
        self.db.add(task)

        await self.db.commit()
        await self.db.refresh(task)

        return task

    async def update(self, task: Task) -> Task:
        await self.db.commit()
        await self.db.refresh(task)

        return task

    async def delete(self, task: Task) -> None:
        await self.db.delete(task)
        await self.db.commit()