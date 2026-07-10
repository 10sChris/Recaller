import unittest
import recaller

class testApp(unittest.TestCase):

    def test_search_drug(self):
        response = recaller.search_drug("Tylenol")
        self.assertEqual(type(response), list)

    def test_search_cosmetic(self):
        response = recaller.search_cosmetics("Blush")
        self.assertEqual(type(response), list)

    def test_search_food(self):
        response = recaller.search_food("Chicken")
        self.assertEqual(type(response), list)

    def test_search_drug_is_not_none(self):
        response= recaller.search_drug("Nyquil")
        self.assertIsNotNone(response)

    def test_search_cosmetic_is_not_none(self):
        response= recaller.search_cosmetics("Cerave")
        self.assertIsNotNone(response)

    def test_search_food_is_not_none(self):
        response= recaller.search_food("Coke")
        self.assertIsNotNone(response)

if __name__  == "__main__":
    unittest.main()