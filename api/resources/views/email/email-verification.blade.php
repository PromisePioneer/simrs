// resources/views/emails/verify-email.blade.php

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
        }

        body,
        table,
        td,
        a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-rspace: 0;
            mso-table-lspace: 0;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
        }

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        table {
            border-collapse: collapse !important;
        }

        a {
            color: #1a82e2;
        }

        img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
        }
    </style>
</head>
<body style="background-color: #e9ecef;">

<!-- Preheader text for email preview -->
<div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Please confirm your email address to complete your registration.
</div>

<table border="0" cellpadding="0" cellspacing="0" width="100%">

    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 36px 24px;">
                                    <a href="{{ config('app.url') }}" target="_blank" style="display: inline-block;">
                                        {{-- Ganti dengan logo company kamu --}}
                                        <img src="{{ config('app.url') }}/logo.png" alt="Company Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Header -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                    <td align="center" valign="top" width="600">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0 0 16px 0;">Halo {{ $user->name ?? 'User' }},</p>
                                    <p style="margin: 0 0 16px 0;">Selamat datang! Kami senang Anda bergabung dengan kami.</p>
                                    <p style="margin: 0;">Untuk melanjutkan, mohon verifikasi alamat email Anda dengan menekan tombol di bawah ini.</p>
                                </td>
                            </tr>

                            <tr>
                                <td align="left" bgcolor="#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                                            <a href="{{ $url }}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0 0 8px 0;">Atau salin dan tempel link ini ke browser Anda:</p>
                                    <p style="margin: 0; word-break: break-all;"><a href="{{ $url }}" target="_blank" style="color: #1a82e2;">{{ $url }}</a></p>
                                </td>
                            </tr>

                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                    <p style="margin: 0 0 16px 0;">Link ini akan kadaluarsa dalam 60 menit.</p>
                                    <p style="margin: 0 0 16px 0;">Jika Anda tidak membuat akun ini, abaikan email ini.</p>
                                    <p style="margin: 0;">Salam,<br>Tim Support</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
                        <p style="margin: 8px 0 0 0;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

</table>

</body>
</html>
