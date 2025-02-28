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

  async sendMail(user: User | TattooArtist, token: string) {
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Verifica tu cuenta para completar tu registro',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p style="color: #555;">
            Gracias por registrarte en <strong>TattooInc</strong>. Para activar tu cuenta y empezar a disfrutar de nuestros servicios, verifica tu correo electrónico haciendo clic en el siguiente botón:
          </p>
          <p style="text-align: center;">
            <a href="https://tattoinc.vercel.app//validate-email/${token}" 
               style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #008CBA; text-decoration: none; border-radius: 5px;">
               Verificar Email
            </a>
          </p>
          <p style="color: #555;">
            Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
            <br>
            <a href="https://tattoinc.vercel.app//validate-email/${token}" style="color: #008CBA;">https://tattoinc.vercel.app//validate-email/${token}</a>
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">
            Si no realizaste esta solicitud, puedes ignorar este correo.
          </p>
          <p style="color: #333; font-size: 14px;">
            Gracias, <br> 
            <strong>El equipo de TattooInc.</strong>
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
}
