import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { Column as ColumnType, Task } from '../types/kanban';
import { TaskCard } from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, content: string) => void;
  onDeleteColumn: (id: string) => void;
  onEditColumn: (id: string, title: string) => void;
}

export function Column({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDeleteColumn,
  onEditColumn,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showOptions, setShowOptions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditColumn(column.id, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'w-[350px] shrink-0 glass-panel rounded-lg p-4 snap-start',
        isDragging && 'opacity-50',
        'animate-slide-in'
      )}
    >
      <div
        className="flex items-center justify-between mb-4"
        {...attributes}
        {...listeners}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-grow">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input w-full"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{column.title}</h3>
        )}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 glass-panel rounded-lg shadow-lg z-10 animate-slide-in">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-white/50 rounded-t-lg transition-colors"
              >
                Edit Column
              </button>
              <button
                onClick={() => {
                  onDeleteColumn(column.id);
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-white/50 rounded-b-lg transition-colors"
              >
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="column-content flex flex-col gap-4">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        className="w-full mt-4 btn btn-secondary flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>
    </div>
  );
}