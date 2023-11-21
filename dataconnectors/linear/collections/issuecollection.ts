import {declareSchema, ItemType} from 'lucid-extension-sdk/core/data/fieldspecification';
import {CollectionEnumFieldType} from 'lucid-extension-sdk/core/data/fieldtypedefinition/collectionenumfieldtype';
import {FieldTypeArray} from 'lucid-extension-sdk/core/data/fieldtypedefinition/fieldtypearray';
import {ScalarFieldTypeEnum} from 'lucid-extension-sdk/core/data/fieldtypedefinition/scalarfieldtype';
import {SemanticKind} from 'lucid-extension-sdk/core/data/fieldtypedefinition/semantickind';
import {FieldConstraintType} from 'lucid-extension-sdk/core/data/serializedfield/serializedfielddefinition';
import {
    IssueCollectionFieldNames,
    ISSUES_COLLECTION_NAME,
    PROJECTS_COLLECTION_NAME,
    USERS_COLLECTION_NAME,
} from '../../../common/constants';
import {nullable} from './nullable';

export const issueSchema = declareSchema({
    primaryKey: [IssueCollectionFieldNames.Id],
    fields: {
        [IssueCollectionFieldNames.Id]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Id],
            constraints: [{type: FieldConstraintType.LOCKED}],
        },
        [IssueCollectionFieldNames.Assignee]: {
            type: nullable(new CollectionEnumFieldType(USERS_COLLECTION_NAME)),
            mapping: [SemanticKind.Assignee],
            constraints: [{type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [IssueCollectionFieldNames.Children]: {
            type: new FieldTypeArray([new CollectionEnumFieldType(ISSUES_COLLECTION_NAME)]),
        },
        [IssueCollectionFieldNames.CompletedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
        },
        [IssueCollectionFieldNames.CreatedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY] as const,
        },
        [IssueCollectionFieldNames.Creator]: {
            type: new CollectionEnumFieldType(USERS_COLLECTION_NAME),
            constraints: [{type: FieldConstraintType.LOCKED}, {type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [IssueCollectionFieldNames.Description]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Description],
        },
        [IssueCollectionFieldNames.DueDate]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
            mapping: [SemanticKind.EndTime],
        },
        [IssueCollectionFieldNames.Estimate]: {
            type: nullable(ScalarFieldTypeEnum.NUMBER),
            mapping: [SemanticKind.Estimate],
            constraints: [{type: FieldConstraintType.LOCKED}],
        },
        [IssueCollectionFieldNames.Identifier]: {
            type: ScalarFieldTypeEnum.STRING,
            constraints: [{type: FieldConstraintType.LOCKED}],
        },
        [IssueCollectionFieldNames.PriorityLabel]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Priority],
        },
        [IssueCollectionFieldNames.Project]: {
            type: nullable(new CollectionEnumFieldType(PROJECTS_COLLECTION_NAME)),
            constraints: [{type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [IssueCollectionFieldNames.SnoozedBy]: {
            type: nullable(new CollectionEnumFieldType(USERS_COLLECTION_NAME)),
            constraints: [{type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [IssueCollectionFieldNames.StartedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
            mapping: [SemanticKind.StartTime],
        },
        [IssueCollectionFieldNames.State]: {
            type: [ScalarFieldTypeEnum.STRING, ScalarFieldTypeEnum.NULL] as const,
            mapping: [SemanticKind.Status],
        },
        [IssueCollectionFieldNames.Subscribers]: {
            type: new FieldTypeArray([new CollectionEnumFieldType(USERS_COLLECTION_NAME)]),
        },
        [IssueCollectionFieldNames.Title]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Name, SemanticKind.Title],
        },
        [IssueCollectionFieldNames.UpdatedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY] as const,
        },
        [IssueCollectionFieldNames.Url]: {
            type: ScalarFieldTypeEnum.STRING,
        },
    },
});

export type IssueItemType = ItemType<typeof issueSchema.example>;
