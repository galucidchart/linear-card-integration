import {FieldTypeDefinition} from 'lucid-extension-sdk/core/data/fieldtypedefinition/fieldtypedefinition';
import {ScalarFieldTypeEnum} from 'lucid-extension-sdk/core/data/fieldtypedefinition/scalarfieldtype';

export const nullable = <T extends FieldTypeDefinition>(type: T) => {
    return [type, ScalarFieldTypeEnum.NULL] as const;
};
