import nodemailer from 'nodemailer';
import config     from 'config';
import templates  from './templates';
import juice      from 'juice';

// library configuration ---------------------------------------

// setup email transporter
var transporter = nodemailer.createTransport({
    service: config.get('notifications.email.service'),
    auth: {
        user: config.get('notifications.email.user'),
        pass: config.get('notifications.email.pass')
    }
});

// public api --------------------------------------------------

export default {

    /**
     * Send
     *
     * Takes an email address, a subject, a template name
     * and a data object and immediately sends an email.
     */
    send (email, callback) {

        // template data
        let html = templates[email.template](email.data);

        // inline styles
        html = juice(html);

        // configure mail options
        var mailOptions = {
            from: config.get('notifications.email.user'),
            to: email.to,
            subject: email.subject,
            html: html
        };

        // send email
        transporter.sendMail(mailOptions, callback);

    }

};