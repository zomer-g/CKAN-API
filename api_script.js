/*
 * This script appends a unique ID to the name in column A for each row in the 'Sheet1' table.
 * It ensures that the final dataset name does not exceed 100 characters.
 * Then, it creates a dataset on CKAN based on the variables in the table.
 * If an error occurs, it will log the error with detailed information for further debugging.
 */

function createCKANDataset() {
  Logger.log("Starting script execution...");

  // Get the active spreadsheet and the 'Sheet1' sheet
  var sheetUrl = '[sheet_link]';
  var sheetName = 'Sheet1';
  Logger.log("Opening spreadsheet: " + sheetUrl);
  var sheet = SpreadsheetApp.openByUrl(sheetUrl).getSheetByName(sheetName);
  
  Logger.log("Accessing sheet: " + sheetName);
  var data = sheet.getDataRange().getValues();
  var apiKey = "[personal ckan api key]";

  // Iterate through each row in the table, skipping the header row
  for (var i = 1; i < data.length; i++) {
    try {
      Logger.log("Processing row " + (i + 1) + "...");
      
      // Generate a unique ID and append it to the name in column A
      var uniqueId = Utilities.getUuid();
      var baseName = data[i][0].toLowerCase().replace(/_/g, '-');
      
      // Ensure the name does not exceed 100 characters after appending the unique ID
      var maxLength = 100 - uniqueId.length - 1; // 1 character for the hyphen
      if (baseName.length > maxLength) {
        baseName = baseName.substring(0, maxLength);
      }
      
      var datasetName = baseName + '-' + uniqueId;
      Logger.log("Generated unique ID: " + uniqueId + " for dataset name: " + datasetName);
      sheet.getRange(i + 1, 1).setValue(datasetName); // Update the name in column A
      
      // Prepare the payload for the CKAN API request
      var payload = {
        "name": datasetName,
        "title": data[i][1],
        "author": data[i][2],
        "author_email": data[i][3].trim(), // Trim any extra spaces
        "maintainer": data[i][4],
        "maintainer_email": data[i][5].trim(), // Trim any extra spaces
        "notes": data[i][6],
        "tags": parseTags(data[i][7]),
        "extras": parseExtras(data[i][8]),
        "license_id": data[i][9],
        "private": data[i][10],
        "owner_org": data[i][11],
        "resources": parseResources(data[i][12]),
        "state": data[i][13],
        "version": data[i][14],
        "dataset_type": data[i][15]
      };

      Logger.log("Prepared payload: " + JSON.stringify(payload));
      
      // Make the POST request to create the dataset
      var options = {
        "method": "post",
        "contentType": "application/json",
        "headers": {
          "Authorization": apiKey
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };
      
      Logger.log("Sending POST request to CKAN...");
      var response = UrlFetchApp.fetch("https://www.odata.org.il/api/3/action/package_create", options);
      var result = JSON.parse(response.getContentText());
      
      // Log the result of the dataset creation
      if (result.success) {
        Logger.log("Dataset created successfully: " + datasetName);
      } else {
        Logger.log("Error creating dataset: " + result.error.message);
        Logger.log("Full error response: " + JSON.stringify(result.error));
      }
      
    } catch (e) {
      // Log any errors that occur during the process
      Logger.log("Error on row " + (i + 1) + ": " + e.message);
      Logger.log("Full stack trace: " + e.stack);
    }
  }
  
  Logger.log("Script execution completed.");
}

/*
 * Helper function to parse tags from the table's tag column (if applicable).
 */
function parseTags(tagString) {
  if (tagString) {
    var tags = tagString.split(',').map(function(tag) {
      return {"name": tag.trim()};
    });
    return tags;
  }
  return [];
}

/*
 * Helper function to parse extras from the table's extras column (if applicable).
 */
function parseExtras(extrasString) {
  if (extrasString) {
    var extras = extrasString.split(',').map(function(extra) {
      var keyValue = extra.split(':');
      return {"key": keyValue[0].trim(), "value": keyValue[1].trim()};
    });
    return extras;
  }
  return [];
}

/*
 * Helper function to parse resources from the table's resources column (if applicable).
 */
function parseResources(resourcesString) {
  if (resourcesString) {
    var resources = resourcesString.split(',').map(function(resource) {
      var keyValue = resource.split(':');
      return {"url": keyValue[0].trim(), "description": keyValue[1].trim(), "format": keyValue[2].trim()};
    });
    return resources;
  }
  return [];
}
