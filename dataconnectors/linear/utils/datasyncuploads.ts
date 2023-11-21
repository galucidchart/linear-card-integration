import linear = require('@linear/sdk');
import {DataSourceClient} from 'lucid-extension-sdk/dataconnector/datasourceclient';
import {
    IssueCollectionFieldNames,
    ProjectCollectionFieldNames,
    TeamCollectionFieldNames,
    UserCollectionFieldNames,
} from '../../../common/constants';
import {IssueItemType, issueSchema} from '../collections/issuecollection';
import {ProjectItemType, projectSchema} from '../collections/projectcollection';
import {TeamItemType, teamSchema} from '../collections/teamcollection';
import {UserItemType, userSchema} from '../collections/usercollection';

type Issue = linear.Issue;
type User = linear.User;
type Project = linear.Project;
type Team = linear.Team;
type LinearClient = linear.LinearClient;

async function getIssuesRelatedData(
    issues: Issue[],
): Promise<{users: User[]; projects: Project[]; teams: Team[]; issues: Issue[]}> {
    const discoverableUsers = new Map<string, User>();
    const discoverableTeams = new Map<string, Team>();
    const discoverableProjects = new Map<string, Project>();
    const discoverableIssues = new Map<string, Issue>();

    for (let issue of issues) {
        // Get other issues
        discoverableIssues.set(issue.id, issue);
        (await issue.children({first: 50})).nodes
            .filter((i) => !discoverableIssues.has(i.id))
            .forEach((i) => discoverableIssues.set(i.id, i));
    }

    for (let issue of discoverableIssues.values()) {
        // Set discoverable users from current issue
        (await Promise.all([issue.assignee, issue.creator, issue.snoozedBy, issue.subscribers({first: 50})]))
            .flatMap((result) =>
                result instanceof linear.UserConnection ? (result as linear.UserConnection).nodes : result,
            )
            .filter((u) => u)
            .forEach((u) => discoverableUsers.set(u!.id, u!));

        // Set discoverable projects
        const project = await issue.project;
        if (project) discoverableProjects.set(project.id, project);
    }

    // Set discoverable teams
    for (let project of discoverableProjects.values()) {
        const teams = await project.teams({first: 100});
        teams.nodes.forEach((t) => discoverableTeams.set(t.id, t));
    }

    // Add last users belonging to the discovered teams
    for (let team of discoverableTeams.values()) {
        const otherUsers = await team.members({first: 50});
        otherUsers.nodes.forEach((u) => discoverableUsers.set(u.id, u));
    }

    return {
        users: [...discoverableUsers.values()],
        projects: [...discoverableProjects.values()],
        teams: [...discoverableTeams.values()],
        issues: [...issues.values()],
    };
}

export const uploadIssuesToDataSync = async (
    client: DataSourceClient,
    workspaceId: string,
    issuesToUpload: Issue[],
    linearClient: LinearClient,
): Promise<{success: boolean}> => {
    const {issues, users, teams, projects} = await getIssuesRelatedData(issuesToUpload);

    await client.update({
        dataSourceName: 'linear',
        collections: {
            ISSUES_COLLECTION_NAME: {
                schema: {
                    fields: issueSchema.array,
                    primaryKey: issueSchema.primaryKey.elements,
                },
                patch: {
                    items: issueSchema.fromItems(await Promise.all(issues.map(translateIssue))),
                },
            },
            TEAMS_COLLECTION_NAME: {
                schema: {
                    fields: teamSchema.array,
                    primaryKey: teamSchema.primaryKey.elements,
                },
                patch: {
                    items: teamSchema.fromItems(await Promise.all(teams.map(translateTeam))),
                },
            },
            USERS_COLLECTION_NAME: {
                schema: {
                    fields: userSchema.array,
                    primaryKey: userSchema.primaryKey.elements,
                },
                patch: {
                    items: userSchema.fromItems(users.map(translateUser)),
                },
            },
            PROJECTS_COLLECTION_NAME: {
                schema: {
                    fields: projectSchema.array,
                    primaryKey: projectSchema.primaryKey.elements,
                },
                patch: {
                    items: projectSchema.fromItems(await Promise.all(projects.map(translateProject))),
                },
            },
        },
    });

    return {success: true};
};

