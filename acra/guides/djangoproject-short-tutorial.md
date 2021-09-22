---
title: "Integration example: DjangoProject - short tutorial"
bookCollapseSection: true
---

# Integrating Acra with DjangoProject

This tutorial shows a typical process of integrating Acra into a Python web app. More specifically - an app running on 
Django framework. It is based on the popular example many Django users start their development journey with - 
[djangoproject.com repository](https://github.com/django/djangoproject.com).

We will be integrating [AcraWriter]({{< ref "/acra/configuring-maintaining/installing/building-acrawriter.md" >}}) 
to protect blog posts.

This tutorial assumes that you have both AcraServer and PostgreSQL up and running.

You may browse the modified repository [here](https://github.com/cossacklabs/djangoproject.com).


## Step 1. Clone repo
```bash
git clone https://github.com/django/djangoproject.com.git
```

## Step 2. Install AcraWriter
```bash
pip install acrawriter
```

## Step 3. Save AcraServer public key to settings

Save AcraServer public key to settings as `ACRA_SERVER_PUBLIC_KEY`:

```python
# djangoproject/settings/common.py
import json
import os
from base64 import b64decode
.
.
.
ACRA_SERVER_PUBLIC_KEY = b64decode(SECRETS.get('acra_server_public_key'))
```

## Step 4. Create conf/secrets.json and paste AcraServer public key as base64 string
```json
{
    . . .
    "acra_server_public_key": "VUVDMgAAAC1w3M1uArNP+AWNhmOi6+bR6SXadlPbAh3XFnBuOnLziPeHn70T"
    . . .
}

```

## Step 5. Use model fields from acrawriter.django module
```python
# blog/models.py
. . .
import acrawriter.django
. . .

class Entry(models.Model):
    . . .
    headline = acrawriter.django.CharField(max_length=200)
    summary = acrawriter.django.TextField()
    summary_html = acrawriter.django.TextField()
    body = acrawriter.django.TextField()
    body_html = acrawriter.django.TextField()
    author = acrawriter.django.CharField(max_length=100)
    . . .

```

```python
# members/models.py
. . .
import acrawriter.django
. . . 
 
 
class IndividualMember(models.Model):
    email = acrawriter.django.EmailField(unique=True)
    contact_email = acrawriter.django.EmailField()
    billing_email = acrawriter.django.EmailField(blank=True, help_text='If different from contact email.',)
    . . .
```

## Step 6. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Update database connection settings

Now your app should connect to local AcraConnector. Run AcraConnector on the same port as before and change db_host/trac_db_host in your conf/secrets.conf to 127.0.0.1
```json
{ 
  "secret_key": "xyz",
  "db_host": "127.0.0.1",
  "trac_db_host": "127.0.0.1",
  "acra_server_public_key": "VUVDMgAAAC1w3M1uArNP+AWNhmOi6+bR6SXadlPbAh3XFnBuOnLziPeHn70T"
}
```

## Step 7. Add AcraWriter to requirements/common.txt
```
. . .
stripe==1.43.0
Sphinx==1.4.9
acrawriter==1.0.0
```

Voila! Congratulations! You've integrated Acra.