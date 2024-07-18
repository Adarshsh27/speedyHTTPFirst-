// async function sha256(message) {
//     const msgBuffer = new TextEncoder().encode(message);
//     const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//     return hashHex;
// }

// const { useActionState } = require("react");

// function toggleSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     section.classList.toggle('hidden');
// }

// function removeElement(elementId) {
//     const element = document.getElementById(elementId);
//     const urlHash = element.getAttribute('data-url-hash');
//     const method = element.getAttribute('data-method');
//     const payload = element.getAttribute('data-payload');

//     if (payload) {
//         console.log(`Payload removed: ${payload} (Method: ${method}, URL Hash: ${urlHash})`);
//         // Send to database: payload, method, urlHash
//     } else if (method) {
//         console.log(`Method removed: ${method} (URL Hash: ${urlHash})`);
//         // Send to database: method, urlHash
//     } else if (urlHash) {
//         console.log(`URL removed: ${urlHash}`);
//         // Send to database: urlHash
//     }

//     element.remove();
// }

// async function generateHtml(urls, urlToMethods, urlToMethodsToPayloads) {
//     const container = document.getElementById('container');
//     container.innerHTML = '';

//     for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
//         const url = urls[urlIndex];
//         const urlHash = await sha256(url);
//         const urlId = `url${urlIndex}-section`;
//         const methodsId = `methods-${urlId}`;

//         const urlSection = document.createElement('div');
//         urlSection.id = urlId;
//         urlSection.className = 'section';
//         urlSection.setAttribute('data-url-hash', urlHash);

//         const urlHeader = document.createElement('div');
//         urlHeader.className = 'section-header';
//         urlHeader.setAttribute('data-methods-id', methodsId);
//         urlHeader.innerHTML = `
//             ${url}
//             <button class="remove-btn" data-url-id="${urlId}">Remove</button>
//         `;
//         urlSection.appendChild(urlHeader);

//         const methodsSection = document.createElement('div');
//         methodsSection.id = methodsId;
//         methodsSection.className = 'hidden method-section';

//         if (urlToMethods[urlHash]) {
//             urlToMethods[urlHash].forEach((method, methodIndex) => {
//                 const methodId = `${urlId}-method${methodIndex}-section`;
//                 const payloadsId = `payloads-${methodId}`;

//                 const methodHeader = document.createElement('div');
//                 methodHeader.id = methodId;
//                 methodHeader.className = 'method-header';
//                 methodHeader.setAttribute('data-payloads-id', payloadsId);
//                 methodHeader.setAttribute('data-url-hash', urlHash);
//                 methodHeader.setAttribute('data-method', method);
//                 methodHeader.innerHTML = `
//                     ${method}
//                     <button class="remove-btn" data-method-id="${methodId}">Remove</button>
//                 `;
//                 methodsSection.appendChild(methodHeader);

//                 const payloadSection = document.createElement('div');
//                 payloadSection.id = payloadsId;
//                 payloadSection.className = 'hidden payload-section';

//                 if (urlToMethodsToPayloads[urlHash][method]) {
//                     urlToMethodsToPayloads[urlHash][method].forEach((payload, payloadIndex) => {
//                         const payloadId = `${methodId}-payload${payloadIndex}`;

//                         const payloadDiv = document.createElement('div');
//                         payloadDiv.id = payloadId;
//                         payloadDiv.className = 'payload';
//                         payloadDiv.setAttribute('data-url-hash', urlHash);
//                         payloadDiv.setAttribute('data-method', method);
//                         payloadDiv.setAttribute('data-payload', payload);
//                         payloadDiv.innerHTML = `
//                             ${payload}
//                             <button class="remove-btn" data-payload-id="${payloadId}">Remove</button>
//                         `;
//                         payloadSection.appendChild(payloadDiv);
//                     });
//                 }

//                 methodsSection.appendChild(payloadSection);
//             });
//         }

//         urlSection.appendChild(methodsSection);
//         container.appendChild(urlSection);
//     }

//     document.querySelectorAll('.section-header').forEach(header => {
//         header.addEventListener('click', function () {
//             const methodsId = this.getAttribute('data-methods-id');
//             toggleSection(methodsId);
//         });
//     });

//     document.querySelectorAll('.method-header').forEach(header => {
//         header.addEventListener('click', function () {
//             const payloadsId = this.getAttribute('data-payloads-id');
//             toggleSection(payloadsId);
//         });
//     });

//     document.querySelectorAll('.remove-btn').forEach(button => {
//         button.addEventListener('click', function (event) {
//             const urlId = this.getAttribute('data-url-id');
//             const methodId = this.getAttribute('data-method-id');
//             const payloadId = this.getAttribute('data-payload-id');

//             if (urlId) removeElement(urlId);
//             if (methodId) removeElement(methodId);
//             if (payloadId) removeElement(payloadId);

//             event.stopPropagation();
//         });
//     });
// }