async function translateIssue(issue: Issue): Promise<IssueItemType> {
    return {
        [IssueCollectionFieldNames.Id]: issue.id,
        [IssueCollectionFieldNames.Assignee]: (await issue.assignee)?.id ?? null,
        [IssueCollectionFieldNames.Children]: (await issue.children({first: 50})).nodes.map((child) => child.id),
        [IssueCollectionFieldNames.CompletedAt]: issue.completedAt
            ? {
                  'isoDate': issue.completedAt.toISOString(),
              }
            : null,
        [IssueCollectionFieldNames.CreatedAt]: {
            'isoDate': issue.createdAt.toISOString(),
        },
        [IssueCollectionFieldNames.Creator]: (await issue.creator)?.id ?? '',
        [IssueCollectionFieldNames.DueDate]: issue.dueDate
            ? {
                  'isoDate': issue.dueDate.toISOString(),
              }
            : null,
        [IssueCollectionFieldNames.Description]: issue.description ?? '',
        [IssueCollectionFieldNames.Estimate]: issue.estimate ?? null,
        [IssueCollectionFieldNames.Identifier]: issue.identifier,
        [IssueCollectionFieldNames.PriorityLabel]: issue.priorityLabel,
        [IssueCollectionFieldNames.Project]: (await issue.project)?.id ?? null,
        [IssueCollectionFieldNames.SnoozedBy]: (await issue.snoozedBy)?.id ?? null,
        [IssueCollectionFieldNames.StartedAt]: issue.startedAt
            ? {
                  'isoDate': issue.startedAt.toISOString(),
              }
            : null,
        [IssueCollectionFieldNames.State]: (await issue.state)?.id ?? null,
        [IssueCollectionFieldNames.Subscribers]: (await issue.subscribers({first: 50})).nodes.map((s) => s.id),
        [IssueCollectionFieldNames.Title]: issue.title,
        [IssueCollectionFieldNames.UpdatedAt]: {
            'isoDate': issue.updatedAt.toISOString(),
        },
        [IssueCollectionFieldNames.Url]: issue.url,
    };
}

async function translateProject(project: Project): Promise<ProjectItemType> {
    return {
        [ProjectCollectionFieldNames.Id]: project.id,
        [ProjectCollectionFieldNames.Color]: project.color,
        [ProjectCollectionFieldNames.CompletedAt]: project.completedAt
            ? {
                  'isoDate': project.completedAt.toISOString(),
              }
            : null,
        [ProjectCollectionFieldNames.CreatedAt]: {
            'isoDate': project.createdAt.toISOString(),
        },
        [ProjectCollectionFieldNames.Creator]: (await project.creator)?.id ?? '',
        [ProjectCollectionFieldNames.Description]: project.description,
        [ProjectCollectionFieldNames.Icon]: project.icon ?? null,
        [ProjectCollectionFieldNames.Lead]: (await project.lead)?.id ?? null,
        [ProjectCollectionFieldNames.Members]: (await project.members({first: 100}))?.nodes.map((m) => m.id) ?? [],
        [ProjectCollectionFieldNames.Name]: project.name,
        [ProjectCollectionFieldNames.Progress]: project.progress,
        [ProjectCollectionFieldNames.Scope]: project.scope,
        [ProjectCollectionFieldNames.StartedAt]: project.startedAt
            ? {
                  'isoDate': project.startedAt.toISOString(),
              }
            : null,
        [ProjectCollectionFieldNames.State]: project.state,
        [ProjectCollectionFieldNames.TargetDate]: project.targetDate
            ? {
                  'isoDate': project.targetDate.toISOString(),
              }
            : null,
        [ProjectCollectionFieldNames.Teams]: (await project.teams({first: 50}))?.nodes.map((t) => t.id) ?? [],
        [ProjectCollectionFieldNames.UpdatedAt]: {
            'isoDate': project.updatedAt.toISOString(),
        },
        [ProjectCollectionFieldNames.Url]: project.url,
    };
}

async function translateTeam(team: Team): Promise<TeamItemType> {
    return {
        [TeamCollectionFieldNames.Id]: team.id,
        [TeamCollectionFieldNames.Color]: team.color ?? null,
        [TeamCollectionFieldNames.Description]: team.description ?? '',
        [TeamCollectionFieldNames.Key]: team.key,
        [TeamCollectionFieldNames.Members]: (await team.members({first: 50}))?.nodes.map((m) => m.id) ?? [],
        [TeamCollectionFieldNames.Name]: team.name,
        [TeamCollectionFieldNames.Private]: team.private,
        [TeamCollectionFieldNames.Timezone]: team.timezone,
    };
}

function translateUser(user: User): UserItemType {
    return {
        [UserCollectionFieldNames.Id]: user.id,
        [UserCollectionFieldNames.Active]: user.active,
        [UserCollectionFieldNames.Admin]: user.admin,
        [UserCollectionFieldNames.AvatarUrl]: user.avatarUrl ?? null,
        [UserCollectionFieldNames.CreatedIssueCount]: user.createdIssueCount,
        [UserCollectionFieldNames.Description]: user.description ?? '',
        [UserCollectionFieldNames.DisplayName]: user.displayName,
        [UserCollectionFieldNames.Email]: user.email,
        [UserCollectionFieldNames.Name]: user.name,
        [UserCollectionFieldNames.StatusLabel]: user.statusLabel ?? null,
        [UserCollectionFieldNames.Timezone]: user.timezone ?? null,
    };
}
