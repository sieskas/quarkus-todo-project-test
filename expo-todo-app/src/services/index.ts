import { todoAdapter } from '../outcall/taskmanager';
import { TodoService } from './TodoService';

export { filterAndSort } from './TodoFilterService';
export type { FilterType, SortDirection } from './TodoFilterService';
export type { TodoStats } from './TodoService';

export const todoService = new TodoService(todoAdapter);
