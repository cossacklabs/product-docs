---
title: On Acra security
weight: 11
---

# On Acra security

Each change in Acra is being reviewed and approved by our internal team of software engineers, security engineers or cryptographers. Changes related to the cryptographic core are being reviewed by cryptographers that don't work on Acra.

Many Acra features were first published as technologies and papers, and were peer-reviewed by known reviewers. For example, [searchable encryption](https://eprint.iacr.org/2019/806.pdf) or [cryptographically-signed audit logging](https://www.cossacklabs.com/blog/crypto-signed-audit-logs.html).


## Own security controls

TODO


## Development process

We use a lot of automated security testing:
e.g., static code analysers, memory analysers, unit tests (per feature, per service),
integration tests (per service, per use case), 
end-to-end tests (running complete scenarios from application via Acra to the database and back).

We run tests per every pull request, nightly, per release and auto deploy Acra-based playgrounds (mini-infrastructures) to verify that Acra works correctly.

Read more about our security testing practices [in this blog series](https://dev.to/cossacklabs/automated-software-security-testing-for-devs-part-1-gcf).

TODO: add about dependency checkers


## Security issues

If you believe that you've found a security-related issue, please drop us an email to [dev@cossacklabs.com](mailto:dev@cossacklabs.com). Bug bounty program may apply.


## No liability

Acra Community Edition comes with no public liability of its security. We have done a lot to improve Acra Enterprise Edition to work in hostile environments and slowly porting some of these features into Acra Community Edition for the benefit of broader community, but they do not go the same depth of scrutiny internally.