// document.addEventListener('DOMContentLoaded', async function () {
//     // Example data
//     // Example data
//     // const urls = ['url1', 'url2', 'url3', 'url4'];
//     // const urlToMethods = {
//     //     "2b9a40694179883a0dd41b2b16be242746cff1ac8cfd0fdfb44b7279bfc56362" : ['POST' , 'UPDATE'],
//     //     "5c79bf2476b63a5908261aaad68719c6a2e62e5a3177f8ab97f82da348ba6e37" : ['DELETE' , 'HI']
//     // };
//     // const urlToMethodsToPayloads = {
//     //     "2b9a40694179883a0dd41b2b16be242746cff1ac8cfd0fdfb44b7279bfc56362" : {
//     //         "POST" : ["Adarsh" , "Checking"],
            
//     //     },
//     //     "5c79bf2476b63a5908261aaad68719c6a2e62e5a3177f8ab97f82da348ba6e37" : {
//     //         'HI' : ["WE " , "ARE"]
//     //     }
//     // };

//     // await generateHtml(urls, urlToMethods, urlToMethodsToPayloads);
//     go("111890240202136979411");
// });

// async function go(uid){
//     // Example data
//     console.log(uid);
//     const urls = [];
//     const urlToMethods = new Map();
//     const urlToMethodsToPayloads = new Map();
// fetch(`http://localhost:8080/userEntry/` + uid , {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   .then((response) => (response.json())).catch(error => {
//     apiAddUserCall({
//       uid : global_user_info.sub,
//       name : global_user_info.name
//     });
//   })
//   .then(async (data) => {
//     console.log(data);
//         if("userProvidedUrl" in data){
//             data.userProvidedUrl.forEach(url =>{
//                 urls.push(url);
//                 sha256(url).then(urlHashed => {
//                     if(data.methodsToTrackForUser != null){
//                         urlToMethods[urlHashed] = [];
//                         if(data.methodsToTrackForUser[urlHashed] != null){
//                             data.methodsToTrackForUser[urlHashed].forEach(method =>{
//                                 urlToMethods[urlHashed].push(method);
//                                 if(data.payloadFilterForUser != null){
//                                     urlToMethodsToPayloads[urlHashed] = [];
//                                     urlToMethodsToPayloads[urlHashed][method] = [];
//                                     if(data.payloadFilterForUser[urlHashed]!=null && data.payloadFilterForUser[urlHashed][method]!=null){
//                                         data.payloadFilterForUser[urlHashed][method].forEach(payload =>{
//                                             urlToMethodsToPayloads[urlHashed][method].push(payload);
//                                         })
//                                     }
//                                 }
//                             })

//                         }
//                     }
//                 })
//             })
//         }

//         console.log("urls");
//         console.log(urls);
//         console.log("urlstoMethods");
//         console.log(urlToMethods);
//         console.log("urlMethodPaylods");
//         console.log(urlToMethodsToPayloads);
//         await generateHtml(urls, urlToMethods, urlToMethodsToPayloads);
//   });
// }
var user_info = {
    uid: '',
    name: ''
};
const urls = [];
const urlToMethods = new Map();
const urlToMethodsToPayloads = new Map();

const urlMap = new Map();

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
async function deleteUrlApiCall(message , url){
    fetch(`http://localhost:8080/userEntry/` + user_info.uid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(message)
    })
        .then((response) => (response.json())).catch(error => {
            console.log("error");
        }).then(async (data) => {
            if(message.message == "payload"){
                let simpleURL = getSimpleUrl(url);
                let simpleURLHashed = await sha256(simpleURL);
                let secondMessage = {
                    message : "removeURL",
                    action : "payload",
                    simpleUrlHashed : simpleURLHashed,
                    method : message.method[0], 
                    payload : message.payload[0],
                    simpleUrl : simpleURL
                }
                chrome.runtime.sendMessage(secondMessage , (response) => {
                    console.log("url successfully removed");
                })
            }else if(message.message == "method"){
                let simpleURL = getSimpleUrl(url);
                let simpleURLHashed = await sha256(simpleURL);
                let secondMessage = {
                    message : "removeURL",
                    action : "method",
                    simpleUrlHashed : simpleURLHashed,
                    method : message.method[0],
                    simpleUrl : simpleURL
                }
                chrome.runtime.sendMessage(secondMessage , (response) => {
                    console.log("url successfully removed");
                })
            }else if(message.message == "url"){
                let simpleURL = getSimpleUrl(url);
                let simpleUrlHashed = await sha256(simpleURL);
                let secondMessage = {
                    message : "removeURL",
                    action : "url",
                    simpleUrlHashed : simpleUrlHashed,
                    simpleUrl : simpleURL
                }
                chrome.runtime.sendMessage(secondMessage , (response) => {
                    console.log("url successfully removed");
                })
            }
        });
}
async function removePayload(payload , method , url) {
    let message = {
        message : "payload",
        uid : user_info.uid,
        method : [method],
        userUrl : url, 
        payload : [payload]
    }
    let simpleURL = getSimpleUrl(url);
    let simpleURLHashed = await sha256(simpleURL);
    let secondMessage = {
        message : "removeURL",
        action : "payload",
        simpleUrlHashed : simpleURLHashed,
        method : method, 
        payload : payload,
        simpleUrl : simpleURL
    }
    await deleteUrlApiCall(message , url);
    // chrome.runtime.sendMessage(secondMessage , (response) => {
    //     console.log("url successfully removed");
    // })
}

