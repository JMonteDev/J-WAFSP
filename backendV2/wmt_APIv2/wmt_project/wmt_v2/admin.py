from django.contrib import admin
from .models import WMTFile, PrimitiveTechnique, CustomUser

# Register your models here.
admin.site.register(WMTFile) #Model
admin.site.register(PrimitiveTechnique) #Model
admin.site.register(CustomUser) #Model
