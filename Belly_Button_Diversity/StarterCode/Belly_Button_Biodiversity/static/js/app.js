function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Create a url route
  var url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (response) {
    console.log(response);

    // Use d3 to select the panel with id of `#sample-metadata`
    var metaTag = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metaTag.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function ([key, value]) {
      metaTag.append("li").text(key);
      metaTag.append("li").text(value);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  var url = `/samples/${sample}`;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function (response) {
    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };

    var data = [trace1];

    var layout = {
      title: response.otu_labels,
      showlegend: false
    };

    Plotly.newPlot("bubble", data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var topValues = response.sample_values.slice(0, 10);
    var topID = response.otu_ids.slice(0, 10);
    var topLabels = response.otu_labels.slice(0, 10);

    console.log(response);

    var trace1 = {
      labels: topID,
      values: topValues,
      hovertext: topLabels,
      hoverinfo: "hovertext",
      type: 'pie'
    };

    var data = [trace1];

    Plotly.newPlot("pie", data);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
