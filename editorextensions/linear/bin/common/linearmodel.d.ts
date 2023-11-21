/**
 * These interfaces provide a light-weight model of linear issues, to be used when retrieving data through the client instead of the collection
 */
export interface LinearIssue {
    id: string;
    title: string;
    state: string;
    assignee?: LinearUser;
    dueDate: string;
}
export interface LinearUser {
    id: string;
    name: string;
    avatarUrl?: string;
}
