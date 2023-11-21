import linear = require('@linear/sdk');

export type LinearActionArgs<Action> = {
    action: Action;
    linearClient: linear.LinearClient;
    lambdaUrl: string;
};

export type LinearAction<Action, Res = {success: boolean; json?: object; error?: string}> = (
    args: LinearActionArgs<Action>,
) => Promise<Res>;
