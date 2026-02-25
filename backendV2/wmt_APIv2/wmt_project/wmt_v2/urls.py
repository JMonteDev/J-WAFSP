from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from wmt_v2 import views


router = DefaultRouter()

urlpatterns = [    
    # Entiendo que no es la forma recomendada para enrutar
    path('WMTFilesClass/', views.WMTFilesList.as_view()),
    path('DownloadBaseListener/', views.DownloadBaseListener.as_view()),
    path('approve/<int:pk>/', views.ApprovePrimitiveTechniqueView.as_view(), name='approve-primitive'),

    path('PrimitiveTechnique/', views.PrimitiveTechniqueList.as_view()),
    path('PrimitiveTechnique/<pk>/', views.PrimitiveTechniqueDetail.as_view()),
    path('PrimitiveTechniqueAdmin/', views.PrimitiveTechniqueListAdmin.as_view()),

    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('getUser/', views.MyUserInfoView.as_view(), name='getUser'),
    path('getEmail/', views.UserMail.as_view(), name='getEmail'),
    
    path('', views.RegisterView.as_view(), name='register2'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])