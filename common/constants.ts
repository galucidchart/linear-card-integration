export const IMPORT_ACTION_NAME = 'Import';
export const QUERY_ACTION_NAME = 'Query';

export const DATA_CONNECTOR_NAME = 'linear';

export const ISSUES_COLLECTION_NAME = 'Issues';
export const USERS_COLLECTION_NAME = 'Users';
export const PROJECTS_COLLECTION_NAME = 'Projects';
export const TEAMS_COLLECTION_NAME = 'Teams';

export enum IssueCollectionFieldNames {
    Id = 'Id',
    Assignee = 'Assignee',
    Children = 'Children',
    CompletedAt = 'CompletedAt',
    CreatedAt = 'CreatedAt',
    Creator = 'Creator',
    DueDate = 'DueDate',
    Description = 'Description',
    Estimate = 'Estimate',
    Identifier = 'Identifier',
    PriorityLabel = 'PriorityLabel',
    Project = 'Projects',
    SnoozedBy = 'SnoozedBy',
    StartedAt = 'StartedAt',
    State = 'State',
    Subscribers = 'Subscribers',
    Title = 'Title',
    UpdatedAt = 'UpdatedAt',
    Url = 'Url',
}

export enum ProjectCollectionFieldNames {
    Id = 'Id',
    Color = 'Color',
    CompletedAt = 'CompletedAt',
    CreatedAt = 'CreatedAt',
    Creator = 'Creator',
    Description = 'Description',
    Icon = 'IconUrl',
    Lead = 'Lead',
    Members = 'Members',
    Name = 'Name',
    Progress = 'Progress',
    Scope = 'Scope',
    StartedAt = 'StartedAt',
    State = 'State',
    TargetDate = 'TargetDate',
    Teams = 'Teams',
    UpdatedAt = 'UpdatedAt',
    Url = 'Url',
}

export enum TeamCollectionFieldNames {
    Id = 'Id',
    Color = 'Color',
    Description = 'Description',
    Key = 'Key',
    Members = 'Members',
    Name = 'Name',
    Private = 'Private',
    Timezone = 'Timezone',
}

export enum UserCollectionFieldNames {
    Id = 'Id',
    Active = 'Active',
    Admin = 'Admin',
    AvatarUrl = 'AvatarUrl',
    CreatedIssueCount = 'CreatedIssueCount',
    Description = 'Description',
    DisplayName = 'DisplayName',
    Email = 'Email',
    Name = 'Name',
    StatusLabel = 'StatusLabel',
    Timezone = 'Timezone',
}
