<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please complete the form and try again.';
        echo json_encode($response);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP(); // Send using SMTP
        $mail->Host = 'sandbox.smtp.mailtrap.io'; // Set the SMTP server to send through
        $mail->SMTPAuth = true; // Enable SMTP authentication
        $mail->Username = 'bcc5a39043dc00'; // SMTP username
        $mail->Password = 'c5024473ddd6eb'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port = 2525; // TCP port; use 465 for `PHPMailer::ENCRYPTION_SMTPS`, 587 for TLS

        //Recipients
        $mail->setFrom('from@example.com', 'Mailer');
        $mail->addAddress('your_email@example.com', 'Admin'); // Add a recipient (YOU)
        $mail->addReplyTo($email, $name);

        //Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'New Contact Form Message from ' . $name;

        // Embed the logo
        $mail->addEmbeddedImage('logo/logo.png', 'logo_id');

        // Email Body Styles
        $bgColor = '#FFF8E7'; // Cosmic Latte
        $textColor = '#2B1B17'; // Oil
        $accentColor = '#46a268ff'; // Burnt Sienna

        $mail->Body = "
        <div style='background-color: $bgColor; padding: 40px; font-family: sans-serif; color: $textColor;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>
                <h2 style='color: $textColor; border-bottom: 2px solid $accentColor; padding-bottom: 10px; margin-top: 0;'>New Contact Message</h2>
                <p style='font-size: 16px; margin-bottom: 10px;'><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
                <p style='font-size: 16px; margin-bottom: 10px;'><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
                <div style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid $accentColor; margin-top: 20px;'>
                    <p style='font-size: 16px; margin: 0; white-space: pre-wrap;'>" . htmlspecialchars($message) . "</p>
                </div>
            </div>
            <div style='text-align: center; margin-top: 30px;'>
                <img src='cid:logo_id' alt='Logo' style='width: 50px; height: auto; opacity: 0.8;'>
                <p style='font-size: 12px; color: $textColor; opacity: 0.6; margin-top: 10px;'>Sent from your Portfolio Website</p>
            </div>
        </div>";

        $mail->AltBody = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        $mail->send();
        $response['success'] = true;
        $response['message'] = 'Message has been sent';
    }
    catch (Exception $e) {
        $response['message'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
