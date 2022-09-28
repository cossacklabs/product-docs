---
weight: 4
title: Troubleshooting issues with keys
bookCollapseSection: true
---

# Troubleshooting issues with keys

## Renaming key files

Acra stores intermediate keys in encrypted form (only public keys are not encrypted).
Each key has a special name associated with its Client or Zone ID (zone keys are deprecated since 0.94.0, will be removed in 0.95.0).

The keys are encrypted using Authenticated Encryption with Associated Data (AEAD),
where the Client or Zone ID acts as associated data for AEAD.

This means that if you rename any private key file (transport, storage, poison record key, etc.)
and lose the information about its former name, Acra won’t be able to decrypt the key.
In this case, it will be impossible to decrypt the data, so you will lose access to it.

**Do not rename Acra's keys.**

If you did – rename them back to their original name before attempting to decrypt your data.
Keep in mind that carelessly renaming files may accidentally overwrite and delete keys.

## Losing the keys

If you lose the _Acra Master Key_ used for launching AcraServer/AcraTranslator,
they won’t be able to decrypt the data.

Yes, it means that there will be absolutely no way to decrypt your data, and you’ll lose it forever.
Store the master key safely in a secure storage like KMS!
Make, refresh, and regularly check backups.

If the intermediate keys are lost, there will be no way to decrypt the data either.
So store the intermediate keys safely as well!

We recommend storing intermediate keys in secure storage with enabled backups and Acra Master Key in a KMS.

[Acra Enterprise Edition](/acra/enterprise-edition/) supports many popular KMS solutions.

Users of [Acra Enterprise Edition](/acra/enterprise-edition/) have a chance to retrieve their public keys
if they still have private keys and Acra Master Keys. If you’ve encountered such a problem, please [contact your sales representative](mailto:sales@cossacklabs.com).


## Key decryption errors

You may encounter the following error messages produced by AcraServer/AcraTranslator when you use AcraConnector for transport security:

```
time="2019-04-03T11:43:57Z" level=info msg="Got new connection to AcraServer: 172.20.0.3:42164" connection_string="tcp://0.0.0.0:9393" from_descriptor=false
time="2019-04-03T11:43:57Z" level=error msg="Can't wrap connection from acra-connector" code=538 error=EOF
```

Or by AcraConnector:

```
time="2019-04-03T11:43:16Z" level=info msg="Connect to AcraServer" client_id=backend_client connection_string="tcp://acraserver-acralivedemo:9393/"
time="2019-04-03T11:43:16Z" level=error msg="Can't wrap connection" client_id=backend_client code=538 error="Failed to unprotect data"
time="2019-04-03T11:43:16Z" level=info msg="Close connection with client" client_id=backend_client
```


As `"Can't wrap connection"` and `"Failed to unprotect data"` error messages suggest,
this means that AcraServer, AcraTranslator or AcraConnector cannot decrypt the private transport key
necessary to initialise Themis Secure Session.

Possible reasons why AcraServer, AcraTranslator or AcraConnector can’t decrypt the private keys:

- keys were renamed
- keys were rewritten with other keys
- keys are associated with a different Client ID

Make sure that you haven’t renamed the keys and rename them back if possible.
