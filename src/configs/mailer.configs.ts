import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { User } from 'src/auth/entities/user.entity';
import { envs } from './envs.configs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Debes definir esto en `envs.configs.ts`
      port: 587, // STARTTLS (TLS dinámico)
      secure: false,
      auth: {
        user: envs.EMAIL_SENDER,
        pass: envs.PASSWORD_SECRET_EMAIL,
      },
    });
  }

  async sendMailWelcome(user: User) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: '¡Bienvenido a TattooInk!',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">¡Hola ${user.name}, bienvenido a TattooInk! 🎉</h2>
          <p style="color: #555;">
            Nos emociona tenerte como parte de nuestra comunidad. En <strong>TattooInk</strong>, conectamos artistas y amantes del tatuaje para que encuentren la inspiración y los mejores profesionales.
          </p>
          <p style="color: #555;">
            Aquí tienes algunas cosas que puedes hacer ahora:
          </p>
          <ul style="color: #555;">
            <li>Explorar tatuadores y sus increíbles diseños.</li>
            <li>Reservar citas con los mejores artistas.</li>
          </ul>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/login" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #008CBA; text-decoration: none; border-radius: 5px;">
               Empezar ahora
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/login" style="color: #008CBA;">https://tattoink.vercel.app/login</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
          <p style="color: #333; font-size: 14px;">
            ¡Esperamos que disfrutes tu experiencia!<br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>
        `,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }

  async sendMailTattoArtist(user: TattooArtist, token: string) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Tu solicitud de registro como tatuador está en revisión',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            Gracias por tu interés en unirte a <strong>TattooInk</strong> como tatuador. Hemos recibido tu solicitud de registro y nuestro equipo de administradores está revisando la información proporcionada.
          </p>
          <p style="color: #555;">
            Una vez que verifiquemos tus datos, recibirás un correo electrónico con la confirmación y los siguientes pasos. Mientras tanto, puedes verificar tu dirección de correo electrónico haciendo clic en el siguiente botón:
          </p>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/validate-email/${token}" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #008CBA; text-decoration: none; border-radius: 5px;">
               Verificar Email
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/validate-email/${token}" style="color: #008CBA;">https://tattoink.vercel.app/validate-email/${token}</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si no realizaste esta solicitud, puedes ignorar este correo.
          </p>
          <p style="color: #333; font-size: 14px;">
            Gracias, <br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>
        `,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }

  async senMailapprovedArtist(user: TattooArtist) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: '¡Tu cuenta ha sido aprobada! 🎉',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            ¡Nos complace informarte que tu solicitud para registrarte como tatuador en <strong>TattooInk</strong> ha sido aprobada! Ahora puedes acceder a tu cuenta, completar tu perfil y comenzar a mostrar tu portafolio a clientes potenciales.
          </p>
          <p style="color: #555;">
            Para comenzar, inicia sesión en la plataforma y personaliza tu perfil:
          </p>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/login" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #008CBA; text-decoration: none; border-radius: 5px;">
               Iniciar Sesión
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/login" style="color: #008CBA;">https://tattoink.vercel.app/login</a>
          </p>
          <p style="color: #555;">
            Ahora puedes subir imágenes de tu trabajo, gestionar tus citas y conectar con clientes interesados en tu arte.
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si no solicitaste esta cuenta, ignora este mensaje.
          </p>
          <p style="color: #333; font-size: 14px;">
            ¡Bienvenido a TattooInk!<br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>
        `,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }

  async sendMailDisable(user: User | TattooArtist) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Tu cuenta ha sido inhabilitada',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            Lamentamos informarte que tu cuenta en <strong>TattooInk</strong> ha sido inhabilitada debido a un comportamiento que infringe nuestras normas de comunidad y términos de uso.
          </p>
          <p style="color: #555;">
            Nuestro equipo ha detectado actividades que no cumplen con nuestras políticas. Si crees que esto ha sido un error o deseas más información sobre la decisión, puedes ponerte en contacto con nuestro equipo de soporte.
          </p>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/contact" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #D9534F; text-decoration: none; border-radius: 5px;">
               Contactar Soporte
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/contact" style="color: #D9534F;">https://tattoink.vercel.app/contact</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
          <p style="color: #333; font-size: 14px;">
            Atentamente,<br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>
        `,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }

  async sendMailResetPassword(user: User | TattooArtist, token: string) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>TattooInk</strong>.
            Si no realizaste esta solicitud, puedes ignorar este correo.
          </p>
          <p style="color: #555;">
            Para restablecer tu contraseña, haz clic en el siguiente botón:
          </p>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/forgot-password/${token}" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #5cb85c; text-decoration: none; border-radius: 5px;">
               Restablecer contraseña
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/forgot-password/${token}" style="color: #5cb85c;">https://tattoink.vercel.app/forgot-password/${token}</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Este enlace caducará en 30 minutos por razones de seguridad.
          </p>
          <p style="color: #333; font-size: 14px;">
            Atentamente,<br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>
        `,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }

  async sendMail(user: User, token: string) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Verifica tu cuenta para completar tu registro',
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            Gracias por registrarte en <strong>TattooInk</strong>. Para activar tu cuenta y empezar a disfrutar de nuestros servicios, verifica tu correo electrónico haciendo clic en el siguiente botón:
          </p>
          <p style="text-align: center;">
            <a href="https://tattoink.vercel.app/validate-email/${token}" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #008CBA; text-decoration: none; border-radius: 5px;">
               Verificar Email
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoink.vercel.app/validate-email/${token}" style="color: #008CBA;">https://tattoink.vercel.app/validate-email/${token}</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si no realizaste esta solicitud, puedes ignorar este correo.
          </p>
          <p style="color: #333; font-size: 14px;">
            Gracias, <br> 
            <strong>El equipo de TattooInk.</strong>
          </p>
        </div>`,
      });

      return true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Error sending email', err);
    }
  }
}
