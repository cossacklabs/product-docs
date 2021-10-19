---
weight: 4
title: Troubleshooting issues with keys
bookCollapseSection: true
---

# Troubleshooting issues with keys

## Renaming key files

Acra stores private keys in encrypted form.
Each key has a special filename associated with its Client or Zone ID.

The keys are encrypted using Authenticated Encryption with Associated Data (AEAD),
where the Client or Zone ID acts as associated data for AEAD.
This means that if you rename any private key file (transport, storage, poison record key, etc.)
and lose the information about its former name,
Acra won’t be able to decrypt the key.
In this case, it will be impossible to decrypt the data and you will lose access to it.

Do not rename your keys.
If you did – rename them back to their original name before attempting to decrypt your data.
Keep in mind that carelessly renaming files may accidentally overwrite and delete keys.

## Losing the keys

If you lose the _master key_ that’s used for launching AcraServer,
it won’t be able to decrypt the data.
Yes, it means that there will be absolutely no way to decrypt your data and you’ll lose it forever.
Store the master key safely!
Make, refresh, and regularly check backups.

If the private keys are lost, there will be no way to decrypt the data either.
So store the private keys safely as well!

We recommend storing private keys and the master key in a reliable place (e.g., KMS, HSM).
[Acra Enterprise Edition](https://www.cossacklabs.com/acra/#pricing) supports many popular KMS solutions.

Acra EE users have a chance to retrieve their public keys
if you still have your private keys and master keys.
If you’ve encountered such a problem, please [contact us](mailto:dev@cossacklabs.com).

## Key decryption errors

You may encounter the following error messages produced by AcraConnector:

```
time="2019-04-03T11:43:16Z" level=info msg="Connect to AcraServer" client_id=backend_client connection_string="tcp://acraserver-acralivedemo:9393/"
time="2019-04-03T11:43:16Z" level=error msg="Can't wrap connection" client_id=backend_client code=538 error="Failed to unprotect data"
time="2019-04-03T11:43:16Z" level=info msg="Close connection with client" client_id=backend_client
```

And by AcraServer:

```
time="2019-04-03T11:43:57Z" level=info msg="Got new connection to AcraServer: 172.20.0.3:42164" connection_string="tcp://0.0.0.0:9393" from_descriptor=false
time="2019-04-03T11:43:57Z" level=error msg="Can't wrap connection from acra-connector" code=538 error=EOF
```

As `"Can't wrap connection"` and `"Failed to unprotect data"` error messages suggest,
this means that AcraServer or AcraConnector cannot decrypt the private transport key
necessary to initialise Secure Session.

Possible reasons why AcraServer or AcraConnector can’t decrypt the private keys:

- keys were renamed
- keys were rewritten with other keys
- keys are associated with a different Client ID

Make sure that you haven’t renamed the keys and rename them back if possible.
