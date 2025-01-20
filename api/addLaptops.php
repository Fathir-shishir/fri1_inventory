<?php
require_once("./functions.php");


// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    exit(0);
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        // Collect data from request
        $postData = json_decode(file_get_contents('php://input'), true);
        $model = $postData['model'] ?? '';
        $quantities = isset($postData['quantities']) ? (int)$postData['quantities'] : 0;
        $createdBy = $postData['createdBy'] ?? '';
        $condition = $postData['condition'] ?? '';

        // Prepare date from backend
        $laptopUpdateDate = date('Y-m-d');

        // SQL Query to insert data into dbo.laptops
        $tsqllaptops = "INSERT INTO dbo.laptops (model, quantities, laptopUpdateDate, createdBy,condition) 
                        VALUES (?, ?, ?, ?, ?)";
        $paramslaptops = array(&$model, &$quantities, &$laptopUpdateDate, &$createdBy, &$condition);
        $stmtlaptops = sqlsrv_prepare($conn, $tsqllaptops, $paramslaptops);

        // Execute the query for dbo.laptops
        if (!sqlsrv_execute($stmtlaptops)) {
            echo json_encode(array("error" => "Error in dbo.laptops table statement execution.", "details" => sqlsrv_errors()));
            exit;
        }

        // Check if model exists in dbo.laptopQuantities
        $sqlCheckModel = "SELECT id, totalQuantities FROM dbo.laptopQuantities WHERE model = ? AND condition = ?";
        $paramsCheckModel = array(&$model,&$condition);
        $stmtCheckModel = sqlsrv_query($conn, $sqlCheckModel, $paramsCheckModel);

        if ($stmtCheckModel === false) {
            echo json_encode(array("error" => "Error checking dbo.laptopQuantities.", "details" => sqlsrv_errors()));
            exit;
        }

        $row = sqlsrv_fetch_array($stmtCheckModel, SQLSRV_FETCH_ASSOC);

        if ($row) {
            // Model exists, update the quantity
            $newTotalQuantities = $row['totalQuantities'] + $quantities;
            $sqlUpdateQuantities = "UPDATE dbo.laptopQuantities SET totalQuantities = ? WHERE model = ? AND condition = ?";
            $paramsUpdateQuantities = array(&$newTotalQuantities, &$model, &$condition);
        } else {
            // Model does not exist, insert new row
            $sqlUpdateQuantities = "INSERT INTO dbo.laptopQuantities (model, totalQuantities, condition) VALUES (?, ?, ?)";
            $paramsUpdateQuantities = array(&$model, &$quantities, &$condition);
        }

        $stmtUpdateQuantities = sqlsrv_query($conn, $sqlUpdateQuantities, $paramsUpdateQuantities);

        if ($stmtUpdateQuantities === false) {
            echo json_encode(array("error" => "Error updating/inserting dbo.laptopQuantities.", "details" => sqlsrv_errors()));
            exit;
        }

        // If execution is successful
        echo json_encode(array("success" => "Data successfully inserted/updated in both tables."));

        // Free the statement resources
        sqlsrv_free_stmt($stmtlaptops);
        sqlsrv_free_stmt($stmtCheckModel);
        // Note: No need to free $stmtUpdateQuantities as it's not prepared but directly executed

    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}

?>
