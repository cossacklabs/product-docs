---
weight: 1
title: US crypto export regulations
---

# US crypto export regulations for Themis

When you distribute apps via platforms like App Store or Google Play,
the binaries are typically hosted on servers located within US, owned by US companies.
United States laws treat this activity as export, which is heavily regulated for cryptography.

However, typical Themis use cases fall under “open source” exceptions.
This makes compliance much easier if your app is open source as well.

{{ note warning }}
**Note:**
If your app is not open source or is not distributed free of charge,
we strongly recommend that you seek professional legal advice.
{{ /note }}


## Submitting apps to App Store

If your application uses Themis and you want to submit it to the Apple App Store,
you are required to do the following:

 1. Indicate that you're using cryptography when submitting your application for review.

    Select “YES” to say that your application incorporates cryptography.

 2. Apply for the “open source” exemption.

    When filling the next step in the App Store submission form,
    select “NO” in the _Export Compliance_ section.

    Themis cryptographic library is exempt from the need for detailed classification.
    Themis uses standard publicly available ciphers
    provided by open source OpenSSL and BoringSSL libraries on Apple platforms.

 3. Send an annual (year-end) self-classification report to the US government
    to comply with the [encryption export regulations](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

Read more in the official [Apple export compliance overview](https://help.apple.com/app-store-connect/#/dev88f5c7bf9)
and [BIS guidelines](https://bis.doc.gov/index.php/policy-guidance/encryption/1-encryption-items-not-subject-to-the-ear)
(you might need to use a VPN to access it).

## Submitting apps to Google Play

If your application uses Themis and you want to submit it to the Google Play,
you are required to do the following:

 1. Send an annual (year-end) self-classification report to the US government
    to comply with the encryption export regulations.

Read more in the [Google Play guidelines](https://support.google.com/googleplay/android-developer/answer/113770?hl=en).

## Submitting an annual self-classification report to BIS

The procedure is as follows.

 1. [Download a copy of the sample CSV file from the BIS website](https://www.bis.doc.gov/index.php/component/docman/?task=doc_download&amp;gid=1675).
 2. Fill it out with your own details.
 3. Email your CSV file to crypt-supp8@bis.doc.gov and enc@nsa.gov.

These are the values that most of our customers use in their CSV reports:

```
ECCN: 5D992.c

AUTHORIZATION TYPE: MMKT

ITEM TYPE: Mobility and mobile applications n.e.s.

NON-U.S. COMPONENTS: N/A

NON-U.S. MANUFACTURING LOCATIONS: N/A
```

Please see
[How to file an Annual Self Classification Report](https://www.bis.doc.gov/index.php/policy-guidance/encryption/4-reports-and-reviews/a-annual-self-classification)
by the Bureau of Industry and Security for more details.

## Additional resources

For further guidance, see these resources:

- A very nice and frequently updated [write-up on submitting the self-classification report](https://simonfairbairn.com/bis-year-end-self-classification-report/) by a developer who does it regularly.

- [Quick reference guide on encryption-related annual self-classification report](https://www.bis.doc.gov/index.php/documents/new-encryption/1652-cat-5-part-2-quick-reference-guide/file).

- Useful recommendations in [Supplement No. 8 to Part 742—Self-Classification Report for Encryption Items](https://www.ecfr.gov/cgi-bin/retrieveECFR?gp=1&amp;SID=4150cfbf028e9a85574385383a581f47&amp;h=L&amp;mc=true&amp;n=pt15.2.742&amp;r=PART&amp;ty=HTML#ap15.2.742_119.6).

- Knowing the [difference between 5d002 and 5d992](https://www.bis.doc.gov/index.php/documents/new-encryption/1653-ccl5-pt2-3/file).

- Our older article [&quot;Apple Export Regulations on Cryptography&quot;](https://medium.com/@cossacklabs/apple-export-regulations-on-crypto-6306380682e1)
  (a lot has changed since 2017 when it was originally written, but it'll give you an insight on why it is necessary to register the encryption tools you use in your applications).
