from wmt_v2.models import PrimitiveTechnique, CustomUser
from wmt_v2.serializers import PrimitiveTechniqueSerializer, CustomUserSerializer

from rest_framework import status
from rest_framework.response import Response

from django.http import Http404, HttpResponse
from rest_framework.views import APIView

from rest_framework import permissions
from wmt_v2.permissions import IsOwnerOrReadOnly

from rest_framework.permissions import IsAuthenticated, AllowAny

from shutil import make_archive
import re

from django.core.mail import EmailMessage
from django.conf import settings
import uuid
import os
import io
import shutil
import zipfile
import json
from django.core.files.temp import NamedTemporaryFile

from wmt_v2.Instrumentacion.Instrumentador import instrumentar

from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password

# Create your views here.
class WMTFilesList(APIView):
    """ USO ESTE """
    def post(self, request, format=None):
        
        # los campos aux
        cant = request.data['cant']

        # necesito el field de cual primitiva quiero
        primitiveId = request.data['primitiveId']
        primitiveTechnique = PrimitiveTechnique.objects.get(pk=primitiveId)
        serializer = PrimitiveTechniqueSerializer(primitiveTechnique)

        folderDestination = str(uuid.uuid4())
        files_path = "wmt_APIv2/wmt_project/wmt_v2/Storage/" + folderDestination + "/"
        os.makedirs(files_path, exist_ok=True)
        
        # crear el proyecto en una carpeta con nombre de uuid
        paths = {key:value for (key,value) in request.data.items() if re.match("path+", key)} # FILTRO LA DATA DE LA REQUEST PARA ARMAR UN DICT SOLO CON LOS PATHS
        
        # errors = instrumentar(request.FILES, paths, int(cant), serializer.data.get('importSentence'), serializer.data.get('fileBrokerSentence'), folderDestination)
        errors = instrumentar(request.FILES, paths, serializer.data.get('importSentence'), serializer.data.get('fileBrokerSentence'), folderDestination)        
        # armado del rar
        zipFilesPath = files_path.rstrip('/')
        try:
            data = open(make_archive(zipFilesPath, 'zip', zipFilesPath), 'rb').read()

        finally:
            #os.remove(files_path[0:-1] + ".zip")
            print("-")
        
        # armado del response 
        filename = request.data["path1"].split("/")[0]

        response = HttpResponse(data, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{filename} - protected.zip"'

        # Serializamos los errores a JSON y los exponemos en un header
        response['X-WMT-Errors'] = json.dumps(errors)
        # Para que el navegador nos deje leer ese header en el front:
        response['Access-Control-Expose-Headers'] = 'Content-Disposition, X-WMT-Errors'

        if os.path.isdir(files_path):
            shutil.rmtree(files_path)
        return response

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DownloadBaseListener(APIView):
    def post(self, request, format=None):
        # Ruta del archivo a incluir
        file_path = "wmt_APIv2/wmt_project/wmt_v2/Storage/JavaBaseListener/ProtectionTechniqueName.py" # PATH RELATIVO, PUEDE FALLAR, CHEQUEAR
        if not os.path.isfile(file_path):
            print("error", "Archivo no encontrado")

        # Crear el zip en memoria
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.write(file_path, arcname="ProtectionTechniqueName.py")

        zip_buffer.seek(0)

        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="JavaBaseListener.zip"'
        return response

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ----------- primitive -----------------------
def uniqueFileName(fileName):
    fileName = fileName.split('.')
    fileName[0] += "___" +  str(uuid.uuid4()).replace('-', '_') + "___"  
    fileName = '.'.join(fileName)
    return fileName

class PrimitiveTechniqueListAdmin(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        primitiveTechniques = PrimitiveTechnique.objects.all()
        serializer = PrimitiveTechniqueSerializer(primitiveTechniques, many=True)
        return Response(serializer.data)

class PrimitiveTechniqueList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        
        primitiveTechniques = PrimitiveTechnique.objects.filter(checked=True)
        serializer = PrimitiveTechniqueSerializer(primitiveTechniques, many=True)
        
        JSONresponse = []
        for item in serializer.data:
            JSONresponse.append({key:item[key] for key in ('id', 'primitiveName', 'primitiveDescription')})

        return Response(JSONresponse)

    def post(self, request, format=None):
        
        request.data['primitiveFile'].name = uniqueFileName(request.data['primitiveFile'].name)
        
        serializer = PrimitiveTechniqueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # envair mail de solicitud
            mail = EmailMessage(
                 'Solicitud de Aprobacion de Primitiva',
                "\nId: " + str(serializer.data.get('id', "-")) + 
                        "\nNombre de archivo de la primitiva: " + request.data['primitiveFile'].name + 
                        "\nNombre de la clase del archivo: " + str(serializer.data.get('primitiveClassName', "-")) +
                        "\n\nImport generado: " + str(serializer.data.get('importSentence', "-")) + 
                        "\nInvocacion a la clase: " + str(serializer.data.get('fileBrokerSentence', "-")) + 
                        "\n\nMensaje del solicitante: " + str(serializer.data.get('primitiveMessage', "-")) + 
                        "\n\nDescripcion de lo que hace y el uso de la tecnica de proteccion: " + str(serializer.data.get('primitiveDescription', "-")) + 
                        "\nEmail del solicitante: " + str(serializer.data.get('autorEmail', "-")),
                settings.EMAIL_HOST_USER,
                [settings.RECIPIENT_ADDRESS],
            )
            mail.attach_file('wmt_project/wmt_v2/Storage/PrimitiveTechnique/' + request.data['primitiveFile'].name)
            mail.send()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PrimitiveTechniqueDetail(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            return PrimitiveTechnique.objects.get(pk=pk)
        except PrimitiveTechnique.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        primitiveTechnique = self.get_object(pk)
        serializer = PrimitiveTechniqueSerializer(primitiveTechnique)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        primitiveTechnique = self.get_object(pk)
        serializer = PrimitiveTechniqueSerializer(primitiveTechnique, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        primitiveTechnique = self.get_object(pk)
        serializer = PrimitiveTechniqueSerializer(primitiveTechnique)

        # borrar file
        os.remove(str(primitiveTechnique.file))
        
        primitiveTechnique.delete()
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
    



#---------------- USER ------------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = CustomUser.objects.get(email=email)

        if user and check_password(password, user.password):
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
class RegisterView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            # Hash de la contraseña antes de almacenarla en la base de datos
            password = make_password(serializer.validated_data['password'])
            
            user = serializer.save(password=password)
            
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MyUserInfoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # `request.user` contiene la instancia del usuario autenticado
        user = request.user

        if isinstance(user, CustomUser):
            # Accede a los atributos específicos de CustomUser
            user_data = {
                'first_name': user.first_name,
                # Otros atributos que puedas querer incluir
            }

            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'El usuario no existe'})
        
class UserMail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # `request.user` contiene la instancia del usuario autenticado
        user = request.user

        if isinstance(user, CustomUser):
            # Accede a los atributos específicos de CustomUser
            user_data = {
                'email': user.email,
                # Otros atributos que puedas querer incluir
            }

            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'El usuario no existe'})
        



class ApprovePrimitiveTechniqueView(APIView):
    def post(self, request, pk):
        try:
            primitive = PrimitiveTechnique.objects.get(pk=pk)
        except PrimitiveTechnique.DoesNotExist:
            return Response({'error': 'Primitiva no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        primitive.checked = True
        primitive.save()

        serializer = PrimitiveTechniqueSerializer(primitive)
        return Response(serializer.data, status=status.HTTP_200_OK)