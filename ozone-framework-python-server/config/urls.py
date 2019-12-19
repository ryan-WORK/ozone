"""owf_framework URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.urls import path, re_path
from django.views.generic import TemplateView
from .views import SystemVersionView, HelpFileView, LoginView, LogoutView, AuditView, AccessView


template_context = {
    'server_url': settings.SERVER_URL,
    'enable_login': str(settings.ENABLE_LOGIN).lower(),
    'enable_logout': str(settings.ENABLE_LOGOUT).lower(),
    'enable_consent': str(settings.ENABLE_CONSENT).lower(),
    'consent_title': settings.CONSENT_TITLE,
    'consent_message': settings.CONSENT_MESSAGE,
    'enable_user_agreement': str(settings.ENABLE_USER_AGREEMENT).lower(),
    'user_agreement_title': settings.USER_AGREEMENT_TITLE,
    'user_agreement_message': settings.USER_AGREEMENT_MESSAGE
}

urlpatterns = [
    re_path(r'^$', login_required(TemplateView.as_view(template_name='index.html')), template_context),
    path('api/v2/auth/login/', LoginView.as_view(), name='login'),
    path('api/v2/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/v2/', include('dashboards.urls')),
    path('api/v2/', include('intents.urls')),
    path('api/v2/', include('owf_groups.urls')),
    path('api/v2/', include('people.urls')),
    path('api/v2/', include('preferences.urls')),
    path('api/v2/', include('roles.urls')),
    path('api/v2/', include('stacks.urls')),
    path('api/v2/', include('widgets.urls')),
    path('api/v2/', include('appconf.urls')),
    path('api/v2/', include('metrics.urls')),
    path('system-version', SystemVersionView.as_view(), name='system-version-url'),
    path('api/v2/help/', HelpFileView.as_view(), name='help_files'),
    path('audit', AuditView.as_view(), name='audit'),
    path('api/v2/access/getConfig/', AccessView.as_view(), name='access_get_config'),
    path('', include('legacy.urls')),
] + static(settings.HELP_FILES_URL, document_root=settings.HELP_FILES)

if settings.ENABLE_LOGIN:
    urlpatterns.append(
        path('login.html', TemplateView.as_view(template_name='login.html'), template_context)
    )

if settings.DEBUG:
    from rest_framework import permissions
    from drf_yasg.views import get_schema_view
    from drf_yasg import openapi
    schema_view = get_schema_view(
        openapi.Info(
            title="OWF Server API",
            default_version='v2',
            description="OWF Server Endpoints",
            terms_of_service="",
            contact=openapi.Contact(email=""),
            license=openapi.License(name="MIT License"),
        ),
        public=True,
        permission_classes=(permissions.AllowAny,),
    )

    urlpatterns.extend([
        path('admin/', admin.site.urls),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
        # path('accounts/', include('rest_framework.urls')),
        # static(settings.HELP_FILES_URL, document_root=settings.HELP_FILES)
    ])


if settings.ENABLE_CAS:
    import django_cas_ng.views

    urlpatterns.extend([
        path('cas/login/', django_cas_ng.views.LoginView.as_view(), name='cas_ng_login'),
        path('cas/logout/', django_cas_ng.views.LogoutView.as_view(), name='cas_ng_logout'),
    ])
