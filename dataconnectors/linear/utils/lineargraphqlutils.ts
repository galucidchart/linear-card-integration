// import linear = require('@linear/sdk');
import { LinearClient, Organization, Issue, IssueSearchResult, LinearDocument} from '@linear/sdk';

export async function getIssuesByIds(issuesIds: string[], linearClient: LinearClient): Promise<Issue[]> {
    return Promise.all(issuesIds.map((issueId) => linearClient.issue(issueId)));
}

export async function getIssuesAssignedToSelf(linearClient: LinearClient): Promise<Issue[]> {
    const viewer = await linearClient.viewer;
    const viewerIssues = await viewer.assignedIssues({
        orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
        first: 100,
    });

    return viewerIssues.nodes;
}

export async function getIssues(
    linearClient:  LinearClient,
    searchText?: string,
    stateFilter?: string,
): Promise<Issue[] | IssueSearchResult[]> {
    if (!searchText && !stateFilter) return getIssuesAssignedToSelf(linearClient);

    const stateFilterObj = stateFilter ? {state: {name: {eq: stateFilter!}}} : null;
    const issues = await linearClient.searchIssues(searchText ?? '', {
        first: 100,
        filter: stateFilterObj,
    });

    return issues.nodes;
}

export async function getOrganization(linearClient: LinearClient): Promise<Organization> {
    return (await linearClient.viewer).organization;
}

export async function getStates(linearClient: LinearClient): Promise<String[]> {
    const states = await linearClient.workflowStates();
    return states.nodes.map((state) => state.name);
}
