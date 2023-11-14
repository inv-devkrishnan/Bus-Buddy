import logging
import smtplib
from django.core.mail import send_mail
from django.template.loader import render_to_string
from decouple import config
from adminstrator.models import Email

logger = logging.getLogger("django")


def send_email_with_template(subject, template, context, recipient_list,status):
    """
    Sends an email with a rendered HTML template.

    Parameters:
    - subject (str): The subject of the email.
    - template (str): The path to the HTML template to be rendered.
    - context (dict): A dictionary containing context data to be used in rendering the template.
    - recipient_list (list): A list of email addresses to send the email to.
    - status: indicates the type of mail 0->booking confirmation,1->booking cancelation,2->bus owner approval

    Returns:
    None
    
    Raises:
    - smtplib.SMTPAuthenticationError: If there is an SMTP authentication error while sending the email.
    - Exception: If an unknown error occurs while sending the email.
    """
    message = render_to_string(template, context=context)
    from_email = config("EMAIL_HOST_USER")
    try:
        send_mail(subject, message, from_email, recipient_list, html_message=message)
        logger.info("mail sent !")
        for to_email in recipient_list:
            Email.objects.create(from_email=from_email, to_email=to_email, status=status)
        logger.info("added Entry to mail table")

    except smtplib.SMTPAuthenticationError as e:
        logger.warn("Authentication Error Occured while Sending mail\n" + str(e))

    except Exception as e:
        logger.warn("unknown Error Occured " + str(e))
