const verifyEmailTemplate = ({name, url}) => {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Bienvenue chez GraceShop, ${name}!</h2>
        <p style="font-size: 16px; text-align: justify;">
            Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous compter parmi nos membres. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email et finaliser votre inscription :
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                Vérifier mon email
            </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: justify;">
            Si vous n'avez pas initié cette demande, veuillez ignorer cet email. Si vous avez besoin d'aide, n'hésitez pas à <a href="https://graceshop.com/support" style="color: #4CAF50;">nous contacter</a>.
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
            Cordialement, <br />
            L'équipe GraceShop
        </p>
    </div>
    `;
};

export default verifyEmailTemplate;
