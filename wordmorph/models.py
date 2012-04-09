from django.db import models

class WordNode(models.Model):
    text = models.CharField(max_length=31, db_index=True)
    neighbors = models.ManyToManyField('self', symmetrical=True)
    visited = models.BooleanField(default=False)

class BadWord(models.Model):
    word = models.ForeignKey(WordNode)
    