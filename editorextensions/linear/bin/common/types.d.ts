export interface ImportActionParams {
    organizationId: string;
    issuesIds: string[];
}
export declare const enum LinearObjectType {
    Issue = 0,
    State = 1,
    Organization = 2
}
export interface LinearQueryDataParams {
    organizationId?: string;
    objectType: LinearObjectType;
    dataParams?: {
        searchText?: string;
        state?: string;
    };
}
