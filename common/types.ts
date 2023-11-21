export interface ImportActionParams {
    organizationId: string;
    issuesIds: string[];
}

export const enum LinearObjectType {
    Issue,
    State,
    Organization,
}

export interface LinearQueryDataParams {
    organizationId?: string;
    objectType: LinearObjectType;
    dataParams?: {searchText?: string; state?: string};
}
