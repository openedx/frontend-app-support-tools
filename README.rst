|Build Status| |Codecov| |license|

frontend-app-support-tools
=================================

Introduction
------------

This repository contains a series of support tools for the OpenedX platform.

Getting Started
---------------

**Prerequisite**

`Devstack <https://edx.readthedocs.io/projects/edx-installing-configuring-and-running/en/latest/installation/index.html>`_.
If you start Devstack with ``make dev.up`` that should give you everything you need as a companion to this frontend.

**Installation and Startup**

1. Clone your new repo:

  ``git clone <Repo URL above>``

2. Install npm dependencies:

  ``cd frontend-app-support-tools && npm install``

3. Start the dev server:

  ``npm start``

The dev server is running at `http://localhost:18450 <http://localhost:18450>`_.

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/edx/frontend-template-application/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
-------------------

**Production Build**

The production build is created with ``npm run build``.

Internationalization
--------------------

Please see `edx/frontend-platform's i18n module <https://edx.github.io/frontend-platform/module-Internationalization.html>`_ for documentation on internationalization.  The documentation explains how to use it, and the `How To <https://github.com/edx/frontend-i18n/blob/master/docs/how_tos/i18n.rst>`_ has more detail.

.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-template-application.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-template-application
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-template-application/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-template-application
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-template-application.svg
   :target: @edx/frontend-template-application
