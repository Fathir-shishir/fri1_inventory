<?php
require_once("./functions.php");

// Fetch assignedTo from request
$assignedTo = isset($_GET['assignedTo']) ? $_GET['assignedTo'] : null;

if (!$assignedTo) {
    echo json_encode(array("error" => "No assignedTo provided."));
    exit;
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        $assignments = array(); // Initialize array to hold all assignments

        // SQL Query to fetch mobile assignments by assignedTo
        $tsqlMobile = "SELECT 'Mobile' AS DeviceType, id, model, imei, serial_number, comment, created_at, assignedTo, condition, signature_data FROM dbo.assignedMobile WHERE assignedTo = ?";
        $params = array($assignedTo);
        $getResultsMobile = sqlsrv_query($conn, $tsqlMobile, $params);
        if ($getResultsMobile === false) {
            echo json_encode(array("error" => "Error in query execution for assignedMobile.", "details" => sqlsrv_errors()));
            exit;
        }

        // Loop through each row for mobile assignments
        while ($row = sqlsrv_fetch_array($getResultsMobile, SQLSRV_FETCH_ASSOC)) {
            $assignments[] = $row;
        }

        // SQL Query to fetch laptop assignments by assignedTo
        $tsqlLaptop = "SELECT 'Laptop' AS DeviceType, id, hostName, model, serial_number, macAddress, created_at, assignedTo, condition, assignedBy, comment, signature_data FROM dbo.assignedLaptop WHERE assignedTo = ?";
        $getResultsLaptop = sqlsrv_query($conn, $tsqlLaptop, $params);
        if ($getResultsLaptop === false) {
            echo json_encode(array("error" => "Error in query execution for assignedLaptop.", "details" => sqlsrv_errors()));
            exit;
        }

        // Loop through each row for laptop assignments
        while ($row = sqlsrv_fetch_array($getResultsLaptop, SQLSRV_FETCH_ASSOC)) {
            $assignments[] = $row;
        }

        // If no assignments found
        if (empty($assignments)) {
            echo json_encode(array("error" => "No assignments found for the provided assignedTo."));
            exit;
        }

        // Assignments found
        echo json_encode(array("success" => true, "assignments" => $assignments));

        // Free the statement resources
        sqlsrv_free_stmt($getResultsMobile);
        sqlsrv_free_stmt($getResultsLaptop);
    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($conn);
} catch (Exception $e) {
    // Error handling
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}
?>
