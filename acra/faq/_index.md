---
title: Frequently asked questions
bookCollapseSection: true
---

There are a number of concerns that do not fit other pages, yet are asked by our adopters and customers. Until they gather their logical representation in the menu, they stay in FAQ.

Q: I need Acra to work with <Datastore X>, <Feature Y>, <Database Z>. What should I do? 
A: Acra has been designed to be sufficiently extentable. Feel free to contribute your implementation, but consult Contributing (TODO: link) section first. If you are looking for someone to implement it, talk to (TODO: link) our sales team, we're happy to explore different opportunities to make things happen without breaking a budget. 

Q: Acra does not support highly-complex SQL statement in exotic PostgreSQL fork under rare circumstances, what do I do? 
A: We're constantly improving Acra's SQL parser, but we are small company with limited resources. Aside from Acra, problems with wire protocol / SQL support could stem from database you're using - 100% protocol compatibility is, indeed, rare. 

Q: Does Acra support .pem, .p12, .key, .pkcs12 and other key storage formats? 
A: No. Acra's keys are tightly bound to data structures it operates and cryptographic protocols that these data structures implement. For performance reasons, Acra's keys are much simpler and straightforward than most widely recognized formats. You can, though, store some of Acra's keys in these formats (TODO: verify and link). 
  
  
