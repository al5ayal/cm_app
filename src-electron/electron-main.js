import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
const Op = require('sequelize').Op;
// const Op = sequelize.Op;
const User = require('../models').User;
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1700,
    height: 900,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  //handling ipcRequests
  ipcMain.handle('login', async (event, loginData) => {
    // make login here
    // bring the model then find where
    // const User = db.user;
    // console.log(Op);
    // console.log(User);
    // return;
    // const user = await User.findOne({ where: { user_name: loginData.login } });
    const user = await User.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { user_name: loginData.login },
              { email: loginData.login },
            ],
          },
          { password: loginData.password },
        ],
        // [Op.or]: [{ a: 5 }, { b: 6 }],
      },
    });
    if (user && user.password == loginData.password) {
      // return user;
      return {
        full_name: user.full_name,
        email: user.email,
        usert_name: user.user_name,
        user_group: user.user_group_id,
      };
    } else {
      console.log('invalid login creds');
      return null;
    }

    // if not null return the user data
  });
  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.webContents.openDevTools();
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
