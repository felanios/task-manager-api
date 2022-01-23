const sgMail=require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"ozmen.eyupfurkan@gmail.com",
        subject:"Welcome to the game!",
        text:`Welcome to the game, ${name}. Let me know how you get along with the game.`
    });
};

const sendAccountCancellationMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"ozmen.eyupfurkan@gmail.com",
        subject:"Game over!",
        text:`Hello ${name}, this is the end of the game for you.`
    });
};


module.exports ={
    sendWelcomeMail,
    sendAccountCancellationMail
};