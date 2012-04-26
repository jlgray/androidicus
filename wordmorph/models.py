from django.db import models

class EdgeList(models.Model):
    word = models.CharField(max_length=32, db_index=True)
    neighbor =  models.CharField(max_length=32, db_index=True)


class BadWord(models.Model):
    word = models.CharField(max_length=32, db_index=True)
    