
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
      <p><strong> urlCall : </strong> ${
          idealCall.url
          }</p>
      <p><strong>Response Time:</strong> ${
        idealCall.callMetrics.responseTime
      } ms</p>
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

function createCallEntrySection(
  call,
  extraQueryParams,
  differentQueryParams
) {
  const section = document.createElement("div");
  section.className = "section";

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

function createValidationSection(
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
  const benchmarkContainer =
    document.getElementById("benchmark-sections");
  const benchmarkShowMore = document.getElementById(
    "benchmark-show-more"
  );
  const validationContainer = document.getElementById(
    "validation-sections"
  );
  const validationShowMore = document.getElementById(
    "validation-show-more"
  );

  // Example data
  
  /*
  const benchmarkCalls = [
    {
      id: "asdasda",
      url: "https://example.com/api/v1/resource1",
      query: { param1: "value1", param2: "value2" },
      payloadMap: { key1: "data1", key2: "data2" },
      callMetrics: { responseTime: 1200 },
      idealCall: {
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
      idealCall: {
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
      idealCall: {
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
      idealCall: {
        url: "https://example.com/api/v1/resource",
        query: { param1: "value1", param2: "value2" },
        payloadMap: { key1: "data1", key2: "data2" },
        callMetrics: { responseTime: 1000 },
      },
    },
  ];

  const extraQueryParams = [{key : "value",
value : "key"}];
  const differentQueryParams = [{key : "value",
value : "key"}];

  const validationFailures = [
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

  var validationFailures = [];
  var benchmarkCalls = [];

  await chrome.storage.local.get(['benchmarkFailed', 'validationFailed'], async function(result) {
    await Object.assign(benchmarkCalls , result.benchmarkFailed || []);
    await Object.assign(validationFailures , result.validationFailed || []);
   //let benchmarkFailed = result.benchmarkFailed || [];
   //let validationFailed = result.validationFailed || [];

   console.log('Retrieved array1:', benchmarkCalls);
   console.log('Retrieved array2:', validationFailures);

console.log(benchmarkCalls.length);
console.log(validationFailures.length);
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
          call,
          extraQueryParams,
          differentQueryParams
        )
    );
  } else {
    document
      .getElementById("benchmark-container")
      .classList.add("hidden");
    document.getElementById("benchmark-heading").classList.add("hidden");
  }

  if (validationFailures.length > 0) {
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