async function removeMethod(method , url) {
    let message = {
        message : "method",
        uid : user_info.uid,
        method : [method],
        userUrl : url, 
        payload : []
    }
    let simpleURL = getSimpleUrl(url);
    let simpleURLHashed = await sha256(simpleURL);
    let secondMessage = {
        message : "removeURL",
        action : "method",
        simpleUrlHashed : simpleURLHashed,
        method : method,
        simpleUrl : simpleURL
    }
    await deleteUrlApiCall(message , url);
    // chrome.runtime.sendMessage(secondMessage , (response) => {
    //     console.log("url successfully removed");
    // })
    
}

async function removeUrl(url) {
    let hash = await sha256(url);
    console.log(urlToMethods[hash]);
    let message = {
        message : "url",
        uid : user_info.uid,
        method : urlToMethods[hash],
        userUrl : url, 
        payload : []
    }
    let simpleURL = getSimpleUrl(url);
    let simpleUrlHashed = await sha256(simpleURL);
    let secondMessage = {
        message : "removeURL",
        action : "url",
        simpleUrlHashed : simpleUrlHashed,
        simpleUrl : simpleURL
    }
    await deleteUrlApiCall(message , url);
    // chrome.runtime.sendMessage(secondMessage , (response) => {
    //     console.log("url successfully removed");
    // })
}

function removeElement(elementId) {
    const element = document.getElementById(elementId);
    const urlHash = element.getAttribute('data-url-hash');
    const method = element.getAttribute('data-method');
    const payload = element.getAttribute('data-payload');
    const actualUrl = urlMap.get(urlHash);

    if (payload) {
        console.log(`Payload removed: ${payload} (Method: ${method}, URL Hash: ${urlHash})`);
        removePayload(payload , method , actualUrl);
        // Send to database: payload, method, urlHash
    } else if (method) {
        console.log(`Method removed: ${method} (URL Hash: ${urlHash})`);
        removeMethod(method , actualUrl);
        // Send to database: method, urlHash
    } else if (urlHash) {
        console.log(`URL removed: ${actualUrl}`);
        removeUrl(actualUrl);
        // Send to database: actualUrl
    }

    element.remove();
}

async function generateHtml(urls, urlToMethods, urlToMethodsToPayloads) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
        const url = urls[urlIndex];
        const urlHash = await sha256(url);
        urlMap.set(urlHash, url);
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

            if (urlId) removeElement(urlId);
            if (methodId) removeElement(methodId);
            if (payloadId) removeElement(payloadId);

            event.stopPropagation();
        });
    });
}

function getSimpleUrl(inputString) {
   
    // Find the position of the rightmost '*'
    const lastAsteriskIndex = inputString.lastIndexOf('*');

    if (lastAsteriskIndex !== -1) {
        // Extract the substring from the start to the position of the rightmost '*'
        let result = inputString.substring(0, lastAsteriskIndex + 1);

        // Remove the trailing '/' if it exists
        if (result.endsWith('/')) {
            result = result.slice(0, -1);
        }

        return result;
    }

    // If there is no '*', return the original string or handle the case accordingly
    return inputString;
}

document.addEventListener('DOMContentLoaded', async function () {

    await chrome.runtime.sendMessage({
        message: 'load'
    }, async (response) => {
        user_info.uid = response.uid;
        console.log(user_info);
        if(response.uid === undefined){
            chrome.runtime.sendMessage({
                message : "timed_out"
            } , (response) =>{
                window.close();
            })
        }
        go(response.uid);
    });
});

async function go(uid) {

    fetch(`http://localhost:8080/userEntry/` + uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => (response.json())).catch(error => {
         
        })
        .then(async (data) => {
            if ("userProvidedUrl" in data) {
                data.userProvidedUrl.forEach(url => {
                    urls.push(url);
                    sha256(url).then(urlHashed => {
                        if (data.methodsToTrackForUser != null) {
                            if (urlToMethods[urlHashed] == null) {
                                urlToMethods[urlHashed] = [];
                            }
                            if (data.methodsToTrackForUser[urlHashed] != null) {
                                data.methodsToTrackForUser[urlHashed].forEach(method => {
                                    urlToMethods[urlHashed].push(method);
                                    if (data.payloadFilterForUser != null) {
                                        if (urlToMethodsToPayloads[urlHashed] == null) {
                                            urlToMethodsToPayloads[urlHashed] = [];
                                        }
                                        if (urlToMethodsToPayloads[urlHashed][method] == null)
                                            urlToMethodsToPayloads[urlHashed][method] = [];
                                        if (data.payloadFilterForUser[urlHashed] != null && data.payloadFilterForUser[urlHashed][method] != null) {
                                            data.payloadFilterForUser[urlHashed][method].forEach(payload => {
                                                urlToMethodsToPayloads[urlHashed][method].push(payload);
                                            });
                                        }
                                    }
                                });

                            }
                        }
                    });
                });
            }
            await generateHtml(urls, urlToMethods, urlToMethodsToPayloads);
        });
}