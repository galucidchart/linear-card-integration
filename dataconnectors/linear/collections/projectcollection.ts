import {declareSchema, ItemType} from 'lucid-extension-sdk/core/data/fieldspecification';
import {CollectionEnumFieldType} from 'lucid-extension-sdk/core/data/fieldtypedefinition/collectionenumfieldtype';
import {FieldTypeArray} from 'lucid-extension-sdk/core/data/fieldtypedefinition/fieldtypearray';
import {ScalarFieldTypeEnum} from 'lucid-extension-sdk/core/data/fieldtypedefinition/scalarfieldtype';
import {SemanticKind} from 'lucid-extension-sdk/core/data/fieldtypedefinition/semantickind';
import {FieldConstraintType} from 'lucid-extension-sdk/core/data/serializedfield/serializedfielddefinition';
import {ProjectCollectionFieldNames, TEAMS_COLLECTION_NAME, USERS_COLLECTION_NAME} from '../../../common/constants';
import {nullable} from './nullable';

export const projectSchema = declareSchema({
    primaryKey: [ProjectCollectionFieldNames.Id],
    fields: {
        [ProjectCollectionFieldNames.Id]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Id]},
        [ProjectCollectionFieldNames.Color]: {type: ScalarFieldTypeEnum.STRING},
        [ProjectCollectionFieldNames.CompletedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
        },
        [ProjectCollectionFieldNames.CreatedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY] as const,
        },
        [ProjectCollectionFieldNames.Creator]: {
            type: new CollectionEnumFieldType(USERS_COLLECTION_NAME),
            constraints: [{type: FieldConstraintType.LOCKED}, {type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [ProjectCollectionFieldNames.Description]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Description],
        },
        [ProjectCollectionFieldNames.Icon]: {type: nullable(ScalarFieldTypeEnum.STRING)},
        [ProjectCollectionFieldNames.Lead]: {
            type: nullable(new CollectionEnumFieldType(USERS_COLLECTION_NAME)),
            constraints: [{type: FieldConstraintType.MAX_VALUE, value: 1}],
        },
        [ProjectCollectionFieldNames.Members]: {
            type: new FieldTypeArray([new CollectionEnumFieldType(USERS_COLLECTION_NAME)]),
        },
        [ProjectCollectionFieldNames.Name]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Name]},
        [ProjectCollectionFieldNames.Progress]: {
            type: ScalarFieldTypeEnum.NUMBER,
        },
        [ProjectCollectionFieldNames.Scope]: {
            type: ScalarFieldTypeEnum.NUMBER,
            mapping: [SemanticKind.Estimate],
        },
        [ProjectCollectionFieldNames.StartedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
            mapping: [SemanticKind.StartTime],
        },
        [ProjectCollectionFieldNames.State]: {
            type: ScalarFieldTypeEnum.STRING,
            mapping: [SemanticKind.Status],
        },
        [ProjectCollectionFieldNames.TargetDate]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL] as const,
            mapping: [SemanticKind.EndTime],
        },
        [ProjectCollectionFieldNames.Teams]: {
            type: new FieldTypeArray([new CollectionEnumFieldType(TEAMS_COLLECTION_NAME)]),
        },
        [ProjectCollectionFieldNames.UpdatedAt]: {
            type: [ScalarFieldTypeEnum.DATE, ScalarFieldTypeEnum.DATEONLY] as const,
        },
        [ProjectCollectionFieldNames.Url]: {
            type: ScalarFieldTypeEnum.STRING,
        },
    },
});

export type ProjectItemType = ItemType<typeof projectSchema.example>;
