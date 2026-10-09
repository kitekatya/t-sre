from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from .. import schemas
from ..database import get_db
from ..repositories.task_repository import TaskRepository
from ..services.task_service import TaskNotFoundError, TaskService

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def get_task_service(
    db: AsyncSession = Depends(get_db),
) -> TaskService:
    return TaskService(TaskRepository(db))


@router.get("", response_model=list[schemas.TaskRead])
async def get_tasks(service: TaskService = Depends(get_task_service)):
    return await service.get_tasks()


@router.get("/{task_id}", response_model=schemas.TaskRead)
async def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    try:
        return await service.get_task(task_id)
    except TaskNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.post("", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: schemas.TaskCreate, service: TaskService = Depends(get_task_service)):
    return await service.create_task(task_data)


@router.put("/{task_id}", response_model=schemas.TaskRead)
async def update_task(task_id: int, task_data: schemas.TaskUpdate, service: TaskService = Depends(get_task_service)):
    try:
        return await service.update_task(task_id, task_data)
    except TaskNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    try:
        await service.delete_task(task_id)
    except TaskNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )