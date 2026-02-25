from rest_framework import serializers
from wmt_v2.models import WMTFile, PrimitiveTechnique, CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'descripcion_personal', 'dateJoined']
        extra_kwargs = {
            'password': {'write_only': True},  # Para que el campo de contraseña no sea visible en las respuestas
        }

class PrimitiveTechniqueSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    primitiveName = serializers.CharField(max_length=1024)
    primitiveFile = serializers.FileField(max_length=None, allow_empty_file=False, use_url=True)
    primitiveClassName = serializers.CharField(max_length=1024)
    importSentence = serializers.CharField(required=False)
    fileBrokerSentence = serializers.CharField(required=False)
    primitiveMessage = serializers.CharField(required=True, allow_blank=True)
    primitiveDescription = serializers.CharField(required=True)
    autorEmail = serializers.EmailField(required=True)  
    checked = serializers.BooleanField()
    created = serializers.DateTimeField(required=False)
    
    def create(self, validated_data):
        fileName = validated_data.get('primitiveFile').name.split('.')
        fileName = '.'.join(fileName[0:-1])
        classNameAux = validated_data.get('primitiveClassName') 
        importSentence = 'exec("from wmt_v2.Storage.PrimitiveTechnique.' + fileName + ' import ' + classNameAux + '", globals())'
        fileBrokerSentence = classNameAux + '(stream)'
        validated_data['checked'] = False

        return PrimitiveTechnique.objects.create(importSentence=importSentence, fileBrokerSentence=fileBrokerSentence, **validated_data) 

    def update(self, instance, validated_data):
        instance.primitiveName = validated_data.get('primitiveName', instance.primitiveName)
        instance.primitiveFile = validated_data.get('primitiveFile', instance.primitiveFile)
        instance.primitiveClassName = validated_data.get('primitiveClassName', instance.primitiveClassName)
        instance.importSentence = validated_data.get('importSentence', instance.importSentence)
        instance.fileBrokerSentence = validated_data.get('fileBrokerSentence', instance.fileBrokerSentence)
        instance.primitiveMessage = validated_data.get('primitiveMessage', instance.primitiveMessage)
        instance.primitiveDescription = validated_data.get('primitiveDescription', instance.primitiveDescription)
        instance.autorEmail = validated_data.get('autorEmail', instance.autorEmail)
        instance.checked = validated_data.get('checked', instance.checked)
        instance.save()
        return instance

class WMTFileSerializer(serializers.Serializer):
    files = serializers.FileField(max_length=None, allow_empty_file=False, use_url=True)
