import os
import unittest

os.environ["GENAI_KEY"] = "fake-key"

import recaller


# unit test function
class TestRecaller(unittest.TestCase):
    # Checking no results
    def test_check_food_no_results(self):
        res = recaller.check_food("chicken", summarize=False)

        self.assertIsNone(res)

    # testing the delete food feature
    def test_delete_food(self):
        res = recaller.delete_food(1)

        self.assertIsNone(res)

    # check random food
    def test_check_food_random_food(self):
        res = recaller.check_food("asdfghjkl", summarize=False)

        self.assertIsNone(res)


if __name__ == "__main__":
    unittest.main()
