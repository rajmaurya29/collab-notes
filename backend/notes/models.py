from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.

class Note(models.Model):
    title=models.CharField(max_length=20)
    content=models.TextField()
    category=models.CharField(max_length=20,default="work")
    owner=models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    created_at=models.DateField(auto_now_add=True)
    updated_at=models.DateField(auto_now=True)
    share_token=models.UUIDField(default=uuid.uuid4,unique=True,null=True,blank=True,editable=False)
    is_shared=models.BooleanField(default=False)