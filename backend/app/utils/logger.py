import logging

# LOGGER
logger = logging.getLogger('app')

# CONFIGURE LOGGER
# Create a File Handler to separate app's logs from flask's logs

logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)

# Create a formatter and set it for the handler
formatter = logging.Formatter("[%(asctime)s] %(module)s\t- %(levelname)s: %(message)s",
                              datefmt="%H:%M:%S")

handler.setFormatter(formatter)
logger.addHandler(handler)
