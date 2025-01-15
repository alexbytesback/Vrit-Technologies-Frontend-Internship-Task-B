export type Id = string;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  createdAt: Date;
};

export type KanbanState = {
  columns: Column[];
  tasks: Task[];
  searchQuery: string;
  history: {
    past: { columns: Column[]; tasks: Task[] }[];
    future: { columns: Column[]; tasks: Task[] }[];
  };
};