<?php

require_once("./functions.php");

// Handling CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection();

    if ($conn) {
        // Start transaction
        sqlsrv_begin_transaction($conn);

        $postData = json_decode(file_get_contents('php://input'), true);
        $hostName = $postData['hostName'] ?? '';
        $model = $postData['model'] ?? '';
        $serialNumber = $postData['serial_number'] ?? '';
        $macAddress = $postData['macAddress'] ?? '';
        $assignedTo = $postData['assignedTo'] ?? '';
        $condition = $postData['condition'] ?? '';
        $comment = $postData['comment'] ?? '';
        $assignedBy = $postData['assignedBy'] ?? '';
        $signatureData = $postData['signature_data'] ?? '';

        // First, check and update the dbo.laptopQuantities table
        $checkSql = "SELECT totalQuantities FROM dbo.laptopQuantities WHERE model = ? AND condition = ?";
        $checkParams = array(&$model, &$condition);
        $checkStmt = sqlsrv_query($conn, $checkSql, $checkParams);

        if ($checkStmt === false) {
            echo json_encode(["error" => "Error checking model quantities.", "details" => sqlsrv_errors()]);
            sqlsrv_rollback($conn); // Rollback transaction
            exit;
        }

        $row = sqlsrv_fetch_array($checkStmt, SQLSRV_FETCH_ASSOC);
        if ($row && $row['totalQuantities'] > 0) {
            $updateSql = "UPDATE dbo.laptopQuantities SET totalQuantities = totalQuantities - 1 WHERE model = ? AND condition = ?";
            if (!sqlsrv_query($conn, $updateSql, $checkParams)) {
                echo json_encode(["error" => "Error updating model quantities.", "details" => sqlsrv_errors()]);
                sqlsrv_rollback($conn); // Rollback transaction
                exit;
            }

            // Then, insert into dbo.assignedLaptop
            $createdAt = date('Y-m-d H:i:s'); // SQL Server datetime2(7) format
            $insertSql = "INSERT INTO dbo.assignedLaptop (hostName, model, serial_number, macAddress, created_at, assignedTo, condition, assignedBy, comment, signature_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $insertParams = array(&$hostName, &$model, &$serialNumber, &$macAddress, &$createdAt, &$assignedTo, &$condition, &$assignedBy, &$comment, &$signatureData);

            $insertStmt = sqlsrv_prepare($conn, $insertSql, $insertParams);
            if (!sqlsrv_execute($insertStmt)) {
                echo json_encode(["error" => "Error inserting into assignedLaptop.", "details" => sqlsrv_errors()]);
                sqlsrv_rollback($conn); // Rollback transaction
                exit;
            }

            // Commit transaction
            sqlsrv_commit($conn);
            echo json_encode(["success" => "Laptop data successfully assigned and quantities updated."]);

        } else {
            echo json_encode(["error" => "Model does not exist or no quantities available."]);
            sqlsrv_rollback($conn); // Rollback transaction
            exit;
        }

    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    sqlsrv_rollback($conn); // Ensure rollback on exception
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
