<?php
// ===========================
// Contact Form Handler
// ===========================

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response array
$response = array(
    'success' => false,
    'message' => ''
);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Get JSON data from request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate input data
if (!$data) {
    $response['message'] = 'Invalid JSON data';
    echo json_encode($response);
    exit;
}

// Extract and sanitize form data
$name = isset($data['name']) ? sanitize_input($data['name']) : '';
$email = isset($data['email']) ? sanitize_input($data['email']) : '';
$subject = isset($data['subject']) ? sanitize_input($data['subject']) : '';
$message = isset($data['message']) ? sanitize_input($data['message']) : '';

// Validation
$errors = array();

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address';
}

if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters long';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
}

// If there are validation errors, return them
if (!empty($errors)) {
    $response['message'] = implode(', ', $errors);
    echo json_encode($response);
    exit;
}

// ===========================
// Email Configuration
// ===========================

// Your email address (change this to your actual email)
$to_email = 'your.email@example.com';

// Email subject
$email_subject = 'Portfolio Contact: ' . $subject;

// Email body
$email_body = "
New Contact Form Submission

Name: $name
Email: $email
Subject: $subject

Message:
$message

---
Sent from your portfolio contact form
Time: " . date('Y-m-d H:i:s') . "
";

// Email headers
$headers = array(
    'From: ' . $name . ' <' . $email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
);

// Attempt to send email
try {
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        $response['success'] = true;
        $response['message'] = 'Message sent successfully!';
        
        // Optional: Log the submission
        log_submission($name, $email, $subject);
    } else {
        $response['message'] = 'Failed to send email. Please try again later.';
    }
} catch (Exception $e) {
    $response['message'] = 'Error sending email: ' . $e->getMessage();
}

// Return JSON response
echo json_encode($response);

// ===========================
// Helper Functions
// ===========================

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Log form submissions to a file (optional)
 */
function log_submission($name, $email, $subject) {
    $log_file = 'contact_logs.txt';
    $log_entry = date('Y-m-d H:i:s') . " - Name: $name, Email: $email, Subject: $subject\n";
    
    // Only log if the file is writable
    if (is_writable(dirname($log_file)) || is_writable($log_file)) {
        file_put_contents($log_file, $log_entry, FILE_APPEND);
    }
}

/**
 * Rate limiting to prevent spam (optional)
 * This is a basic implementation - for production, use a more robust solution
 */
function check_rate_limit($email) {
    $rate_limit_file = 'rate_limit.json';
    $time_limit = 300; // 5 minutes
    $max_attempts = 3;
    
    if (!file_exists($rate_limit_file)) {
        file_put_contents($rate_limit_file, json_encode(array()));
    }
    
    $rate_data = json_decode(file_get_contents($rate_limit_file), true);
    $current_time = time();
    
    // Clean old entries
    foreach ($rate_data as $stored_email => $data) {
        if ($current_time - $data['last_attempt'] > $time_limit) {
            unset($rate_data[$stored_email]);
        }
    }
    
    // Check rate limit
    if (isset($rate_data[$email])) {
        if ($rate_data[$email]['attempts'] >= $max_attempts) {
            return false;
        }
        $rate_data[$email]['attempts']++;
        $rate_data[$email]['last_attempt'] = $current_time;
    } else {
        $rate_data[$email] = array(
            'attempts' => 1,
            'last_attempt' => $current_time
        );
    }
    
    file_put_contents($rate_limit_file, json_encode($rate_data));
    return true;
}

// Optional: Enable rate limiting by uncommenting the code below
/*
if (!check_rate_limit($email)) {
    $response['message'] = 'Too many requests. Please try again later.';
    echo json_encode($response);
    exit;
}
*/

?>
