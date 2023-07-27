// Wait for the document to be fully loaded before running the JavaScript code
document.addEventListener("DOMContentLoaded", function () {
  // Function to populate the dropdown menu with test subject IDs
  function populateDropdown(data) {
    const testSubjectIDs = data.names;

    const dropdown = document.getElementById("selDataset");
    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.text = "Select a Test Subject ID";
    dropdown.add(defaultOption);

    testSubjectIDs.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.text = id;
      dropdown.add(option);
    });
  }

  // Function to update the demographic info panel
  function updateDemographicInfo(data, selectedID) {
    const demographicData = data.metadata.find((item) => item.id === selectedID);

    const demographicInfoPanel = document.getElementById("sample-metadata");
    demographicInfoPanel.innerHTML = "";

    Object.entries(demographicData).forEach(([key, value]) => {
      const p = document.createElement("p");
      p.textContent = `${key}: ${value}`;
      demographicInfoPanel.appendChild(p);
    });
  }

  // Function to update the horizontal bar chart
  function updateBarChart(data, selectedID) {
    const individualData = data.samples.find((item) => item.id === selectedID);

    const top10Values = individualData.sample_values.slice(0, 10).reverse();
    const top10IDs = individualData.otu_ids.slice(0, 10).reverse().map((id) => `OTU ${id}`);
    const top10Labels = individualData.otu_labels.slice(0, 10).reverse();

    const trace = {
      x: top10Values,
      y: top10IDs,
      text: top10Labels,
      type: "bar",
      orientation: "h",
    };

    const layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
    };

    const dataTrace = [trace];

    Plotly.newPlot("bar", dataTrace, layout);
  }

  // Function to update the bubble chart
  function updateBubbleChart(data, selectedID) {
    const individualData = data.samples.find((item) => item.id === selectedID);

    const trace = {
      x: individualData.otu_ids,
      y: individualData.sample_values,
      text: individualData.otu_labels,
      mode: "markers",
      marker: {
        size: individualData.sample_values,
        color: individualData.otu_ids,
        colorscale: "Earth", // You can use any other colorscale as well
        opacity: 0.7,
      },
    };

    const layout = {
      title: "Sample OTUs",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
    };

    const dataTrace = [trace];

    Plotly.newPlot("bubble", dataTrace, layout);
  }

  // Function to update the demographic info panel
  function updateDemographicInfo(data, selectedID) {
    const demographicData = data.metadata.find((item) => item.id === parseInt(selectedID));

    const demographicInfoPanel = document.getElementById("sample-metadata");
    demographicInfoPanel.innerHTML = "";

    // Display each key-value pair from the metadata JSON object
    Object.entries(demographicData).forEach(([key, value]) => {
      const p = document.createElement("p");
      p.textContent = `${key}: ${value}`;
      demographicInfoPanel.appendChild(p);
    });

    // Optionally, you can also create a separate div to display each key-value pair
    const demographicInfoDiv = document.getElementById("demographic-info");
    demographicInfoDiv.innerHTML = "";

    // Display each key-value pair from the metadata JSON object in a separate div
    Object.entries(demographicData).forEach(([key, value]) => {
      const div = document.createElement("div");
      div.textContent = `${key}: ${value}`;
      demographicInfoDiv.appendChild(div);
    });
  }
  
   // Function to handle the dropdown selection change event
   function optionChanged(selectedID) {
    d3.json(
      "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
    )
      .then((data) => {
        updateDemographicInfo(data, selectedID);
        updateBarChart(data, selectedID);
        updateGaugeChart(data, selectedID);
        updateBubbleChart(data, selectedID);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }

  // Call the populateDropdown function to fill the dropdown with test subject IDs
  populateDropdown();

  // Set the initial state by updating the page with the default selected test subject ID
  const defaultSelectedID = 1; // Set this to the desired default test subject ID
  optionChanged(defaultSelectedID);
});
