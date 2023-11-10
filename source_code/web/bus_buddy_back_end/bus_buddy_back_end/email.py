import logging
import smtplib
from django.core.mail import send_mail
from django.template.loader import render_to_string
from decouple import config

logger = logging.getLogger("django")


def send_email_with_template(subject, template, context, recipient_list):
    """
    Sends an email with a rendered HTML template.

    Parameters:
    - subject (str): The subject of the email.
    - template (str): The path to the HTML template to be rendered.
    - context (dict): A dictionary containing context data to be used in rendering the template.
    - recipient_list (list): A list of email addresses to send the email to.

    Returns:
    None

    Raises:
    - smtplib.SMTPAuthenticationError: If there is an SMTP authentication error while sending the email.
    - Exception: If an unknown error occurs while sending the email.

    The function renders the HTML template using the provided context and sends an email with the specified
    subject to the recipients in the recipient_list. The sender's email address is retrieved from the
    configuration using the 'EMAIL_HOST_USER' setting.

    Usage:
    send_email_with_template("Subject of the Email", "path/to/template.html", {'key': 'value'}, ['recipient@example.com'])

    Note: Ensure that the necessary configurations for email, such as 'EMAIL_BACKEND', 'EMAIL_HOST_USER',
    'EMAIL_HOST_PASSWORD', etc., are properly set in your Django settings.
    """
    message = render_to_string(template, context=context)
    from_email = config("EMAIL_HOST_USER")
    try:
        send_mail(subject, message, from_email, recipient_list, html_message=message)
        logger.info("mail sent !")
    except smtplib.SMTPAuthenticationError as e:
        logger.warn("Authentication Error Occured while Sending mail\n" + str(e))

    except Exception as e:
        logger.warn("unknown Error Occured " + str(e))
