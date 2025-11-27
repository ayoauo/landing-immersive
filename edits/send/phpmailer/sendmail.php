<?php

require '/dc_vr/PHPMailer.php';
require '/dc_vr/SMTP.php';
require '/dc_vr/Exception.php';

if($_POST['form'] == 'contact form') {
	if (empty($_POST['name'])) exit('Вы забыли ввести имя');
	if (empty($_POST['email'])) exit('Вы забыли ввести email');

	$formSubject = htmlspecialchars($_POST['Название_формы']);
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
$title = "Новая заявка с сайта ";
$body = $bodyContent;

$mail = new PHPMailer();

try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'dcsuvorova@dctouch.ru'; // Логин на почте
    $mail->Password   = 'waqbuktyhbtbhuuh'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('dctouch.ru.ru', 'Сайт '); // Адрес самой почты и имя отправителя

    // Получатель письма
//    $mail->addAddress('dcsuvorova@');
    $mail->addAddress('djalilov.m@mail.ru');

    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;


    if ($mail->send()) {$result = "success";}
    else {$result = "error";}

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}
