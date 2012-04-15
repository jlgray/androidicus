import re
from django import forms
from wordmorph.models import WordNode

class WordmorphForm(forms.Form):

    def clean(self):
        cleaned_data = super(WordmorphForm, self).clean()
        start_word = cleaned_data.get("start_word")
        end_word = cleaned_data.get("end_word")
        if start_word and end_word:
            if len(end_word) != len(start_word):
                raise forms.ValidationError("Words must be the same length")

        return cleaned_data


    def validate_word(self, key):
        word = self.cleaned_data[key].lower()

        #Check if word is only letters
        if re.search(r"[^a-z]+", word):
            raise forms.ValidationError("Only letters are allowed")
        """
        #Check if word is in the database
        try:
            word_node = WordNode.objects.get(word=word)
        except WordNode.DoesNotExist:
            raise forms.ValidationError("Must be an English word")
        """
        if not word:
            raise forms.ValidationError("%s is required" % " ".join([s[0].upper()+s[1:] for s in key.split("_")]))

        return word

    def clean_start_word(self):
        return self.validate_word("start_word")

    def clean_end_word(self):
        return self.validate_word("end_word")
    
    start_word = forms.CharField()
    end_word = forms.CharField()