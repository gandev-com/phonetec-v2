import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

const sanitizeText = (value: unknown, maxLength: number) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .replace(/[<>]/g, '')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
};

const sanitizeMessage = (value: unknown, maxLength: number) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .replace(/[<>]/g, '')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        .trim()
        .slice(0, maxLength);
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({ success: false, message: 'Método no permitido. Usa POST para enviar el formulario.' }), {
        status: 405,
        headers: {
            'Content-Type': 'application/json',
            Allow: 'POST',
        },
    });
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const contentType = request.headers.get('content-type') || '';

        let rawData: Record<string, unknown> = {};

        if (contentType.includes('application/json')) {
            rawData = await request.json();
        } else if (contentType.includes('form-data') || contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData();
            rawData = Object.fromEntries(formData.entries());
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Formato de solicitud no soportado.' }), {
                status: 415,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const name = sanitizeText(rawData.name, 80);
        const email = sanitizeText(rawData.email, 120).toLowerCase();
        const service = sanitizeText(rawData.service, 80);
        const subject = sanitizeText(rawData.subject, 120);
        const message = sanitizeMessage(rawData.message, 1500);

        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({ success: false, message: 'Todos los campos son obligatorios.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!emailPattern.test(email)) {
            return new Response(JSON.stringify({ success: false, message: 'El email no es válido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const smtpHost = import.meta.env.SMTP_HOST;
        const smtpPort = Number(import.meta.env.SMTP_PORT || 587);
        const smtpUser = import.meta.env.SMTP_USER;
        const smtpPass = import.meta.env.SMTP_PASS;
        const contactEmail = import.meta.env.CONTACT_EMAIL || 'phontecnico@gmail.com';

        if (!smtpHost || !smtpUser || !smtpPass) {
            return new Response(JSON.stringify({ success: false, message: 'Falta configurar el servidor SMTP en las variables de entorno.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        await transporter.sendMail({
            from: `PHONETEC Web <${smtpUser}>`,
            to: contactEmail,
            replyTo: email,
            subject: `[Web PHONETEC] ${subject}`,
            text: [
                `Nombre: ${name}`,
                `Email: ${email}`,
                `Servicio: ${service || 'No especificado'}`,
                `Asunto: ${subject}`,
                '',
                'Mensaje:',
                message,
            ].join('\n'),
        });

        return new Response(JSON.stringify({ success: true, message: 'Tu mensaje se ha enviado correctamente. Te responderemos lo antes posible.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Contact API error:', error);

        return new Response(JSON.stringify({ success: false, message: 'No hemos podido enviar tu mensaje en este momento.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};