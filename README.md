# CKAN Dataset Creation Script

This Google Apps Script automates the process of creating datasets on a CKAN platform using data stored in a Google Sheet. It generates a unique identifier for each dataset, ensures compliance with CKAN naming conventions, and manages potential errors during the dataset creation process.

## Features

- **Unique ID Generation**: The script generates a UUID for each dataset, ensuring each dataset name is unique.
- **Name Validation**: It ensures the dataset name does not exceed CKAN's 100-character limit and adheres to lowercase and character restrictions.
- **Error Handling**: Logs detailed information about any errors encountered during the process, making debugging easier.
- **Automated Dataset Creation**: Automatically sends dataset information to CKAN via an API request.

## Prerequisites

- A Google Sheet with a table containing the necessary dataset information.
- A CKAN instance with API access and an API key.

## Setup Instructions

1. **Google Sheet Preparation**:
   - Create a Google Sheet with a sheet named `Sheet1`.
   - Populate the sheet with the following columns:
     - `A`: Dataset Name (will be appended with a unique ID)
     - `B`: Title
     - `C`: Author
     - `D`: Author Email
     - `E`: Maintainer
     - `F`: Maintainer Email
     - `G`: Notes
     - `H`: Tags (comma-separated)
     - `I`: Extras (comma-separated key:value pairs)
     - `J`: License ID
     - `K`: Private (true/false)
     - `L`: Owner Organization ID
     - `M`: Resources (comma-separated URL:description:format)
     - `N`: State
     - `O`: Version
     - `P`: Dataset Type

2. **Script Installation**:
   - Open your Google Sheet and go to `Extensions > Apps Script`.
   - Delete any existing code and paste the provided script.
   - Replace the CKAN API key in the script with your actual CKAN API key.

3. **Running the Script**:
   - Save the script and run the `createCKANDataset` function.
   - Check the execution log for detailed results and any errors.

## Logging and Debugging

- The script logs each step of the process, including:
  - Opening the Google Sheet.
  - Processing each row.
  - Generating a unique ID for each dataset.
  - Sending API requests to CKAN.
  - Any errors encountered during execution.
- The logs can be viewed in the Script Editor's `Execution log`.

## Troubleshooting

- Ensure that all required columns in the Google Sheet are filled with valid data.
- Make sure the dataset name, after appending the unique ID, does not exceed 100 characters.
- If you encounter any issues, refer to the detailed logs for debugging.

## License

This script is licensed under the MIT License. Feel free to use and modify it as needed.
