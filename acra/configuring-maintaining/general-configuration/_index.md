---
title: General configuration
bookCollapseSection: true
---

### General configuration
- Generate keypair (see how to do it [here]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#generating-all-the-acra-keys-in-one-go-INVALID" >}})).
- Configure secure transport using [AcraConnector]({{< ref "acra/security-controls/transport-security/acra-connector.md#acraconnector-and-acrawriter-INVALID" >}}) or [TLS]({{< ref "acra/configuring-maintaining/tls/" >}}):
- Deploy [AcraServer]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#getting-started-with-acraserver-INVALID" >}}) to a separate machine:
- Integrate AcraWriter closely following the [examples](https://github.com/cossacklabs/acra/tree/master/examples) and using either AcraConnector (if available on this machine) or direct TLS database connection.
- Test everything:

  **1.** Connect AcraConnector to AcraServer, send a regular request to your database through AcraConnector.<br/>_Result_: If you see the answer, AcraConnector and AcraWriter are able to connect and forward signals back and forth. It means that the network and the keys are fine.

  **2.** Upon integrating AcraWriter into your code, try generating an [AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) from some payload.<br/>_Result_: If you succeed in running AcraWriter code, Themis library is installed properly and some of the keys are located in the expected place.

  **3.** Write a row with AcraStruct into the database, either directly or through AcraConnector. Request this row through AcraConnector.<br/>_Result_: If you see decrypted payload in the response, the scheme works properly.

- Thoroughly read the documentation.
- Use Acra!
- P.S. Feel free to raise an [Issue](https://github.com/cossacklabs/acra/issues) or contact us at [info@cossacklabs.com](mailto:info@cossacklabs.com).