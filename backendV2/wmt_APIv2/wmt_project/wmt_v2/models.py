from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

# Create your models here.
class WMTFile(models.Model):
    file = models.FileField(max_length=None, blank=True)

class CustomUser(AbstractUser):
    username = None

    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    descripcion_personal = models.TextField(blank=True)
    dateJoined = models.DateTimeField(default=timezone.now)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'

class PrimitiveTechnique(models.Model):
    id = models.BigAutoField(primary_key=True)
    created = models.DateTimeField(default=timezone.now)
    primitiveName = models.CharField(max_length=1024)
    primitiveFile = models.FileField(max_length=None, blank=True, upload_to='wmt_project/wmt_v2/Storage/PrimitiveTechnique/')
    primitiveClassName = models.CharField(max_length=1024)
    importSentence = models.TextField()
    fileBrokerSentence = models.TextField()
    primitiveMessage = models.TextField()
    primitiveDescription = models.TextField()
    autorEmail = models.EmailField(max_length = 254)    
    checked = models.BooleanField()
