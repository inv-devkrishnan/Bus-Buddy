import logging
import smtplib
import os
from dotenv import load_dotenv
load_dotenv('busbuddy_api.env')
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from adminstrator.models import Email

logger = logging.getLogger("django")


def send_email_with_template(subject, template, context, recipient_list, status):
    """
    Sends an email with a rendered HTML template.

    Parameters:
    - subject (str): The subject of the email.
    - template (str): The path to the HTML template to be rendered.
    - context (dict): A dictionary containing context data to be used in rendering the template.
    - recipient_list (list): A list of email addresses to send the email to.
    - status: indicates the type of mail 0->booking confirmation,1->booking cancelation,2->bus owner approval

    Returns:
    Boolean

    Raises:
    - smtplib.SMTPAuthenticationError: If there is an SMTP authentication error while sending the email.
    - Exception: If an unknown error occurs while sending the email.
    """
    message = render_to_string(template, context=context)
    from_email = os.getenv("EMAIL_HOST_USER")
    try:
        send_mail(subject, message, from_email, recipient_list, html_message=message)
        logger.info("mail sent !")
        for to_email in recipient_list:
            Email.objects.create(
                from_email=from_email, to_email=to_email, status=status
            )
        logger.info("added Entry to mail table")
        return True

    except smtplib.SMTPAuthenticationError as e:
        logger.warn("Authentication Error Occured while Sending mail\n" + str(e))
        return False

    except Exception as e:
        logger.warn("unknown Error Occured " + str(e))
        return False


def send_email_with_attachment(
    subject,
    message,
    recipient_list,
    attachment_content,
    attachment_filename,
    content_type,
    status,
):
    """
    Sends an email with attachment like pdf

    Args:
        subject (str): The subject of the email
        message (str): The message to be shown in the email
        recipient_list (list): A list of email to send the email
        attachment_content (bytes): The attachment(document,text file,pdf or image)
        attachment_filename (str): The attachment name
        content_type (str): The MIME type of the file
        status (int): indicates the type of mail 0->booking confirmation,1->booking cancelation,2->bus owner approval


    Returns:
    Boolean: true if mail has been send else false

    Raises:
    - smtplib.SMTPAuthenticationError: If there is an SMTP authentication error while sending the email.
    - Exception: If an unknown error occurs while sending the email.
    """
    from_email = os.getenv("EMAIL_HOST_USER")
    email = EmailMessage(subject, message, from_email, recipient_list)
    email.attach(attachment_filename, attachment_content, content_type)

    try:
        email.send()
        Email.objects.create(
            from_email=from_email, to_email=recipient_list, status=status
        )
        logger.info("Email sent successfully!")
        return True

    except smtplib.SMTPAuthenticationError as e:
        logger.warn("Authentication Error Occured while Sending mail\n" + str(e))
        print(f"Error sending email: {e}")
        return False

    except Exception as e:
        logger.warn("unknown Error Occured " + str(e))
        print(f"Error sending email: {e}")
        return False
