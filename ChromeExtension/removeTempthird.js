
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}
function removePayload(){

}
function removeMethod(){

}
function removeUrl(){

}
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    const urlHash = element.getAttribute('data-url-hash');
    const method = element.getAttribute('data-method');
    const payload = element.getAttribute('data-payload');

    if (payload) {
        console.log(`Payload removed: ${payload} (Method: ${method}, URL Hash: ${urlHash})`);
        // Send to database: payload, method, urlHash
    } else if (method) {
        console.log(`Method removed: ${method} (URL Hash: ${urlHash})`);
        // Send to database: method, urlHash
    } else if (urlHash) {
        console.log(`URL removed: ${urlHash}`);
        // Send to database: urlHash
    }

    element.remove();
}

async function generateHtml(urls, urlToMethods, urlToMethodsToPayloads) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
        const url = urls[urlIndex];
        const urlHash = await sha256(url);
        const urlId = `url${urlIndex}-section`;
        const methodsId = `methods-${urlId}`;

        const urlSection = document.createElement('div');
        urlSection.id = urlId;
        urlSection.className = 'section';
        urlSection.setAttribute('data-url-hash', urlHash);

        const urlHeader = document.createElement('div');
        urlHeader.className = 'section-header';
        urlHeader.setAttribute('data-methods-id', methodsId);
        urlHeader.innerHTML = `
            ${url}
            <button class="remove-btn" data-url-id="${urlId}">Remove</button>
        `;
        urlSection.appendChild(urlHeader);

        const methodsSection = document.createElement('div');
        methodsSection.id = methodsId;
        methodsSection.className = 'hidden method-section';

        if (urlToMethods[urlHash]) {
            urlToMethods[urlHash].forEach((method, methodIndex) => {
                const methodId = `${urlId}-method${methodIndex}-section`;
                const payloadsId = `payloads-${methodId}`;

                const methodHeader = document.createElement('div');
                methodHeader.id = methodId;
                methodHeader.className = 'method-header';
                methodHeader.setAttribute('data-payloads-id', payloadsId);
                methodHeader.setAttribute('data-url-hash', urlHash);
                methodHeader.setAttribute('data-method', method);
                methodHeader.innerHTML = `
                    ${method}
                    <button class="remove-btn" data-method-id="${methodId}">Remove</button>
                `;
                methodsSection.appendChild(methodHeader);

                const payloadSection = document.createElement('div');
                payloadSection.id = payloadsId;
                payloadSection.className = 'hidden payload-section';

                if (urlToMethodsToPayloads[urlHash][method]) {
                    urlToMethodsToPayloads[urlHash][method].forEach((payload, payloadIndex) => {
                        const payloadId = `${methodId}-payload${payloadIndex}`;

                        const payloadDiv = document.createElement('div');
                        payloadDiv.id = payloadId;
                        payloadDiv.className = 'payload';
                        payloadDiv.setAttribute('data-url-hash', urlHash);
                        payloadDiv.setAttribute('data-method', method);
                        payloadDiv.setAttribute('data-payload', payload);
                        payloadDiv.innerHTML = `
                            ${payload}
                            <button class="remove-btn" data-payload-id="${payloadId}">Remove</button>
                        `;
                        payloadSection.appendChild(payloadDiv);
                    });
                }

                methodsSection.appendChild(payloadSection);
            });
        }

        urlSection.appendChild(methodsSection);
        container.appendChild(urlSection);
    }

    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function () {
            const methodsId = this.getAttribute('data-methods-id');
            toggleSection(methodsId);
        });
    });

    document.querySelectorAll('.method-header').forEach(header => {
        header.addEventListener('click', function () {
            const payloadsId = this.getAttribute('data-payloads-id');
            toggleSection(payloadsId);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const urlId = this.getAttribute('data-url-id');
            const methodId = this.getAttribute('data-method-id');
            const payloadId = this.getAttribute('data-payload-id');
            console.log(urlId)
            console.log(methodId)
            console.log(payloadId)

            if (urlId) removeElement(urlId);
            if (methodId) removeElement(methodId);
            if (payloadId) removeElement(payloadId);

            event.stopPropagation();
        });
    });
}
function getSimpleUrl(url){
   // Create a URL object
  
   // console.log("here at hash ");
   // console.log(url);
   const urlObj = new URL(url);
   
   // Extract the domain (hostname)
   const domain = urlObj.hostname;
   
   // Extract the path
   const path = urlObj.pathname;
   
    let simpleUrl = "*://";
    simpleUrl += domain + path + '*';
    return simpleUrl;
}
document.addEventListener('DOMContentLoaded', async function () {

    let user_info = {
        uid : '',
        name : ''
    }
    await chrome.runtime.sendMessage({
        message : 'load'
    }, async (response) =>{
        // //  alert(response.uid);
        // //  alert(response.name);
        //  user_info.uid = response.uid;
        //  user_info.name = response.name;
        //  console.log(user_info);
        go(response.uid);
    });


    // go(user_info);

});

async function go(uid){
        // Example data
        console.log(uid);
        const urls = [];
        const urlToMethods = new Map();
        const urlToMethodsToPayloads = new Map();
    fetch(`http://localhost:8080/userEntry/` + uid , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => (response.json())).catch(error => {
        apiAddUserCall({
          uid : global_user_info.sub,
          name : global_user_info.name
        });
      })
      .then(async (data) => {
        console.log(data);
            if("userProvidedUrl" in data){
                data.userProvidedUrl.forEach(url =>{
                    console.log("for url : " + url);
                    urls.push(url);
                    sha256(url).then(urlHashed => {
                        console.log("hashed value " + urlHashed);
                        if(data.methodsToTrackForUser != null){
                            if(urlToMethods[urlHashed] == null){
                                urlToMethods[urlHashed] = [];
                            }
                            if(data.methodsToTrackForUser[urlHashed] != null){
                                data.methodsToTrackForUser[urlHashed].forEach(method =>{
                                    urlToMethods[urlHashed].push(method);
                                    if(data.payloadFilterForUser != null){
                                        if(urlToMethodsToPayloads[urlHashed] == null){
                                            urlToMethodsToPayloads[urlHashed] = [];
                                        }
                                        if(urlToMethodsToPayloads[urlHashed][method] ==null)
                                        urlToMethodsToPayloads[urlHashed][method] = [];
                                        if(data.payloadFilterForUser[urlHashed]!=null && data.payloadFilterForUser[urlHashed][method]!=null){
                                            data.payloadFilterForUser[urlHashed][method].forEach(payload =>{
                                                urlToMethodsToPayloads[urlHashed][method].push(payload);
                                            })
                                        }
                                    }
                                })

                            }
                        }
                    })
                })
            }
            console.log(urls);
            console.log(urlToMethods);
            console.log(urlToMethodsToPayloads);
            await generateHtml(urls, urlToMethods, urlToMethodsToPayloads);
      });
}
