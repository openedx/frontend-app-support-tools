##########################
frontend-app-support-tools
##########################

|Build Status| |Codecov| |license|

*******
Purpose
*******

This repository contains a series of support tools for the OpenedX platform.

***************
Getting Started
***************

Prerequisite
=============

`Devstack <https://edx.readthedocs.io/projects/edx-installing-configuring-and-running/en/latest/installation/index.html>`_.
If you start Devstack with ``make dev.up`` that should give you everything you need as a companion to this frontend.

========================
Installation and Startup
========================

1. Clone your new repo:

  ``git clone <Repo URL above>``

2. Install npm dependencies:

  ``cd frontend-app-support-tools && npm install``

3. Start the dev server:

  ``npm start``

The dev server is running at `http://localhost:18450 <http://localhost:18450>`_.

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

Getting Help
===========

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-support-tools/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/community/connect

The Open edX Code of Conduct
============================

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

Project Structure
=================

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/openedx/frontend-template-application/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
===================

================
Production Build
================

The production build is created with ``npm run build``.

Internationalization
====================

Please see `edx/frontend-platform's i18n module <https://edx.github.io/frontend-platform/module-Internationalization.html>`_ for documentation on internationalization.  The documentation explains how to use it, and the `How To <https://github.com/openedx/frontend-i18n/blob/master/docs/how_tos/i18n.rst>`_ has more detail.

Reporting Security Issues
=========================

Please do not report security issues in public. Please email security@openedx.org.

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-template-application.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-template-application
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-template-application/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-template-application
