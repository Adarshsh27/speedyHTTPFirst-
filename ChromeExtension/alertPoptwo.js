const MAX_VISIBLE_SECTIONS = 2;
      function toggleSection(section) {
        section.classList.toggle("hidden");
      }

      function showDifferences(extraQueryParams, differentQueryParams) {
        const differencesSection = document.createElement("div");
        differencesSection.className = "two-columns differences-section";
        console.log(extraQueryParams);
        const extraParamsColumn = document.createElement("div");
        extraParamsColumn.className = "column";
        extraParamsColumn.innerHTML = `<h3>Extra Query Params</h3>`;
        if (extraQueryParams != null && extraQueryParams.key != null) {
          // extraQueryParams.forEach((param) => {
            extraParamsColumn.innerHTML += `<p>${extraQueryParams.key}: ${extraQueryParams.badValue}</p>`;
          // });
        } else {
          extraParamsColumn.innerHTML += `<p>No extra query parameters.</p>`;
        }

        const differentParamsColumn = document.createElement("div");
        differentParamsColumn.className = "column";
        differentParamsColumn.innerHTML = `<h3>Different Query Params</h3>`;
        if (differentQueryParams.length > 0) {
          differentQueryParams.forEach((param) => {
            console.log(param);
            differentParamsColumn.innerHTML += `<p>${param.key}: ${param.badValue} ; IdealValue : ${param.idealValue}</p>`;
          });
        } else {
          differentParamsColumn.innerHTML += `<p>No different query parameters.</p>`;
        }

        differencesSection.appendChild(extraParamsColumn);
        differencesSection.appendChild(differentParamsColumn);

        if (
          extraQueryParams.length === 0 &&
          differentQueryParams.length === 0
        ) {
          const identicalMessage = document.createElement("div");
          identicalMessage.className = "message-box";
          identicalMessage.innerHTML =
            "<p>Call is identical to the benchmark. There must be an issue in the backend.</p>";
          differencesSection.appendChild(identicalMessage);
        }

        return differencesSection;
      }

      function showidealCallEntryDetails(
        idealCallEntry,
        extraQueryParams,
        differentQueryParams
      ) {
        const idealDetailsSection = document.createElement("div");
        idealDetailsSection.className = "details-ideal details";

        idealDetailsSection.innerHTML = `
            <p><strong> urlCall : </strong> ${
                idealCallEntry.url
                }</p>
            <p><strong>Response Time:</strong> ${
              idealCallEntry.callMetrics.responseTime
            } ms</p>
            <p><strong>Query Parameters:</strong></p>
            <ul>
                ${Object.entries(idealCallEntry.query)
                  .map(([key, value]) => `<li>${key}: ${value}</li>`)
                  .join("")}
            </ul>
            <p><strong>Payload:</strong></p>
            <ul>
                ${Object.entries(idealCallEntry.payloadMap)
                  .map(([key, value]) => `<li>${key}: ${value}</li>`)
                  .join("")}
            </ul>
        `;

        const showDifferencesButton = document.createElement("button");
        showDifferencesButton.className = "btn";
        showDifferencesButton.innerText = "Show Differences";
        showDifferencesButton.addEventListener("click", (event) => {
          event.stopPropagation();
          const differencesSection = idealDetailsSection.querySelector(
            ".differences-section"
          );
          if (differencesSection) {
            differencesSection.remove();
            showDifferencesButton.innerText = "Show Differences";
          } else {
            const newDifferencesSection = showDifferences(
              extraQueryParams,
              differentQueryParams
            );
            idealDetailsSection.appendChild(newDifferencesSection);
            showDifferencesButton.innerText = "Hide Differences";
          }
        });

        idealDetailsSection.appendChild(showDifferencesButton);

        return idealDetailsSection;
      }

      function showCallDetails(call, extraQueryParams, differentQueryParams) {
        const detailsSection = document.createElement("div");
        detailsSection.className = "details";

        const idealCallEntry = call.idealCallEntry;
        const percentageDeviation =
          ((call.callMetrics.responseTime -
            idealCallEntry.callMetrics.responseTime) /
            idealCallEntry.callMetrics.responseTime) *
          100;

        detailsSection.innerHTML = `
            <p><strong>Response Time:</strong> ${
              call.callMetrics.responseTime
            } ms</p>
            <p><strong>Query Parameters:</strong></p>
            <ul>
                ${Object.entries(call.query)
                  .map(([key, value]) => `<li>${key}: ${value}</li>`)
                  .join("")}
            </ul>
            <p><strong>Payload:</strong></p>
            <ul>
                ${Object.entries(call.payloadMap)
                  .map(([key, value]) => `<li>${key}: ${value}</li>`)
                  .join("")}
            </ul>
            <p><strong>Percentage Deviation from Ideal Response Time:</strong> ${percentageDeviation.toFixed(
              2
            )}%</p>
        `;

        const showIdealButton = document.createElement("button");
        showIdealButton.className = "btn";
        showIdealButton.innerText = "Show Ideal Call Details";
        showIdealButton.addEventListener("click", (event) => {
          event.stopPropagation();
          const idealDetailsSection =
            detailsSection.querySelector(".details-ideal");
          if (idealDetailsSection) {
            idealDetailsSection.remove();
            showIdealButton.innerText = "Show Ideal Call Details";
          } else {
            const newIdealDetailsSection = showidealCallEntryDetails(
              idealCallEntry,
              extraQueryParams,
              differentQueryParams
            );
            detailsSection.appendChild(newIdealDetailsSection);
            showIdealButton.innerText = "Hide Ideal Call Details";
          }
        });

        detailsSection.appendChild(showIdealButton);

        return detailsSection;
      }

      function showValidationFailures(url, missingQueryParams, missingPayload) {
        const validationSection = document.createElement("div");
        validationSection.className = "two-columns";
        console.log("missing query");
        console.log(missingQueryParams);
        console.log("missing payload");
        console.log(missingPayload);
        const missingQueryParamsColumn = document.createElement("div");
        missingQueryParamsColumn.className = "column";
        missingQueryParamsColumn.innerHTML = `<h3>Missing Query Params</h3>`;
        if (missingQueryParams.length > 0) {
          missingQueryParams.forEach((param) => {
// ===========> MAKE CHANGES HERE
        missingQueryParamsColumn.innerHTML += `<p>key :<strong> ${param.key}</p> </strong>
        Given Value : ${param.givenValue} <br>
        Required Value : ${param.requiredValue} <br>
        `;
        });
        } else {
          missingQueryParamsColumn.innerHTML += `<p>No missing query parameters.</p>`;
        }

        const missingPayloadColumn = document.createElement("div");
        missingPayloadColumn.className = "column";
        missingPayloadColumn.innerHTML = `<h3>Missing Payload</h3>`;
        if (missingPayload.length > 0) {
          missingPayload.forEach((param) => {
            // ===========> MAKE CHANGES HERE
            missingPayloadColumn.innerHTML += `<p><strong>key : ${param.key}</strong></p> <br>
        Given Value : ${param.givenValue} <br>
        Required Value : ${param.requiredValue} <br>
        `;
          });
        } else {
          missingPayloadColumn.innerHTML += `<p>No missing payload values.</p>`;
        }

        validationSection.appendChild(missingQueryParamsColumn);
        validationSection.appendChild(missingPayloadColumn);

        return validationSection;
      }

      function createCallEntrySection(
        call
      ) {
        const section = document.createElement("div");
        section.className = "section";
        const extraQueryParams = call.extraQueryParams;
        const differentQueryParams = call.differentQueryParams;
        const header = document.createElement("div");
        header.className = "section-header";
        header.innerText = call.url;

        header.addEventListener("click", () => {
          const details = section.querySelector(".details");
          if (details) {
            details.remove();
          } else {
            const detailsSection = showCallDetails(
              call,
              extraQueryParams,
              differentQueryParams
            );
            section.appendChild(detailsSection);
          }
        });

        const clearButton = document.createElement("button");
        clearButton.className = "clear-btn";
        clearButton.innerText = "Clear";
        clearButton.addEventListener("click", (event) => {
          event.stopPropagation();
          section.remove();
          console.log(call.id);
        });

        section.appendChild(header);
        section.appendChild(clearButton);

        return section;
      }
      function removeValidationFromChromeStorage(id){
            // Retrieve the array from chrome.storage
        chrome.storage.local.get(['validationFailed'], function(result) {
        let validationFailedArray = result.validationFailed || [];
      
      // Find the index of the object with the matching id
        let indexToRemove = validationFailedArray.findIndex(obj => obj.id === id);
      
      // If the object is found, remove it from the array
        if (indexToRemove !== -1) {
          validationFailedArray.splice(indexToRemove, 1);
          
          // Store the updated array back into chrome.storage
          chrome.storage.local.set({ validationFailed: validationFailedArray }, function() {
              console.log('Object removed and storage updated.');
          });
      } else {
          console.log('Object with the given id not found.');
      }
  });
      }
      function createValidationSection(
        id, 
        url,
        missingQueryParams,
        missingPayload
      ) {
        const section = document.createElement("div");
        section.className = "section";
        const header = document.createElement("div");
        header.className = "section-header";
        header.innerText = url;

        header.addEventListener("click", () => {
          const validation = section.querySelector(".two-columns");
          if (validation) {
            validation.remove();
          } else {
            const validationSection = showValidationFailures(
              url,
              missingQueryParams,
              missingPayload
            );
            section.appendChild(validationSection);
          }
        });

        const clearButton = document.createElement("button");
        clearButton.className = "clear-btn";
        clearButton.innerText = "Clear";
        clearButton.addEventListener("click", (event) => {
          event.stopPropagation();
          section.remove();
          removeValidationFromChromeStorage(id);
          console.log(id);
        });

        section.appendChild(header);
        section.appendChild(clearButton);

        return section;
      }

      function addSections(
        container,
        sections,
        showMoreButton,
        createSectionFunc
      ) {
        container.innerHTML = ""; // Clear existing sections
        console.log(createSectionFunc);
        const sectionElements = sections.map(createSectionFunc);

        sectionElements.slice(0, MAX_VISIBLE_SECTIONS).forEach((section) => {
          console.log(section);
          container.appendChild(section);
        });

        if (sectionElements.length > MAX_VISIBLE_SECTIONS) {
          showMoreButton.classList.remove("hidden");
          let expanded = false;

          showMoreButton.addEventListener("click", () => {
            if (expanded) {
              sectionElements
                .slice(MAX_VISIBLE_SECTIONS)
                .forEach((section) => section.remove());
              showMoreButton.innerText = "Show More";
            } else {
              sectionElements.slice(MAX_VISIBLE_SECTIONS).forEach((section) => {
                container.appendChild(section);
              });
              showMoreButton.innerText = "Show Less";
            }
            expanded = !expanded;
          });
        } else {
          showMoreButton.classList.add("hidden");
        }
      }

       document.addEventListener("DOMContentLoaded", async() => {
        const benchmarkContainer = document.getElementById(
          "benchmark-sections"
        );
        const benchmarkShowMore = document.getElementById(
          "benchmark-show-more"
        );
        const validationContainer = document.getElementById(
          "validation-sections"
        );
        const validationShowMore = document.getElementById(
          "validation-show-more"
        );
        var benchmarkCalls = [];
        var validationFailures = [];
       /*
        var benchmarkCalls = [
        {
          id: "asdasda",
          url: "https://example.com/api/v1/resource1",
          query: { param1: "value1", param2: "value2" },
          payloadMap: { key1: "data1", key2: "data2" },
          callMetrics: { responseTime: 1200 },
          extraQueryParams : [{key : "value",
          value : "key"}],
               differentQueryParams : [{key : "value",
          value : "key"}],
          idealCallEntry: {
            url: "https://example.com/api/v1/resource",
            query: { param1: "value3", param2: "value2" },
            payloadMap: { key1: "data1", key2: "data2" },
            callMetrics: { responseTime: 1100 },
          },
        },
        {
          url: "https://example.com/api/v1/resource1",
          query: { param1: "value1", param2: "value2" },
          payloadMap: { key1: "data1", key2: "data2" },
          callMetrics: { responseTime: 1300 },
          extraQueryParams : [{key : "value",
          value : "key"}],
               differentQueryParams : [{key : "value",
          value : "key"}],
          idealCallEntry: {
            url: "https://example.com/api/v1/resource",
            query: { param1: "value1", param2: "value2" },
            payloadMap: { key1: "data1", key2: "data2" },
            callMetrics: { responseTime: 1000 },
          },
        },
        {
          url: "https://example.com/api/v1/resource3",
          query: { param1: "value1", param2: "value2" },
          payloadMap: { key1: "data1", key2: "data2" },
          callMetrics: { responseTime: 1400 },
          extraQueryParams : [{key : "value",
          value : "key"}],
               differentQueryParams : [{key : "value",
          value : "key"} , {key : "value2" , value : "keys2"}],
          idealCallEntry: {
            url: "https://example.com/api/v1/resource",
            query: { param1: "value1", param2: "value2" },
            payloadMap: { key1: "data1", key2: "data2" },
            callMetrics: { responseTime: 1000 },
          },
        },
        {
          url: "https://example.com/api/v1/resource4",
          query: { param1: "value1", param2: "value2" },
          payloadMap: { key1: "data1", key2: "data2" },
          callMetrics: { responseTime: 1500 },   
                extraQueryParams : [{key : "value",
          value : "key"}],
               differentQueryParams : [{key : "value",
          value : "key"}],
          idealCallEntry: {
            url: "https://example.com/api/v1/resource",
            query: { param1: "value1", param2: "value2" },
            payloadMap: { key1: "data1", key2: "data2" },
            callMetrics: { responseTime: 1000 },
          },
        },
      ];
      


      var validationFailures = [
        {
          url: "https://example.com/api/v1/resource1",
          missingQueryParams: ["param1", "param3"],
          missingPayload: ["key1", "key3"],
        },
        {
          url: "https://example.com/api/v1/resource2",
          missingQueryParams: ["param1"],
          missingPayload: ["key2"],
        },
        {
          url: "https://example.com/api/v1/resource3",
          missingQueryParams: [],
          missingPayload: ["key3"],
        },
        {
          url: "https://example.com/api/v1/resource4",
          missingQueryParams: ["param2"],
          missingPayload: [],
        },
      ];
*/
       
            await chrome.storage.local.get(['benchmarkFailed', 'validationFailed'], function(result) {
             Object.assign(benchmarkCalls , result.benchmarkFailed || []);
             Object.assign(validationFailures , result.validationFailed || []);
            //let benchmarkFailed = result.benchmarkFailed || [];
            //let validationFailed = result.validationFailed || [];
      
            console.log('Retrieved array1:', benchmarkCalls);
            console.log('Retrieved array2:', validationFailures);
        
        // Example data

        if (benchmarkCalls.length > 0) {
          document
            .getElementById("benchmark-container")
            .classList.remove("hidden");
          document
            .getElementById("benchmark-heading")
            .classList.remove("hidden");
          addSections(
            benchmarkContainer,
            benchmarkCalls,
            benchmarkShowMore,
            (call) =>
              createCallEntrySection(
                call
              )
          );
        } else {
          document
            .getElementById("benchmark-container")
            .classList.add("hidden");
          document.getElementById("benchmark-heading").classList.add("hidden");
        }

        if (validationFailures.length > 0) {
          console.log("adding validaition ");
          document
            .getElementById("validation-container")
            .classList.remove("hidden");
          document
            .getElementById("validation-heading")
            .classList.remove("hidden");
          addSections(
            validationContainer,
            validationFailures,
            validationShowMore,
            (failure) =>
              createValidationSection(
                failure.id,
                failure.url,
                failure.missingQueryParams,
                failure.missingPayload
              )
          );
        } else {
          document
            .getElementById("validation-container")
            .classList.add("hidden");
          document.getElementById("validation-heading").classList.add("hidden");
        }

        // Check length of sections and display "Show More" button accordingly
        if (benchmarkCalls.length > MAX_VISIBLE_SECTIONS) {
          benchmarkShowMore.classList.remove("button2");
        }

        if (validationFailures.length > MAX_VISIBLE_SECTIONS) {
          validationShowMore.classList.remove("button2");
        }
      });
      });
      document.getElementById("clearAll").addEventListener("click" , () =>{
        chrome.storage.local.clear();
        location.reload();

      })


      document.getElementById('downloadButton').addEventListener('click', () => {
        // Step 1: Retrieve data from chrome.local.storage
        chrome.storage.local.get(null, (items) => {
          // Step 2: Convert the data to a string format
          const dataStr = JSON.stringify(items, null, 2);
  
          // Step 3: Create a Blob from the string
          const blob = new Blob([dataStr], { type: 'application/json' });
  
          // Step 4: Create a link element to trigger the download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'localStorageData.json';
          document.body.appendChild(a);
          a.click();
  
          // Clean up
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      });
  
