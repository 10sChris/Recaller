import unittest 

import recaller 


#Unit test function
class TestRecaller(unittest.TestCase):
  def test_recall_summary(self):
    item = {
      "product_description": "Test",
      "reason_for_recall": "possible contamination"    
      }

    res = recaller.summarize_recall(item)

    self.assertIsNotNone(res)

  #Checking no results
  def test_check_food_no_results(self):
    res = recaller.check_food("chicken", summarize=False)

    self.assertIsNone(res)

  #testing the delete food feature
  def test_delete_food(self):
    res = recaller.delete_food(1)

    self.assertIsNone(res)
  
  #making sure it has text
  def test_has_text(self):
    item = {
      "product_description": "Apple Juice", 
      "reason_for_recall": "undeclared ingredient"
    }

    res = recaller.summarize_recall(item)

    self.assertTrue(len(res) > 0)
  
  #check random food
  def test_check_food_random_food(self):
    res = recaller.check_food("asdfighjkl", summarize=False)

    self.assertIsNone(res) 

    

if __name__ == "__main__":
  unittest.main()