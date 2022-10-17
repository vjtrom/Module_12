function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      var resultWfreq = result.wfreq;
      //console.log(resultWfreq);
    
    });

  });
}
   //DELIVERABLE 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultSample[0];
    console.log(result1)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
   
    var resultOtu_ids = result1.otu_ids;
    var resultOtu_ids = resultOtu_ids.toString()
    //console.log(resultOtu_ids);
    var resultOtu_labels = result1.otu_labels;
    //console.log(resultOtu_labels);
    var resultSample_values = result1.sample_values;
    //console.log(resultSample_values);

    // 7. Create the yticks for the bar chart.
    var yticks = resultSample_values.sort((a,b) => b - a);
    var yticks1 = yticks.slice(0,10);
    var sampleValues = yticks1.reverse()
    //console.log(sampleValues);

    //8. Create the trace for the bar chart.  
     var barData = [{
      y: resultOtu_ids,
      x: sampleValues,
      type: "bar",
      orientation: 'h'
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "Top 10 Bacteria Cultures Found"};
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //DELIVERABLE 2
    // 1. Create the trace for the bubble chart.
    var resultOtu_ids = result1.otu_ids;
    var bubbleData = [{
        x: resultOtu_ids,
        y: resultSample_values,
        text: resultOtu_labels,
        mode: 'markers',
        marker: {
          color: resultOtu_ids,
          size: resultSample_values
        }
     
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {title: "OTU ID"},
        showlegend: false,
        height: 600,
        width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    
    
    //DELIVERABLE 3    
    // 4. Create the trace for the gauge chart.
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var resultWfreq = result.wfreq;
    console.log(resultWfreq);
    var gaugeData = [
        {   domain: { x: [0, 10], y: [0, 10] },
            value: resultWfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "white",
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "yellow" },
                  { range: [6, 8], color: "limegreen" },
                  { range: [8, 10], color: "green" }
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 490}}}];
      // 5. Create the layout for the gauge chart.
    
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 },
        paper_bgcolor: "white",
        font: { color: "black", family: "Arial" }  

};

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
     ;
        });

    });
    
    
 

  }