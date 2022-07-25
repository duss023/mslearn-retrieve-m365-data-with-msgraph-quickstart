async function displayUI() {    
    await signIn();

    // Display info from user profile
    const user = await getUser();
    var userName = document.getElementById('userName');
    userName.innerText = user.displayName;  

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    //displayFiles();
}

// async function displayFiles() {
//     const files = await getFiles();
//     const ul = document.getElementById('downloadLinks');
//     while (ul.firstChild) {
//       ul.removeChild(ul.firstChild);
//     }
//     for (let file of files) {
//       if (!file.folder && !file.package) {
//         let a = document.createElement('a');
//         a.href = '#';
//         a.onclick = () => { downloadFile(file); };
//         a.appendChild(document.createTextNode(file.name));
//         let li = document.createElement('li');
//         li.appendChild(a);
//         ul.appendChild(li);
//       }
//     }
//   }

async function readPdf() {
    let path = document.getElementById('filePath').value;
    await downloadFile(path);
}


function urlToToSharingToken(url) {
    var trimEnd = function(str, c) {
        c = c ? c : ' ';
        var i = str.length - 1;
        for (; i >= 0 && str.charAt(i) == c; i--);
        return str.substring(0, i + 1);
    };
    var value = btoa(url);
    return "u!" + trimEnd(value, '=').replace(/\//g, '_').replace(/\+/g, '-');
}
