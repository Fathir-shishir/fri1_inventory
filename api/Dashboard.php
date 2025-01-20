<?php
// Allow requests from any origin - adjust in production!
require_once("./functions.php");

// Connect using SQL Server Authentication.
try {
    $conn = createConnection();

    // SQL query to select data grouped by model and condition for mobileQuantities
    $sqlMobile = "SELECT model, 
                         SUM(CASE WHEN condition = 'New' THEN totalQuantities ELSE 0 END) AS newQuantities, 
                         SUM(CASE WHEN condition = 'Used' THEN totalQuantities ELSE 0 END) AS usedQuantities 
                  FROM dbo.mobileQuantities 
                  GROUP BY model";

    $stmtMobile = sqlsrv_query($conn, $sqlMobile);

    if ($stmtMobile === false) {
        die(print_r(sqlsrv_errors(), true));
    }

    $mobileQuantities = [];

    while ($row = sqlsrv_fetch_array($stmtMobile, SQLSRV_FETCH_ASSOC)) {
        $mobileQuantities[] = [
            'model' => $row["model"],
            'quantities' => [
                'New' => $row["newQuantities"],
                'Used' => $row["usedQuantities"]
            ]
        ];
    }

    // SQL query to select data grouped by model and condition for laptopQuantities
    $sqlLaptop = "SELECT model, 
                         SUM(CASE WHEN condition = 'New' THEN totalQuantities ELSE 0 END) AS newQuantities, 
                         SUM(CASE WHEN condition = 'Used' THEN totalQuantities ELSE 0 END) AS usedQuantities 
                  FROM dbo.laptopQuantities 
                  GROUP BY model";

    $stmtLaptop = sqlsrv_query($conn, $sqlLaptop);

    if ($stmtLaptop === false) {
        die(print_r(sqlsrv_errors(), true));
    }

    $laptopQuantities = [];

    while ($row = sqlsrv_fetch_array($stmtLaptop, SQLSRV_FETCH_ASSOC)) {
        $laptopQuantities[] = [
            'model' => $row["model"],
            'quantities' => [
                'New' => $row["newQuantities"],
                'Used' => $row["usedQuantities"]
            ]
        ];
    }

    // Combine the results
    $result = [
        'mobileQuantities' => $mobileQuantities,
        'laptopQuantities' => $laptopQuantities
    ];

    // Output data as JSON
    if (count($mobileQuantities) > 0 || count($laptopQuantities) > 0) {
        echo json_encode($result);
    } else {
        echo json_encode(['message' => 'No quantities found']);
    }

    // Close the connection
    sqlsrv_close($conn);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
