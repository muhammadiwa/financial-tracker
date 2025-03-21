<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Reset Password</h2>
        <p>Halo {{ $user->name }},</p>
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Silakan klik tombol di bawah ini untuk mereset password Anda:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $resetUrl }}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
        </div>

        <p>Link reset password ini akan kadaluarsa dalam {{ config('auth.passwords.users.expire') }} menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
            Jika Anda mengalami masalah dengan tombol di atas, copy dan paste URL berikut ke browser Anda:<br>
            {{ $resetUrl }}
        </p>
    </div>
</body>
</html>