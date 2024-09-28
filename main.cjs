const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");

const isProduction = false;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    fullscreen: true,
    frame: !isProduction,
    movable: true,
  });

  // mainWindow.loadFile("index.html");
  mainWindow.loadURL("http://localhost:5000")

  mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-app-config", async (event, apppath) => {
  let data = fs.readFileSync(path.join(__dirname, (isProduction ? "" : "public"), apppath, "sapp.json"), "utf-8");
  return JSON.parse(data);
});

// Read specified file
ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
});

ipcMain.handle("get", async (event, apppath, file) => {
  return path.join(__dirname, (isProduction ? "" : "public"), apppath, file);
});



//////////////////////////////////////////////////////////
// Filesystem
//////////////////////////////////////////////////////////

// :/user/nina.png -> files/user/nina.png
function processPath(pathto) {
  return path.join(__dirname, (isProduction ? "" : "public"), pathto.replace(":/", "/"))
}

function readFile(filepath) {
  return fs.readFileSync(processPath(filepath), "utf-8");
}

function getFilesInFolder(folder) {
  let files = fs.readdirSync(processPath(folder));
  let data = [];

  files.forEach(file => {
    data.push({
      name: file,
      isDir: fs.lstatSync(path.join(processPath(folder), file)).isDirectory(),
      path: path.join(processPath(folder), file),
    });
  });

  return data;
}

function createFile(filepath, data) {
  fs.writeFileSync(processPath(filepath), data);
  return data;
}

function writeFile(filepath, data) {
  fs.writeFileSync(processPath(filepath), data);
  return data;
}

function createFolder(folderpath) {
  fs.mkdirSync(processPath(folderpath));
}

function deleteFile(filepath) {
  fs.unlinkSync(processPath(filepath));
}

function deleteFolder(folderpath) {
  fs.rmdirSync(processPath(folderpath), { recursive: true });
}

function renameFile(filepath, newname) {
  fs.renameSync(processPath(filepath), processPath(path.join(path.dirname(filepath), newname)));
  return newname;
}

function moveFile(filepath, newpath) {
  fs.renameSync(processPath(filepath), processPath(newpath));
  return newpath;
}

function copyFile(filepath, copypath) {
  fs.copyFileSync(processPath(filepath), processPath(copypath));
  return copypath;
}

function copyFolder(folderpath, copyfolderpath) {
  fs.copyFileSync(processPath(folderpath), processPath(copyfolderpath));
  return copyfolderpath;
}

//////////////////////////////////////////////////////////
// SAIKO-SERVER
//////////////////////////////////////////////////////////

const express = require('express');
const cors = require('cors');
const { log } = require('console');

const server = express();
const port = 8080;

let saiko_id;

server.set('trust proxy', true);
server.use(express.json());
server.use(cors());

// server.use(express.static(path.join(__dirname, (isProduction ? "" : "public"))));

server.post('/register', (req, res) => {
  if(req.body.saiko == "el}s%ie24#") {
    saiko_id = req.ip;
    console.log(`Registered: ${saiko_id}`);
    res.send("OS");
  } else {
    console.log("Registered App");
    
    res.send("APP");
  }
});

// Files
server.get("/files/folder-content", (req, res) => {
  getFilesInFolder(req.query.folderpath)
});

server.post("/files/create-file", (req, res) => {
  createFile(req.body.filepath, req.body.data)
});

server.post("/files/write-file", (req, res) => {
  writeFile(req.body.filepath, req.body.data)
});

server.post("/files/create-folder", (req, res) => {
  createFolder(req.body.folderpath)
});

server.post("/files/delete-file", (req, res) => {
  deleteFile(req.body.filepath)
});

server.post("/files/delete-folder", (req, res) => {
  deleteFolder(req.body.folderpath)
});

server.post("/files/rename-file", (req, res) => {
  renameFile(req.body.filepath, req.body.newname)
});

server.post("/files/move-file", (req, res) => {
  moveFile(req.body.filepath, req.body.newpath)
});

server.post("/files/copy-file", (req, res) => {
  copyFile(req.body.filepath, req.body.copypath)
});

server.post("/files/copy-folder", (req, res) => {
  copyFolder(req.body.folderpath, req.body.copyfolderpath)
});

// Settings

server.get("/settings/get", (req, res) => {
  const settingsdata = readFile(":/files/usr/settings.json");
  console.log(settingsdata);
  
  res.send(settingsdata);
});

server.post("/settings/set", (req, res) => {
  // Merge with existing settings
  const settingsdata = readFile(":/files/usr/settings.json");
  const newdata = Object.assign(settingsdata, req.body);
  writeFile(":/files/usr/settings.json", JSON.stringify(JSON.parse(newdata)));
});


server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});