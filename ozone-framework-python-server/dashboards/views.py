from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStackOwner
from .models import Dashboard
from .serializers import DashboardBaseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status


class DashboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    # TODO: filter out dashboard's that are marked for deletion on a GET
    queryset = Dashboard.objects.all()
    serializer_class = DashboardBaseSerializer
    permission_classes = (IsAuthenticated, IsStackOwner)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if(instance.user == request.user):
            instance.marked_for_deletion = True
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
