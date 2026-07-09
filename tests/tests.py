import unittest
import recaller

class TestApp(unittest.TestCase):

    def test_search_drug(self):
        response = recaller.search_drug("Ibuprofen")
        self.assertEqual(type(response), list)

    def test_search_cosmetic(self):
        response = recaller.search_cosmetics("Blush")
        self.assertEqual(type(response), list)

    def test_search_food(self):
        response = recaller.search_food("Chicken")
        self.assertEqual(type(response), list)

    