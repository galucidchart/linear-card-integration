import {EditorClient, Menu, MenuType, Viewport} from 'lucid-extension-sdk';
import {ImportModal} from './importmodal';
import { LinearClient } from '@linear/sdk';

const client = new EditorClient();
const menu = new Menu(client);
const viewport = new Viewport(client);
// const client2 = new LinearClient({
//     accessToken: "lin_oauth_c24bcce279969d7e8c9170513f57110119a6418c603e233ebbbdcb8ea1e2477f"
//   });

client.registerAction('test', () => {
    const modal = new ImportModal(client);
    modal.show();
});

client.registerAction('testRequest', async () => {
    // client2.issues();
    client.oauthXhr("linear", {
        url: "https://api.linear.app/graphql",
        method: "POST",
        data: '{"query":"query Me {\n  viewer {\n    id\n    name\n    email\n  }\n}","variables":{}}',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer lin_oauth_c24bcce279969d7e8c9170513f57110119a6418c603e233ebbbdcb8ea1e2477f"
        }        

        
    })
    

})

menu.addMenuItem({
    label: 'Test thing 2',
    action: 'test',
    menuType: MenuType.Main,
});

menu.addMenuItem({
    label: 'Test request',
    action: 'testRequest',
    menuType: MenuType.Main,
})
