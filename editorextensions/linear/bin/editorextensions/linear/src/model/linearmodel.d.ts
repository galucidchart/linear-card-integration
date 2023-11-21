export interface Project {
    id: string;
    name: string;
    comment_count: number;
}
export interface TodoistDate {
    date: string;
    is_recurring: boolean;
    datetime: string;
    string: string;
    timezone: string;
}
export interface Task {
    id: string;
    is_completed: boolean;
    content: string;
    description: string;
    due: TodoistDate;
    url: string;
}
