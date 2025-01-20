<?php
require_once("./functions.php");

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        // SQL Query to fetch all laptop data
        $tsql = "SELECT [id], [model], [macAddress], [serial_number], [comment], [created_at], [assignedTo], [condition], [signature_data],[assignedBy] FROM dbo.assignedLaptop";
        $getResults = sqlsrv_query($conn, $tsql);
        if ($getResults === false) {
            echo json_encode(array("error" => "Error in query execution.", "details" => sqlsrv_errors()));
            exit;
        }

        $laptops = [];
        while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
            $laptops[] = $row; // Add laptop data to laptops array
        }

        // If execution is successful
        echo json_encode(array("success" => true, "laptops" => $laptops));

        // Free the statement resource
        sqlsrv_free_stmt($getResults);

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
