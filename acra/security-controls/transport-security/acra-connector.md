---

=======
title: AcraConnector
bookCollapseSection: true
weight: 1
---

# AcraConnector

AcraConnector is a "proxy" component that can work between application and AcraServer or AcraTranslator.
It will create a secure connection to AcraServer or AcraTranslator and will listen for connections from the application on the other side.
The secure connection can be either Themis Secure Session (default) or TLS, depending on configuration.

Also, compared to TLS, the client identifier
(text string that uniquely identifies client and affects which encryption keys will be used when processing this client requests)
will be set by AcraConnector, not taken from client TLS certificate.
Configuration flag for this behavior is `--client_id`.

[Here]({{< ref "acra/configuring-maintaining/general-configuration/acra-connector.md" >}})
you can read more about AcraConnector configuration.
We also got a [guide]({{< ref "acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md" >}})
describing what it is and how you can use it.
