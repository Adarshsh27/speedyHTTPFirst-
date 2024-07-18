
    var user_info = {
        uid: '',
        name: ''
    }

    document.addEventListener('DOMContentLoaded', function () {
        chrome.runtime.sendMessage({
            message: 'load'
        }, async (response) => {
            user_info.uid = response.uid;
            user_info.name = response.name;
            if (response.uid == undefined) {
                chrome.runtime.sendMessage({
                    message: "timed_out"
                }, (response) => {
                    window.close();
                })
            }
        });
    });
        
        document.getElementById('add-section-btn').addEventListener('click', resposnse =>{
            addSection();
        });
        function addSection() {
            console.log("adding");
            const section = document.createElement('div');
            section.className = 'form-section';

            const urlSelect = document.createElement('select');
            urlSelect.className = 'url-input';
            // const urlOptions = ['https://api.example.com/data1', 'https://api.example.com/data2', 'https://api.example.com/data3'];
            // urlOptions.forEach(url => {
            //     const option = document.createElement('option');
            //     option.value = url;
            //     option.textContent = url;
            //     urlSelect.appendChild(option);
            // });
            fetch('http://localhost:8080/userEntry/url/'+user_info.uid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.text())
                .then((data) =>  {
                    
                    // Assuming the response is an array of objects with url and method properties
                    console.log("printing data");
                    console.log(data);
                    // console.log(data.data);
                    console.log(JSON.parse(data));
                    data = JSON.parse(data);
                    console.log(typeof(data));
                    
                    if (data) {
                        console.log(typeof(data));
                        console.log("printing item");
                        // console.log(data[0]);
                        data.forEach(item=>{
                            console.log(item);
                            // console.log(item);
                            const option = document.createElement('option');
                            option.value = JSON.parse(JSON.stringify(item));
                            option.text = JSON.parse(JSON.stringify(item));
                            urlSelect.appendChild(option);
                        })
                        
                        /*data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.url;
                            option.text = item.url;
                            urlSelect.appendChild(option);
                        });*/
                    }
                    urlSelect.addEventListener('change', function(){
                        const selectedUrl = this.value;
                        console.log(selectedUrl);
                        // const methodSelect = document.getElementById('methodSelect');
                        /*
                        methodSelect.innerHTML = '<option value="" class="methodOption" disabled selected>Select Method</option>'; // Clear previous options
                        const option = document.createElement('option');
                        option.value = "method";
                        option.text = "method";
                        methodSelect.appendChild(option);
                        methodSelect.style.display = 'inline-block'; // Show the method dropdown 
                        */
                       
                       let body = {
                           id : user_info.uid,
                           userUrl : selectedUrl
                        };
                        console.log("body");
                        console.log(body);
                        // Fetch methods based on the selected URL
                        fetch(`http://localhost:8080/userEntry/method`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body : JSON.stringify(body)
                        })
                            .then(response => response.text())
                            .then(data => {
                                const methodSelect = document.createElement('methodSelect');
                                methodSelect.innerHTML = '<option value="" disabled selected>Select Method</option>'; // Clear previous options
                                data = JSON.parse(data);
                                if (data) {
                                    data.forEach(method => {
                                        const option = document.createElement('option');
                                        option.value = JSON.parse(JSON.stringify(method));
                                        option.text = JSON.parse(JSON.stringify(method));
                                        methodSelect.appendChild(option);
                                    });
                                    methodSelect.style.display = 'inline-block'; 
                                    methodSelect.style.zIndex = 100;// Show the method dropdown
                                }
                                console.log(methodSelect);
                            })
                            .catch(error => console.log(error));
                            
                    });
                })
                .catch(error => console.log(error));
            // methodSelect.classList.add('hidden');
        //    
       
            const networkCallsCheckbox = document.createElement('input');
            networkCallsCheckbox.type = 'checkbox';
            networkCallsCheckbox.className = 'network-calls-checkbox';

            const networkCallsLabel = document.createElement('label');
            networkCallsLabel.textContent = ' Get my network calls';
            networkCallsLabel.className = 'checkbox-label';

            const timestampCheckbox = document.createElement('input');
            timestampCheckbox.type = 'checkbox';
            timestampCheckbox.className = 'timestamp-checkbox';
            timestampCheckbox.addEventListener('change', () => toggleTimestampInputs(timestampCheckbox, section));

            const timestampLabel = document.createElement('label');
            timestampLabel.textContent = ' Add timestamps';
            timestampLabel.className = 'checkbox-label';

            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'Submit';
            submitBtn.addEventListener('click', () => fetchData(section));

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear';
            clearBtn.className = 'clear-btn';
            clearBtn.addEventListener('click', () => section.remove());

            const checkboxSection = document.createElement('div');
            checkboxSection.className = 'checkbox-section';
            checkboxSection.appendChild(networkCallsCheckbox);
            checkboxSection.appendChild(networkCallsLabel);
            checkboxSection.appendChild(document.createElement('br'));
            checkboxSection.appendChild(timestampCheckbox);
            checkboxSection.appendChild(timestampLabel);

            section.appendChild(urlSelect);
            // section.appendChild(methodSelect);
            section.appendChild(checkboxSection);
            section.appendChild(submitBtn);
            section.appendChild(clearBtn);

            document.getElementById('sections').appendChild(section);
    }
        function toggleTimestampInputs(checkbox, section) {
            if (checkbox.checked) {
                const timestampSection = document.createElement('div');
                timestampSection.className = 'timestamp-section';
                timestampSection.id = 'timestamp-section';

                const fromInput = document.createElement('input');
                fromInput.type = 'text';
                fromInput.placeholder = 'From';
                fromInput.className = 'timestamp-input';
                fromInput.id = 'from-input';

                const toInput = document.createElement('input');
                toInput.type = 'text';
                toInput.placeholder = 'To';
                toInput.className = 'timestamp-input';
                toInput.id = 'to-input';

                timestampSection.appendChild(fromInput);
                timestampSection.appendChild(toInput);

                section.insertBefore(timestampSection, section.querySelector('button'));

                flatpickr(fromInput, { enableTime: true, dateFormat: "Y-m-d H:i" });
                flatpickr(toInput, { enableTime: true, dateFormat: "Y-m-d H:i" });
            } else {
                const timestampSection = section.querySelector('#timestamp-section');
                if (timestampSection) {
                    timestampSection.remove();
                }
            }
        }

        function fetchData(section) {
            const urlInput = section.querySelector('.url-input').value;
            const methodInput = section.querySelector('.method-input').value;
            const networkCallsChecked = section.querySelector('.network-calls-checkbox').checked;
            const timestampCheckboxChecked = section.querySelector('.timestamp-checkbox').checked;
            const fromTimestamp = timestampCheckboxChecked ? section.querySelector('#from-input')._flatpickr.selectedDates[0] : null;
            const toTimestamp = timestampCheckboxChecked ? section.querySelector('#to-input')._flatpickr.selectedDates[0] : null;

            const fromTimestampEpoch = fromTimestamp ? fromTimestamp.getTime() : 0;
            const toTimestampEpoch = toTimestamp ? toTimestamp.getTime() : Date.now();

            const requestData = {
                url: urlInput,
                method: methodInput,
                flag: networkCallsChecked,
                time1: fromTimestampEpoch,
                time2: toTimestampEpoch,
                uid: user_info.uid
            };
            displayData(section , {
                responseTime : 1000,
                nearestEntry : {
                    id : "sdfafd",
                    url : "adfafa",
                    method :"PUT",
                    callMetrics : {
                        responseTime : 192
                    }
                }
                
            });
            console.log('Request Data:', requestData);
            
            fetch(`http://localhost:8080/networkCalls/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            }).then(response => response.json()).catch(error => {
                console.log(error);
                alert("There was some error");
            }).then(data => {
                displayData(section, data);
            }).catch(error => {
                console.log(error);
                alert("There are not enough calls");
            });
            
        }
        

        

        function displayData(section, data) {
            const responseTime = document.createElement('div');
            responseTime.innerHTML = `Response Time: ${data.responseTime} ms`;

            const nearestEntry = document.createElement('div');
            nearestEntry.innerHTML = `Nearest Entry: <br>
                ID: ${data.nearestEntry.id} <br>
                URL: ${data.nearestEntry.url} <br>
                Method: ${data.nearestEntry.method} <br>
                Response Time: ${data.nearestEntry.callMetrics.responseTime} ms`;

            const responseSection = document.createElement('div');
            responseSection.className = 'response-section';
            responseSection.appendChild(responseTime);
            responseSection.appendChild(nearestEntry);

            section.appendChild(responseSection);
        }
        
        
        // const methodSelect = document.createElement('select');
        // methodSelect.className = 'method-input';
        // const methodOptions = ['GET', 'POST', 'PUT', 'DELETE'];
        // methodOptions.forEach(method => {
        //     const option = document.createElement('option');
        //     option.value = method;
        //     option.textContent = method;
        //     methodSelect.appendChild(option);
        // });
    
