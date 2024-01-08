from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader


def render_template(path, template_file, context):
    """
    For rendering a template with context

    Args:
        path (str): path of the folder
        template_file (str): the name of the template to load
        context (str/dict): context for the template

    Returns:
        str: the rendered template
    """
    loader = FileSystemLoader(path)
    env = Environment(loader=loader)
    template = env.get_template(template_file)
    rendered_template = template.render(context)
    return rendered_template


def convert_template_to_pdf(template):
    """
    For converting a template to pdf

    Args:
        template (str): the template in string format

    Returns:
        bytes: pdf content
    """
    pdf_content = HTML(string=template).write_pdf()
    return pdf_content
