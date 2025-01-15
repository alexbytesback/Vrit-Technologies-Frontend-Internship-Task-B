import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Task } from '../types/kanban';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
  const [isDropping, setIsDropping] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  useEffect(() => {
    if (!isDragging) {
      setIsDropping(true);
      const timer = setTimeout(() => setIsDropping(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  useEffect(() => {
    if (transform) {
      setIsMoving(true);
      const timer = setTimeout(() => setIsMoving(false), 300);
      return () => clearTimeout(timer);
    }
  }, [transform]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(task.id, editContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-panel p-4 rounded-lg animate-slide-in"
      >
        <form onSubmit={handleSubmit}>
          <textarea
            className="input w-full resize-none"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'glass-panel p-4 rounded-lg cursor-grab touch-none card',
        isDragging && 'opacity-50'
      )}
      data-dragging={isDragging}
      data-dropping={isDropping}
      data-moving={isMoving}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap flex-1 overflow-hidden">
          {task.content}
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}