
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("domContentloaded");
//     const urls = ['url1', 'url2', 'url3'];
//     const urlToMethods = {
//         'url1': ['method1', 'method2'],
//         'url2': ['method1'],
//         'url3': ['method1']
//     };
//     const urlToMethodsToPayloads = {
//         'url1': {
//             'method1': ['payload1', 'payload2'],
//             'method2': ['payload3']
//         },
//         'url2': {
//             'method1': ['payload4']
//         },
//         'url3': {
//             'method1': ['payload5', 'payload6']
//         }
//     };
//     console.log("loaded");
//     generateHtml(urls, urlToMethods, urlToMethodsToPayloads);
// });
// function toggleSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     section.classList.toggle('hidden');
// }

// function removeElement(elementId) {
//     const element = document.getElementById(elementId);
//     element.remove();
// }

// function generateHtml(urls, urlToMethods, urlToMethodsToPayloads) {
//     const container = document.getElementById('container');
//     container.innerHTML = '';

//     urls.forEach((url, urlIndex) => {
//         const urlId = `url${urlIndex}-section`;
//         const methodsId = `methods-${urlId}`;
        
//         const urlSection = document.createElement('div');
//         urlSection.id = urlId;
//         urlSection.className = 'section';

//         const urlHeader = document.createElement('div');
//         urlHeader.className = 'section-header';
//         urlHeader.onclick = () => toggleSection(methodsId);
//         urlHeader.innerHTML = `
//             ${url}
//             <button class="remove-btn" onclick="removeElement('${urlId}'); event.stopPropagation();">Remove</button>
//         `;
//         urlSection.appendChild(urlHeader);

//         const methodsSection = document.createElement('div');
//         methodsSection.id = methodsId;
//         methodsSection.className = 'hidden method-section';

//         urlToMethods[url].forEach((method, methodIndex) => {
//             const methodId = `${urlId}-method${methodIndex}-section`;
//             const payloadsId = `payloads-${methodId}`;

//             const methodHeader = document.createElement('div');
//             methodHeader.id = methodId;
//             methodHeader.className = 'method-header';
//             methodHeader.onclick = () => toggleSection(payloadsId);
//             methodHeader.innerHTML = `
//                 ${method}
//                 <button class="remove-btn" onclick="removeElement('${methodId}'); event.stopPropagation();">Remove</button>
//             `;
//             methodsSection.appendChild(methodHeader);

//             const payloadSection = document.createElement('div');
//             payloadSection.id = payloadsId;
//             payloadSection.className = 'hidden payload-section';

//             urlToMethodsToPayloads[url][method].forEach((payload, payloadIndex) => {
//                 const payloadId = `${methodId}-payload${payloadIndex}`;

//                 const payloadDiv = document.createElement('div');
//                 payloadDiv.id = payloadId;
//                 payloadDiv.className = 'payload';
//                 payloadDiv.innerHTML = `
//                     ${payload}
//                     <button class="remove-btn" onclick="removeElement('${payloadId}');">Remove</button>
//                 `;
//                 payloadSection.appendChild(payloadDiv);
//             });

//             methodsSection.appendChild(payloadSection);
//         });

//         urlSection.appendChild(methodsSection);
//         container.appendChild(urlSection);
//     });
// }
