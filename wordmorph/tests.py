"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""

from django.test import TestCase
import utils as ut

class GraphGenerationTest(TestCase):
    def test_one_different(self):
        test_word = "abcde"
        test_set = [
            ("abcde", False),
            ("abxde", True),
            ("xbcde", True),
            ("abcdx", True),
            ("xbxdx", False),
            ("abcxx", False),
            ("abde", True),
            ("bcde", True),
            ("abcd", True),
            ("bcd", False),
            ("abc", False),
            ("cde", False),
            ("abdx", False),
            ("abcdef", True),
            ("zabcde", True),
            ("abcxde", True),
            ("zabcdef", False),
            ("abcdefg", False),
            ("zabde", False)]
        for word, condition in test_set:
            self.assertEquals(ut.one_different(test_word, word), condition, "%s, %s" % (test_word, word))
            self.assertEquals(ut.one_different(word, test_word), condition, "%s, %s" % (test_word, word))


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.failUnlessEqual(1 + 1, 2)

__test__ = {"doctest": """
Another way to test that 1 + 1 is equal to 2.

>>> 1 + 1 == 2
True
"""}

