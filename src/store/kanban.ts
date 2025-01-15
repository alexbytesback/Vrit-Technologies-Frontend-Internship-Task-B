import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../lib/utils';
import type { Column, Id, KanbanState, Task } from '../types/kanban';

type KanbanStore = KanbanState & {
  addColumn: (title: string) => void;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  addTask: (columnId: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  moveTask: (taskId: Id, toColumnId: Id) => void;
  setSearchQuery: (query: string) => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  getFilteredColumns: () => Column[];
  getFilteredTasks: () => Task[];
};

const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      columns: [],
      tasks: [],
      searchQuery: '',
      history: {
        past: [],
        future: [],
      },

      getFilteredColumns: () => {
        const { columns, searchQuery } = get();
        if (!searchQuery) return columns;
        return columns.filter(column => 
          column.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },

      getFilteredTasks: () => {
        const { tasks, searchQuery } = get();
        if (!searchQuery) return tasks;
        const query = searchQuery.toLowerCase();
        return tasks.filter(task => 
          task.content.toLowerCase().includes(query)
        );
      },

      saveState: () => {
        const { columns, tasks } = get();
        set((state) => ({
          history: {
            past: [...state.history.past, { columns, tasks }],
            future: [],
          },
        }));
      },

      addColumn: (title) => {
        const column: Column = {
          id: generateId(),
          title,
        };
        get().saveState();
        set((state) => ({
          columns: [...state.columns, column],
        }));
      },

      deleteColumn: (id) => {
        get().saveState();
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        }));
      },

      updateColumn: (id, title) => {
        get().saveState();
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          ),
        }));
      },

      addTask: (columnId, content) => {
        const task: Task = {
          id: generateId(),
          columnId,
          content,
          createdAt: new Date(),
        };
        get().saveState();
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      deleteTask: (id) => {
        get().saveState();
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      updateTask: (id, content) => {
        get().saveState();
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, content } : task
          ),
        }));
      },

      moveTask: (taskId, toColumnId) => {
        get().saveState();
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, columnId: toColumnId } : task
          ),
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      undo: () => {
        const { past } = get().history;
        if (past.length === 0) return;

        const newPast = [...past];
        const previousState = newPast.pop()!;

        set((state) => ({
          columns: previousState.columns,
          tasks: previousState.tasks,
          history: {
            past: newPast,
            future: [
              { columns: state.columns, tasks: state.tasks },
              ...state.history.future,
            ],
          },
        }));
      },

      redo: () => {
        const { future } = get().history;
        if (future.length === 0) return;

        const newFuture = [...future];
        const nextState = newFuture.shift()!;

        set((state) => ({
          columns: nextState.columns,
          tasks: nextState.tasks,
          history: {
            past: [
              ...state.history.past,
              { columns: state.columns, tasks: state.tasks },
            ],
            future: newFuture,
          },
        }));
      },
    }),
    {
      name: 'kanban-storage',
    }
  )
);

export default useKanbanStore;