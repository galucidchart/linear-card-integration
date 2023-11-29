import {EditorClient, Menu, MenuType, Viewport} from 'lucid-extension-sdk';
import {ImportModal} from './importmodal';
import { LinearClient } from '@linear/sdk';

const client = new EditorClient();
const menu = new Menu(client);
const viewport = new Viewport(client);

client.registerAction('test', () => {
    const modal = new ImportModal(client);
    modal.show();
});

client.registerAction('testToken',async () => {
    const token = await client.getOAuthToken('linear');
    console.log(token);
} );


client.registerAction('testRequest', async () => {
    // client.oauthXhr("linear", {
    //     url: "https://api.linear.app/graphql",
    //     method: "POST",
    //     data: '{"query":"query Me {\n  viewer {\n    id\n    name\n    email\n  }\n}","variables":{}}',
    //     headers: {
    //         "Content-Type": "application/json",
    //         
    //     }        

        
    // })
    const body = `{
        "query": "query Me { viewer { id name email }}"
      }`;
    client.xhr({
        url: "https://api.linear.app/graphql",
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer xxxxxxxxxx" //replace this with your own oauth token, github gets mad when you push tokens into your repos haha
            }        
    });
});

menu.addMenuItem({
    label: 'Test getting token',
    action: 'testToken',
    menuType: MenuType.Main,
});

menu.addMenuItem({
    label: 'Test request',
    action: 'testRequest',
    menuType: MenuType.Main,
})
