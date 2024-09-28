const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

contextBridge.exposeInMainWorld('electron', {
    getAppConfig: async (apppath) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke("get-app-config", apppath).then((data) => {
                resolve(JSON.parse(data));
            }).catch((err) => {
                reject(err);
            });
        })
    },
    get: (apppath, file) => ipcRenderer.invoke("get", apppath, file),
    readFile: (filepath) => ipcRenderer.invoke("read-file", filepath),
});