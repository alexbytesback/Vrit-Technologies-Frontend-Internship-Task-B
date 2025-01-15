import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Plus,
  Redo2,
  Search,
  Undo2,
  X,
  Layout,
  SearchX,
  Sun,
  Moon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Column } from './components/Column';
import { cn } from './lib/utils';
import useKanbanStore from './store/kanban';

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const {
    columns,
    tasks,
    searchQuery,
    addColumn,
    deleteColumn,
    updateColumn,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    setSearchQuery,
    undo,
    redo,
    getFilteredColumns,
    getFilteredTasks,
  } = useKanbanStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const filteredColumns = getFilteredColumns();
  const filteredTasks = getFilteredTasks();

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      useKanbanStore.setState({
        columns: arrayMove(columns, oldIndex, newIndex),
      });
    }
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
      moveTask(activeId as string, overId as string);
    }
  };

  const handleAddTask = (columnId: string) => {
    const content = window.prompt('Enter task content:');
    if (content) {
      addTask(columnId, content);
    }
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
      setShowAddColumn(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen">
      <header className="glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kanban Board
              </h1>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="btn btn-secondary p-2"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden btn btn-secondary p-2"
                >
                  <Layout className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={cn(
              "flex flex-col md:flex-row items-stretch md:items-center gap-4",
              !isMobileMenuOpen && "hidden md:flex"
            )}>
              <div className="relative group flex-grow max-w-md">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                  >
                    <SearchX className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  className="btn btn-secondary p-2"
                  aria-label="Undo"
                >
                  <Undo2 className="w-5 h-5" />
                </button>
                <button
                  onClick={redo}
                  className="btn btn-secondary p-2"
                  aria-label="Redo"
                >
                  <Redo2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-6 items-start overflow-x-auto pb-4 snap-x">
            <SortableContext
              items={filteredColumns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {filteredColumns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={filteredTasks.filter(
                    (task) => task.columnId === column.id
                  )}
                  onAddTask={handleAddTask}
                  onDeleteTask={deleteTask}
                  onEditTask={updateTask}
                  onDeleteColumn={deleteColumn}
                  onEditColumn={updateColumn}
                />
              ))}
            </SortableContext>

            {showAddColumn ? (
              <form
                onSubmit={handleAddColumn}
                className="w-[350px] shrink-0 glass-panel rounded-lg p-4 snap-start animate-slide-in"
              >
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title..."
                    className="input flex-grow"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddColumn(false)}
                    className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Add Column
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddColumn(true)}
                className="w-[350px] shrink-0 h-[100px] flex items-center justify-center gap-2
                         glass-panel rounded-lg border-2 border-dashed border-gray-300
                         text-gray-500 hover:border-indigo-300 hover:text-indigo-500
                         transition-colors snap-start group"
              >
                <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
                Add Column
              </button>
            )}
          </div>
        </DndContext>
      </main>
    </div>
  );
}