const electron = require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow,Menu, ipcMain} = electron;

let mainWindow;
let addWindow

//Listen for app to be ready
app.on('ready', function()
{
    //create new Window
    mainWindow = new BrowserWindow({});
    //Load Html into window
    mainWindow.loadURL('file://' + __dirname + '/mainWindow.html');

     //quit app when closed
     mainWindow.on('closed', function(){
        app.quit();
        
     });

    //Build Menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow()
{
     //create new Window
     addWindow = new BrowserWindow({
         width: 300,
         height:200,
         title: 'Add Shopping List Item'
     });
     //Load Html into window
     addWindow.loadURL('file://' + __dirname + '/addWindow.html');
       
     //garbageCollection Handle
     addWindow.on('close', function(){
        addWindow = null;    
            
         });
     
         ipcMain.on('item:add', function(e,item){
             mainWindow.webContents.send('item:add', item);
            // addWindow.close();
            //addWindow = null;
         })
   

}


const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
            label: 'Add Item',
            click() {
                createAddWindow();
            }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');   
                }

            },
            {
                label: 'Quit',
                click()
                {
                    app.quit();
                }
            }
        ]
    }

];

//Add Developer Tools item if not in prod
if(process.env.NODE_ENV !== 'production')
{
     mainMenuTemplate.push({
         label: 'Developer Tools',
         submenu: [
             {
                 label: 'Toggle DevTools',
                 click(item, focusedWindow){
                     focusedWindow.toggleDevTools();
                 }
             },
             {
                role: 'Reload'
             }
         ]
     })
}