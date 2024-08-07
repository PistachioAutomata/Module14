// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    let filteredobject = metadata.filter(x => x.id == sample)[0]

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredobject).forEach(entry => {
      const [key, value] = entry;
      //console.log(key, value);
      panel
          .append("h6")
          .text(`${key.toUpperCase()}: ${value}`)
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    let filteredobject = samples.filter(x => x.id == sample)[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredobject.otu_ids
    let otu_labels = filteredobject.otu_labels
    let sample_values = filteredobject.sample_values

    // Build a Bubble Chart
    var bubble_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];
    
    var bubble_layout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
    };
    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0,10).reverse().map(x => `OTU ${x}`)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var bar_data = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h',
      marker: {
        color: 'rgba(55,128,191,0.6)',
        width: 1
      },
      type: 'bar'
    }];

    
    var bar_layout = {
      title: 'Top 10 Bacteria Cultures Found'
    };
    
    
    

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names
    console.log(names)

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");
            
    

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      selector
          .append("option")
          .text(sample)
          .property("value", sample);
  })

    // Get the first sample from the list
    let first_id = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(first_id)
    buildCharts(first_id)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
