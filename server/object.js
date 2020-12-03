
let jsonStringFiles = "";
let jsonFiles = [];

function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        jsonStringFiles = this.responseText.split(" * ");
        parseJSONString(jsonStringFiles);

        };
    };
    xhttp.open("GET", "http://localhost:3000", true);
    xhttp.send();
  }
  
  function parseJSONString(jsonStringFiles) {
    for (let i = 0; i < jsonStringFiles.length; i++) {
      jsonFiles.push(JSON.parse(jsonStringFiles[i]));
    }
  }

  export {jsonFiles};