<?php

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

if(isset($_POST['form']) && !empty($_POST['form'])) {
    $formSubject = htmlspecialchars($_POST['form']);
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $bodyContent = "
        <h2>Заявка с формы - $formSubject </h2>
        <p><b>Имя:</b> $name</p>
        <p><b>Email:</b> $email</p>
        <p><b>Сообщение:</b> $message</p>
  ";

}

// Формирование самого письма
$title = "Новая заявка с сайта dctouch.ru/immersive";
$body = $bodyContent;

$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'dcsupport'; // Логин на почте
    $mail->Password   = 'osxsrgfebbxlxisc'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('dcsupport@yandex.ru', 'Сайт dctouch.ru/immersive'); // Адрес самой почты и имя отправителя

    // Получатель письма
//    $mail->addAddress('dcsuvorova@dctouch.ru');
    $mail->addAddress('support@dctouch.ru');

    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;


    if ($mail->send()) {
        $result = "success"; 
        $status = "Спасибо! Данные успешно отправлены";
    }
    else {$result = "error";$status = $mail->ErrorInfo;}

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

echo json_encode(["result" => $result, "resultfile" => $body, "status" => $status]);
