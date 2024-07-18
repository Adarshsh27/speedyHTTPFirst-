
    const MAX_VISIBLE_SECTIONS = 2;
    function toggleSection(section) {
      section.classList.toggle("hidden");
    }

    function showDifferences(extraQueryParams, differentQueryParams) {
      const differencesSection = document.createElement("div");
      differencesSection.className = "two-columns differences-section";

      const extraParamsColumn = document.createElement("div");
      extraParamsColumn.className = "column";
      extraParamsColumn.innerHTML = `<h3>Extra Query Params</h3>`;
      if (extraQueryParams.length > 0) {
        extraQueryParams.forEach((param) => {
          extraParamsColumn.innerHTML += `<p>${param.key}: ${param.value}</p>`;
        });
      } else {
        extraParamsColumn.innerHTML += `<p>No extra query parameters.</p>`;
      }

      const differentParamsColumn = document.createElement("div");
      differentParamsColumn.className = "column";
      differentParamsColumn.innerHTML = `<h3>Different Query Params</h3>`;
      if (differentQueryParams.length > 0) {
        differentQueryParams.forEach((param) => {
          console.log(param);
          differentParamsColumn.innerHTML += `<p>${param.key}: ${param.value}</p>`;
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

    function showIdealCallDetails(
      idealCall,
      extraQueryParams,
      differentQueryParams
    ) {
      const idealDetailsSection = document.createElement("div");
      idealDetailsSection.className = "details-ideal details";

      idealDetailsSection.innerHTML = `
          <p><strong> urlCall : </strong> ${idealCall.url}</p>
          <p><strong>Response Time:</strong> ${idealCall.callMetrics.responseTime} ms</p>
          <p><strong>Query Parameters:</strong></p>
          <ul>
              ${Object.entries(idealCall.query)
                .map(([key, value]) => `<li>${key}: ${value}</li>`)
                .join("")}
          </ul>
          <p><strong>Payload:</strong></p>
          <ul>
              ${Object.entries(idealCall.payloadMap)
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

      const idealCall = call.idealCall;
      const percentageDeviation =
        ((call.callMetrics.responseTime -
          idealCall.callMetrics.responseTime) /
          idealCall.callMetrics.responseTime) *
        100;

      detailsSection.innerHTML = `
          <p><strong>Response Time:</strong> ${call.callMetrics.responseTime} ms</p>
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
          const newIdealDetailsSection = showIdealCallDetails(
            idealCall,
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

      const missingQueryParamsColumn = document.createElement("div");
      missingQueryParamsColumn.className = "column";
      missingQueryParamsColumn.innerHTML = `<h3>Missing Query Params</h3>`;
      if (missingQueryParams.length > 0) {
        missingQueryParams.forEach((param) => {
          missingQueryParamsColumn.innerHTML += `<p>${param}</p>`;
        });
      } else {
        missingQueryParamsColumn.innerHTML += `<p>No missing query parameters.</p>`;
      }

      const missingPayloadColumn = document.createElement("div");
      missingPayloadColumn.className = "column";
      missingPayloadColumn.innerHTML = `<h3>Missing Payload</h3>`;
      if (missingPayload.length > 0) {
        missingPayload.forEach((param) => {
          missingPayloadColumn.innerHTML += `<p>${param}</p>`;
        });
      } else {
        missingPayloadColumn.innerHTML += `<p>No missing payload values.</p>`;
      }

      validationSection.appendChild(missingQueryParamsColumn);
      validationSection.appendChild(missingPayloadColumn);

      return validationSection;
    }

    function createCallEntrySection(call) {
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
      });

      header.appendChild(clearButton);
      section.appendChild(header);

      return section;
    }

    function createValidationEntrySection(validation) {
      const section = document.createElement("div");
      section.className = "section";
      const header = document.createElement("div");
      header.className = "section-header";
      header.innerText = validation.url;

      header.addEventListener("click", () => {
        const details = section.querySelector(".details");
        if (details) {
          details.remove();
        } else {
          const validationSection = showValidationFailures(
            validation.url,
            validation.missingQueryParams,
            validation.missingPayload
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
      });

      header.appendChild(clearButton);
      section.appendChild(header);

      return section;
    }

    function populateSection(containerId, showMoreButtonId, headingId, data, createSectionFunction) {
      const container = document.getElementById(containerId);
      const showMoreButton = document.getElementById(showMoreButtonId);
      const heading = document.getElementById(headingId);

      container.innerHTML = "";
      if (data.length > 0) {
        data.forEach((entry, index) => {
          const section = createSectionFunction(entry);
          if (index >= MAX_VISIBLE_SECTIONS) {
            section.classList.add("hidden");
          }
          container.appendChild(section);
        });

        if (data.length > MAX_VISIBLE_SECTIONS) {
          showMoreButton.classList.remove("hidden");
          showMoreButton.addEventListener("click", () => {
            container.querySelectorAll(".hidden").forEach((section) => {
              section.classList.remove("hidden");
            });
            showMoreButton.classList.add("hidden");
          });
        }

        container.classList.remove("hidden");
        heading.classList.remove("hidden");
      } else {
        container.classList.add("hidden");
        heading.classList.add("hidden");
        showMoreButton.classList.add("hidden");
      }
    }

    function displayBenchmarkCalls(benchmarkCalls) {
      populateSection("benchmark-sections", "benchmark-show-more", "benchmark-heading", benchmarkCalls, createCallEntrySection);
    }

    function displayValidationFailures(validationFailures) {
      populateSection("validation-sections", "validation-show-more", "validation-heading", validationFailures, createValidationEntrySection);
    }

    const data = {
      benchmarkCalls: [
        {
          url: "https://api.example.com/endpoint1",
          callMetrics: { responseTime: 200 },
          idealCall: {
            url: "https://api.example.com/idealEndpoint1",
            callMetrics: { responseTime: 150 },
            query: { param1: "value1", param2: "value2" },
            payloadMap: { key1: "value1", key2: "value2" }
          },
          extraQueryParams: [{ key: "param3", value: "value3" }],
          differentQueryParams: [{ key: "param2", value: "differentValue" }],
          query: { param1: "value1", param2: "differentValue", param3: "value3" },
          payloadMap: { key1: "value1", key2: "value2" }
        },
        // More benchmark calls...
      ],
      validationFailures: [
        {
          url: "https://api.example.com/endpoint2",
          missingQueryParams: ["param4"],
          missingPayload: ["key3"]
        },
        // More validation failures...
      ]
    };

    displayBenchmarkCalls(data.benchmarkCalls);
    displayValidationFailures(data.validationFailures);

    document.getElementById("clearAll").addEventListener("click", () => {
      const sections = document.querySelectorAll(".section");
      sections.forEach(section => section.remove());
      const headings = document.querySelectorAll("h2");
      headings.forEach(heading => heading.classList.add("hidden"));
    });

