type OSSettings = {
  bgImg: string,
  primarySwatch: string,
  primaryLight: string,
  animationSpeed: number,
  secondarySwatch: string,
  pw: string,
  username: string,
  userimage: string | null
}

const defaultSettings: OSSettings = {
  bgImg: "default-background.jpg",
  primarySwatch: "#1d1d1d",
  animationSpeed: 5,
  secondarySwatch: "#ffffff",
  primaryLight: "#353535",
  pw: "admin",
  username: "User",
  userimage: null,
};

const settingsdata = await fetch("http://localhost:8080/settings/get").then(data => {
  return data.json().then(jsonData => {
    return JSON.stringify(jsonData);
  }).catch(error => {
      console.error('Error parsing JSON:', error);
      return JSON.stringify(defaultSettings);
  })
}).catch(error => {
  console.error('Error fetching settings:', error);
  return JSON.stringify(defaultSettings);
});

let settings: OSSettings = JSON.parse(settingsdata);

if(settingsdata == "{}") {
  settings = defaultSettings;
  await fetch("http://localhost:8080/settings/set", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultSettings),
  }).then(response => {
    console.log('Settings saved:', response);
  }).catch(error => {
    console.error('Error saving settings:', error);
  });
}

setInterval(() => {
  fetch("http://localhost:8080/settings/get").then(data => {
    return data.json().then(jsonData => {
      settings = jsonData;
    }).catch(error => {
        console.error('Error parsing JSON:', error);
    })
  }).catch(error => {
    console.error('Error fetching settings:', error);
  });
}, 3000);

export default settings;