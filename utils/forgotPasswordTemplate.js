const forgotPasswordTemplate = ({ name, otp }) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Bonjour ${name},</h2>
        <p>Nous avons reçu une demande pour réinitialiser votre mot de passe sur <strong>GraceShop</strong>.</p>
        <p>Veuillez utiliser le code ci-dessous pour réinitialiser votre mot de passe :</p>
        <div style="
            font-size: 24px; 
            font-weight: bold; 
            color: #007BFF; 
            background: #f1f1f1; 
            padding: 10px; 
            text-align: center; 
            border-radius: 5px;
            width: fit-content;
            margin: 0 auto;
        ">
            ${otp}
        </div>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail. Votre mot de passe reste sécurisé.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 14px; color: #777;">Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:support@graceshop.com" style="color: #007BFF;">support@graceshop.com</a>.</p>
    </div>
`;

export default forgotPasswordTemplate;
